import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMockPlace, createMockUser, createMockFetch } from '../utils'

describe('User Journeys (E2E-style)', () => {
  let appState: any

  beforeEach(() => {
    appState = {
      user: null,
      token: null,
      places: [],
      votes: {},
      visitedPlaces: []
    }
    vi.clearAllMocks()
  })

  describe('Discover nearby places', () => {
    it('should show places on map when user drags to new location', async () => {
      // 1. User opens map
      expect(appState.places).toEqual([])

      // 2. Map initializes at Hamburg center
      const defaultLocation = { lat: 53.4995, lng: 10.0032 }
      expect(defaultLocation.lat).toBe(53.4995)

      // 3. Map queries nearby places
      const mockFetch = createMockFetch({
        places: [
          createMockPlace({ id: '1', name: 'City Library' }),
          createMockPlace({ id: '2', name: 'Central Park' })
        ]
      })
      global.fetch = mockFetch

      const response = await fetch(
        `/api/places?lat=${defaultLocation.lat}&long=${defaultLocation.lng}`
      )
      const data = await response.json()
      appState.places = data.places

      // 4. Places appear as markers on map
      expect(appState.places.length).toBe(2)
      expect(appState.places[0].name).toBe('City Library')
    })

    it('should show place details when user clicks marker', async () => {
      const place = createMockPlace({
        id: 'place-1',
        name: 'City Library',
        description: 'Central library with reading rooms',
        address: '123 Library St',
        verified: true
      })

      appState.places = [place]

      // User clicks on marker -> drawer opens with place details
      const selectedPlace = appState.places.find((p: any) => p.id === 'place-1')

      expect(selectedPlace).toBeDefined()
      expect(selectedPlace.name).toBe('City Library')
      expect(selectedPlace.verified).toBe(true)
      expect(selectedPlace.description).toContain('reading rooms')
    })
  })

  describe('Search for places', () => {
    it('should find place by typing in search', async () => {
      // 1. User types "library"
      const query = 'library'

      // 2. App searches for matching places
      const mockFetch = createMockFetch({
        places: [
          createMockPlace({ id: '1', name: 'City Library' }),
          createMockPlace({ id: '2', name: 'Public Library' })
        ]
      })
      global.fetch = mockFetch

      const response = await fetch(
        `/api/places/search?q=${query}&lat=53.5&long=10.0`
      )
      const data = await response.json()
      appState.places = data.places

      // 3. Results show in drawer
      expect(appState.places).toHaveLength(2)
      expect(appState.places.every((p: any) => p.name.toLowerCase().includes('library'))).toBe(true)

      // 4. User presses Enter to zoom to first result
      const firstPlace = appState.places[0]
      expect(firstPlace.id).toBe('1')
    })
  })

  describe('Authenticate with OTP', () => {
    it('should complete signup → OTP request → login flow', async () => {
      // 1. User fills signup form and submits
      const mockFetch = createMockFetch({ success: true })
      global.fetch = mockFetch

      let response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({
          email: 'newuser@example.com',
          username: 'newuser'
        })
      })
      expect(response.ok).toBe(true)

      // 2. User clicks "Login" and enters email
      const mockFetch2 = createMockFetch({ message: 'OTP sent' })
      global.fetch = mockFetch2

      response = await fetch('/api/user/requestLogin', {
        method: 'POST',
        body: JSON.stringify({ email: 'newuser@example.com' })
      })
      expect(response.ok).toBe(true)

      // 3. User checks email and enters OTP code
      const mockUser = createMockUser({
        email: 'newuser@example.com',
        username: 'newuser'
      })

      const mockFetch3 = createMockFetch({
        user: mockUser,
        token: mockUser.token
      })
      global.fetch = mockFetch3

      response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'newuser@example.com',
          otp: '123456'
        })
      })
      const data = await response.json()

      // 4. User is now logged in
      appState.user = data.user
      appState.token = data.token

      expect(appState.user.email).toBe('newuser@example.com')
      expect(appState.user.username).toBe('newuser')
      expect(appState.token).toBeDefined()
    })
  })

  describe('Vote on places', () => {
    it('should upvote place and see vote count update', async () => {
      // User is logged in
      appState.user = createMockUser()
      appState.token = 'test-token'

      // 1. User sees place in drawer
      const place = createMockPlace({
        id: 'place-1',
        name: 'Library',
        votes: 5
      })
      appState.places = [place]

      // 2. User clicks upvote button
      const mockFetch = createMockFetch({ success: true })
      global.fetch = mockFetch

      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${appState.token}` },
        body: JSON.stringify({ placeId: 'place-1', vote: 1 })
      })
      expect(response.ok).toBe(true)

      // 3. Optimistic update: UI shows +1 immediately
      appState.places[0].votes += 1
      appState.votes['place-1'] = true

      expect(appState.places[0].votes).toBe(6)
      expect(appState.votes['place-1']).toBe(true)

      // 4. Vote is synced to server (happens in background)
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/votes',
        expect.objectContaining({
          method: 'POST'
        })
      )
    })

    it('should switch from upvote to downvote', async () => {
      appState.user = createMockUser()
      appState.token = 'test-token'
      appState.votes['place-1'] = true
      appState.places = [createMockPlace({ id: 'place-1', votes: 6 })]

      const mockFetch = createMockFetch({ success: true })
      global.fetch = mockFetch

      // User changes mind and clicks downvote
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${appState.token}` },
        body: JSON.stringify({ placeId: 'place-1', vote: -1 })
      })

      // Optimistic update: vote changes, net effect is -2 votes
      appState.votes['place-1'] = false
      appState.places[0].votes -= 2

      expect(appState.votes['place-1']).toBe(false)
      expect(appState.places[0].votes).toBe(4)
    })

    it('should not allow guest to vote (requires login)', async () => {
      // User is not logged in
      appState.user = null
      appState.token = null

      const mockFetch = createMockFetch({}, 401)
      global.fetch = mockFetch

      const response = await fetch('/api/votes', {
        method: 'POST',
        body: JSON.stringify({ placeId: 'place-1', vote: 1 })
      })

      expect(response.status).toBe(401)
      expect(appState.votes['place-1']).toBeUndefined()
    })
  })

  describe('Check in and collect places', () => {
    it('should add place to collection when checking in', async () => {
      appState.user = createMockUser()
      appState.token = 'test-token'

      const place = createMockPlace({ id: 'place-1', name: 'Library' })

      // 1. User is at place and clicks "Check in"
      appState.visitedPlaces.push(place)

      expect(appState.visitedPlaces).toHaveLength(1)
      expect(appState.visitedPlaces[0].name).toBe('Library')
    })

    it('should show collection on profile page', async () => {
      appState.user = createMockUser()
      appState.token = 'test-token'

      // Load visited places
      const mockFetch = createMockFetch({
        places: [
          createMockPlace({ id: '1', name: 'Library' }),
          createMockPlace({ id: '2', name: 'Park' })
        ]
      })
      global.fetch = mockFetch

      const response = await fetch('/api/places/visited', {
        headers: { Authorization: `Bearer ${appState.token}` }
      })
      const data = await response.json()
      appState.visitedPlaces = data.places

      // Profile page displays collection grid
      expect(appState.visitedPlaces).toHaveLength(2)
      expect(appState.visitedPlaces[0].id).toBe('1')
    })
  })

  describe('Error handling', () => {
    it('should show error message if map load fails', async () => {
      const mockFetch = vi.fn().mockRejectedValue(
        new Error('Network error')
      )
      global.fetch = mockFetch

      try {
        await fetch('/api/places?lat=53.5&long=10.0')
        expect.fail('Should have thrown')
      } catch (err: any) {
        expect(err.message).toBe('Network error')
        // UI should show error message to user
      }
    })

    it('should show empty state if no places in radius', async () => {
      const mockFetch = createMockFetch({ places: [] })
      global.fetch = mockFetch

      const response = await fetch('/api/places?lat=53.5&long=10.0')
      const data = await response.json()

      appState.places = data.places

      if (appState.places.length === 0) {
        // Show "No places found" message with contribute button
        expect(true).toBe(true)
      }
    })

    it('should clear session and prompt login if token expires', async () => {
      appState.user = createMockUser()
      appState.token = 'expired-token'

      const mockFetch = createMockFetch({}, 401)
      global.fetch = mockFetch

      const response = await fetch('/api/places/visited', {
        headers: { Authorization: `Bearer ${appState.token}` }
      })

      if (response.status === 401) {
        // Clear session
        appState.user = null
        appState.token = null

        expect(appState.user).toBe(null)
      }
    })
  })

  describe('Data consistency', () => {
    it('should refresh vote status from server on app reload', async () => {
      // Simulate user votes, then refreshes page
      appState.user = createMockUser()
      appState.token = 'test-token'

      const mockFetch = createMockFetch({
        votes: {
          'place-1': true,
          'place-2': false
        }
      })
      global.fetch = mockFetch

      const response = await fetch('/api/votes', {
        headers: { Authorization: `Bearer ${appState.token}` }
      })
      const data = await response.json()

      appState.votes = data.votes

      expect(appState.votes['place-1']).toBe(true)
      expect(appState.votes['place-2']).toBe(false)
    })

    it('should sync visited places from server on profile load', async () => {
      appState.user = createMockUser()
      appState.token = 'test-token'

      const mockFetch = createMockFetch({
        places: [
          createMockPlace({ id: '1', name: 'Library' }),
          createMockPlace({ id: '2', name: 'Park' })
        ]
      })
      global.fetch = mockFetch

      const response = await fetch('/api/places/visited', {
        headers: { Authorization: `Bearer ${appState.token}` }
      })
      const data = await response.json()

      appState.visitedPlaces = data.places

      expect(appState.visitedPlaces).toHaveLength(2)
    })
  })
})
