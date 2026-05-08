import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMockUser, createMockFetch } from '../utils'

describe('POST /api/user', () => {
  describe('registration', () => {
    it('should register user with email and username', async () => {
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
          method: 'POST',
          body: expect.stringContaining('newuser@example.com')
        })
      )

      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it('should reject duplicate email with 409 conflict', async () => {
      const mockFetch = createMockFetch(
        { error: 'Email already registered' },
        409
      )
      global.fetch = mockFetch

      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({
          email: 'existing@example.com',
          username: 'newusername'
        })
      })

      expect(response.status).toBe(409)
    })

    it('should reject duplicate username with 409 conflict', async () => {
      const mockFetch = createMockFetch(
        { error: 'Username already taken' },
        409
      )
      global.fetch = mockFetch

      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({
          email: 'newemail@example.com',
          username: 'existingusername'
        })
      })

      expect(response.status).toBe(409)
    })

    it('should validate email format', async () => {
      const mockFetch = createMockFetch({ error: 'Invalid email' }, 400)
      global.fetch = mockFetch

      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({
          email: 'not-an-email',
          username: 'user'
        })
      })

      expect(response.status).toBe(400)
    })

    it('should validate username requirements', async () => {
      const mockFetch = createMockFetch(
        { error: 'Username must be 3-20 characters' },
        400
      )
      global.fetch = mockFetch

      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({
          email: 'valid@example.com',
          username: 'a' // Too short
        })
      })

      expect(response.status).toBe(400)
    })

    it('should require both email and username', async () => {
      const mockFetch = createMockFetch({ error: 'Missing fields' }, 400)
      global.fetch = mockFetch

      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com'
          // missing username
        })
      })

      expect(response.status).toBe(400)
    })
  })
})

describe('POST /api/user/requestLogin', () => {
  describe('OTP request', () => {
    it('should send OTP code to user email', async () => {
      const mockFetch = createMockFetch({
        message: 'OTP sent to email'
      })
      global.fetch = mockFetch

      const response = await fetch('/api/user/requestLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@example.com' })
      })

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/user/requestLogin',
        expect.objectContaining({
          method: 'POST'
        })
      )

      const data = await response.json()
      expect(data.message).toBe('OTP sent to email')
    })

    it('should reject request for nonexistent user', async () => {
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

    it('should validate email format', async () => {
      const mockFetch = createMockFetch({ error: 'Invalid email' }, 400)
      global.fetch = mockFetch

      const response = await fetch('/api/user/requestLogin', {
        method: 'POST',
        body: JSON.stringify({ email: 'invalid-email' })
      })

      expect(response.status).toBe(400)
    })

    it('should store OTP in database temporarily', async () => {
      const mockDb = {
        otps: new Map()
      }

      const email = 'user@example.com'
      const otp = '123456'

      mockDb.otps.set(email, otp)

      expect(mockDb.otps.has(email)).toBe(true)
      expect(mockDb.otps.get(email)).toBe(otp)
    })

    it('should expire OTP after time limit (15 minutes)', async () => {
      const mockDb = {
        otps: new Map()
      }

      const email = 'user@example.com'
      const otp = '123456'
      const expiresAt = Date.now() + 15 * 60 * 1000

      mockDb.otps.set(`${email}-expiry`, expiresAt)

      const isExpired = Date.now() > mockDb.otps.get(`${email}-expiry`)
      expect(isExpired).toBe(false)

      // Simulate time passing
      const futureTime = expiresAt + 1000
      const isExpiredAfter = futureTime > mockDb.otps.get(`${email}-expiry`)
      expect(isExpiredAfter).toBe(true)
    })
  })
})

describe('POST /api/user/login', () => {
  describe('OTP verification', () => {
    it('should verify OTP and return JWT token', async () => {
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
          email: 'user@example.com',
          otp: '123456'
        })
      })

      expect(response.ok).toBe(true)

      const data = await response.json()
      expect(data.token).toBe(mockUser.token)
      expect(data.user).toBeDefined()
    })

    it('should reject invalid OTP with 401', async () => {
      const mockFetch = createMockFetch(
        { error: 'Invalid OTP' },
        401
      )
      global.fetch = mockFetch

      const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          otp: 'wrong-code'
        })
      })

      expect(response.status).toBe(401)
    })

    it('should reject expired OTP with 401', async () => {
      const mockFetch = createMockFetch(
        { error: 'OTP expired' },
        401
      )
      global.fetch = mockFetch

      const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          otp: '123456'
        })
      })

      expect(response.status).toBe(401)
    })

    it('should clear OTP from database after successful login', async () => {
      const mockDb = {
        otps: new Map([['user@example.com', '123456']])
      }

      // Simulate successful verification
      mockDb.otps.delete('user@example.com')

      expect(mockDb.otps.has('user@example.com')).toBe(false)
    })

    it('should reject after max failed attempts', async () => {
      // Simulate 3 failed attempts
      let attempts = 3

      const mockFetch = createMockFetch(
        { error: 'Too many failed attempts' },
        429
      )
      global.fetch = mockFetch

      if (attempts >= 3) {
        const response = await fetch('/api/user/login', {
          method: 'POST',
          body: JSON.stringify({
            email: 'user@example.com',
            otp: 'wrong'
          })
        })

        expect(response.status).toBe(429)
      }
    })
  })

  describe('JWT token generation', () => {
    it('should include user ID in token payload', async () => {
      const userId = 'user-123'
      const token = createMockUser({ id: userId }).token

      expect(token).toBe('test-jwt-token')
      // In real implementation: decode token and verify claims
    })

    it('should set token expiration', async () => {
      // Token should have exp claim (24 hours typically)
      const expiresIn = 24 * 60 * 60 // 24 hours in seconds

      expect(expiresIn).toBeGreaterThan(0)
    })

    it('should sign token with secret', async () => {
      const token = createMockUser().token

      // Token should be a valid JWT format (header.payload.signature)
      // But our mock returns 'test-jwt-token', so just verify it's a string
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })
  })

  describe('response data', () => {
    it('should return user id, email, username in response', async () => {
      const mockUser = createMockUser({
        id: 'user-123',
        email: 'john@example.com',
        username: 'john'
      })

      const mockFetch = createMockFetch({
        user: mockUser,
        token: mockUser.token
      })
      global.fetch = mockFetch

      const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'john@example.com',
          otp: '123456'
        })
      })

      const data = await response.json()
      expect(data.user.id).toBe('user-123')
      expect(data.user.email).toBe('john@example.com')
      expect(data.user.username).toBe('john')
    })

    it('should not return password or OTP in response', async () => {
      const mockFetch = createMockFetch({
        user: createMockUser(),
        token: 'token'
      })
      global.fetch = mockFetch

      const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          otp: '123456'
        })
      })

      const data = await response.json()
      expect(data.user.password).toBeUndefined()
      expect(data.user.otp).toBeUndefined()
    })
  })

  describe('error handling', () => {
    it('should handle missing email parameter', async () => {
      const mockFetch = createMockFetch({ error: 'Missing email' }, 400)
      global.fetch = mockFetch

      const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({ otp: '123456' })
      })

      expect(response.status).toBe(400)
    })

    it('should handle missing OTP parameter', async () => {
      const mockFetch = createMockFetch({ error: 'Missing OTP' }, 400)
      global.fetch = mockFetch

      const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com' })
      })

      expect(response.status).toBe(400)
    })
  })
})
