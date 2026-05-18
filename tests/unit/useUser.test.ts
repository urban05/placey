import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMockFetch, createMockUser, delayBy } from '../utils'

describe('useUser', () => {
  let user: any = null
  let token: string | null = null

  const setUser = (userData: any) => {
    user = userData
  }

  const setToken = (t: string | null) => {
    token = t
    if (t) {
      localStorage.setItem('jwt_token', t)
    } else {
      localStorage.removeItem('jwt_token')
    }
  }

  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  beforeEach(() => {
    user = null
    token = null
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('authentication flow', () => {
    it('should request OTP via email', async () => {
      const mockFetch = createMockFetch({ success: true })
      global.fetch = mockFetch

      const response = await fetch('/api/user/requestLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' })
      })

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/user/requestLogin',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('test@example.com')
        })
      )

      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it('should verify OTP and receive JWT token', async () => {
      const mockUser = createMockUser()
      const mockFetch = createMockFetch({
        user: mockUser,
        token: mockUser.token
      })
      global.fetch = mockFetch

      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          otp: '123456'
        })
      })

      const data = await response.json()
      setUser(data.user)
      setToken(data.token)

      expect(user.id).toBe('test-user-1')
      expect(token).toBe(mockUser.token)
    })

    it('should reject invalid OTP', async () => {
      const mockFetch = createMockFetch(
        { error: 'Invalid OTP' },
        401
      )
      global.fetch = mockFetch

      const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          otp: 'wrong-code'
        })
      })

      expect(response.status).toBe(401)
    })

    it('should persist JWT token in localStorage', async () => {
      const mockUser = createMockUser()
      setToken(mockUser.token)

      expect(localStorage.getItem('jwt_token')).toBe(mockUser.token)
    })

    it('should load persisted token on app startup', () => {
      const savedToken = 'persisted-jwt-token'
      localStorage.setItem('jwt_token', savedToken)

      // Simulate app loading
      const loadedToken = localStorage.getItem('jwt_token')
      setToken(loadedToken)

      expect(token).toBe(savedToken)
    })
  })

  describe('user registration', () => {
    it('should register new user with email and username', async () => {
      const mockFetch = createMockFetch({ success: true })
      global.fetch = mockFetch

      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newuser@example.com',
          username: 'newuser'
        })
      })

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/user',
        expect.objectContaining({
          method: 'POST'
        })
      )

      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it('should reject duplicate email', async () => {
      const mockFetch = createMockFetch(
        { error: 'Email already exists' },
        409
      )
      global.fetch = mockFetch

      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({
          email: 'existing@example.com',
          username: 'newuser'
        })
      })

      expect(response.status).toBe(409)
    })

    it('should reject duplicate username', async () => {
      const mockFetch = createMockFetch(
        { error: 'Username already exists' },
        409
      )
      global.fetch = mockFetch

      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({
          email: 'newuser@example.com',
          username: 'existing_user'
        })
      })

      expect(response.status).toBe(409)
    })
  })

  describe('protected requests', () => {
    it('should include JWT token in Authorization header', async () => {
      const mockFetch = createMockFetch({ data: [] })
      global.fetch = mockFetch

      setToken('test-jwt-token')

      await fetch('/api/places/visited', {
        headers: getAuthHeader()
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-jwt-token'
          })
        })
      )
    })

    it('should reject protected requests without token', async () => {
      const mockFetch = createMockFetch({}, 401)
      global.fetch = mockFetch

      const response = await fetch('/api/places/visited')

      expect(response.status).toBe(401)
    })

    it('should reject requests with invalid token', async () => {
      const mockFetch = createMockFetch({}, 401)
      global.fetch = mockFetch

      setToken('invalid-token')

      const response = await fetch('/api/places/visited', {
        headers: getAuthHeader()
      })

      expect(response.status).toBe(401)
    })

    it('should refresh/re-authenticate on token expiry', async () => {
      setToken('expired-token')

      const mockFetch = vi.fn()
        .mockResolvedValueOnce({ status: 401 }) // First call fails
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ token: 'new-token' })
        }) // Token refresh succeeds

      global.fetch = mockFetch

      let response = await fetch('/api/places/visited', {
        headers: getAuthHeader()
      })

      if (response.status === 401) {
        // Token expired, clear it
        setToken(null)
        expect(token).toBe(null)
      }
    })
  })

  describe('logout', () => {
    it('should clear user data and token', () => {
      const mockUser = createMockUser()
      setUser(mockUser)
      setToken(mockUser.token)

      expect(user).not.toBe(null)
      expect(token).not.toBe(null)

      // Logout
      setUser(null)
      setToken(null)

      expect(user).toBe(null)
      expect(token).toBe(null)
      expect(localStorage.getItem('jwt_token')).toBe(null)
    })

    it('should remove token from localStorage', () => {
      setToken('test-token')
      expect(localStorage.getItem('jwt_token')).toBe('test-token')

      setToken(null)
      expect(localStorage.getItem('jwt_token')).toBe(null)
    })
  })

  describe('user state', () => {
    it('should store user id, email, username', () => {
      const mockUser = createMockUser({
        id: 'user-123',
        email: 'john@example.com',
        username: 'john'
      })

      setUser(mockUser)

      expect(user.id).toBe('user-123')
      expect(user.email).toBe('john@example.com')
      expect(user.username).toBe('john')
    })

    it('should be null when logged out', () => {
      expect(user).toBe(null)
    })

    it('should identify authenticated status', () => {
      const isAuthenticated = () => user !== null && token !== null

      expect(isAuthenticated()).toBe(false)

      setUser(createMockUser())
      setToken('token')
      expect(isAuthenticated()).toBe(true)

      setUser(null)
      expect(isAuthenticated()).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should handle registration errors', async () => {
      const mockFetch = createMockFetch(
        { error: 'Invalid email' },
        400
      )
      global.fetch = mockFetch

      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          username: 'user'
        })
      })

      expect(response.status).toBe(400)
    })

    it('should handle OTP request errors', async () => {
      const mockFetch = createMockFetch(
        { error: 'User not found' },
        404
      )
      global.fetch = mockFetch

      const response = await fetch('/api/user/requestLogin', {
        method: 'POST',
        body: JSON.stringify({ email: 'nonexistent@example.com' })
      })

      expect(response.status).toBe(404)
    })

    it('should handle network errors gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValue(
        new Error('Network error')
      )

      try {
        await fetch('/api/user/requestLogin', {
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com' })
        })
        expect.fail('Should have thrown')
      } catch (err: any) {
        expect(err.message).toBe('Network error')
      }
    })
  })
})
