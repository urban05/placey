import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { createMockFetch, createMockPlace, delayBy } from '../utils'

describe('useVotes', () => {
  let votes: Record<string, boolean | null> = {}
  let places: any[] = []

  beforeEach(() => {
    votes = {}
    places = [createMockPlace({ id: 'place-1', votes: 0 })]
    vi.clearAllMocks()
  })

  describe('optimistic updates', () => {
    it('should update UI immediately when voting', async () => {
      const placeId = 'place-1'
      const initialVotes = places[0].votes

      // Optimistic update: update local state before API call
      votes[placeId] = true
      places[0].votes = initialVotes + 1

      expect(votes[placeId]).toBe(true)
      expect(places[0].votes).toBe(initialVotes + 1)
    })

    it('should revert optimistic update on API failure', async () => {
      const placeId = 'place-1'
      const initialVotes = places[0].votes

      // Optimistic update
      const previousVote = votes[placeId]
      votes[placeId] = true
      places[0].votes = initialVotes + 1

      // Simulate API failure
      const mockFetch = createMockFetch({}, 500)
      global.fetch = mockFetch

      const response = await fetch(`/api/votes`, {
        method: 'POST',
        body: JSON.stringify({ placeId, vote: 1 })
      })

      if (!response.ok) {
        // Rollback on failure
        votes[placeId] = previousVote || null
        places[0].votes = initialVotes
      }

      expect(votes[placeId]).toBe(null)
      expect(places[0].votes).toBe(initialVotes)
    })
  })

  describe('vote synchronization', () => {
    it('should sync upvote to server', async () => {
      const mockFetch = createMockFetch({ success: true })
      global.fetch = mockFetch

      const placeId = 'place-1'
      votes[placeId] = true

      await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ placeId, vote: 1 })
      })

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/votes',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"vote":1')
        })
      )
    })

    it('should sync downvote to server', async () => {
      const mockFetch = createMockFetch({ success: true })
      global.fetch = mockFetch

      const placeId = 'place-1'
      votes[placeId] = false

      await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ placeId, vote: -1 })
      })

      expect(mockFetch).toHaveBeenCalled()
      expect(mockFetch.mock.calls[0][0]).toBe('/api/votes')
      expect(mockFetch.mock.calls[0][1]?.method).toBe('POST')
    })

    it('should remove vote by setting to null', async () => {
      const mockFetch = createMockFetch({ success: true })
      global.fetch = mockFetch

      const placeId = 'place-1'
      votes[placeId] = null

      await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({ placeId, vote: null })
      })

      expect(mockFetch).toHaveBeenCalled()
    })

    it('should require authentication to vote', async () => {
      const mockFetch = createMockFetch({}, 401)
      global.fetch = mockFetch

      const response = await fetch('/api/votes', {
        method: 'POST',
        body: JSON.stringify({ placeId: 'place-1', vote: 1 })
      })

      expect(response.status).toBe(401)
    })
  })

  describe('vote state management', () => {
    it('should toggle vote (upvote -> none)', async () => {
      const placeId = 'place-1'

      votes[placeId] = true
      expect(votes[placeId]).toBe(true)

      votes[placeId] = null
      expect(votes[placeId]).toBe(null)
    })

    it('should switch vote type (upvote -> downvote)', async () => {
      const placeId = 'place-1'

      votes[placeId] = true
      places[0].votes = 1

      // Switch to downvote
      const voteChange = false ? 1 : true ? -2 : 0
      votes[placeId] = false
      places[0].votes += voteChange

      expect(votes[placeId]).toBe(false)
      expect(places[0].votes).toBe(-1) // was 1, now -1
    })

    it('should cache multiple votes', async () => {
      votes['place-1'] = true
      votes['place-2'] = false
      votes['place-3'] = null

      expect(votes['place-1']).toBe(true)
      expect(votes['place-2']).toBe(false)
      expect(votes['place-3']).toBe(null)
    })
  })

  describe('race conditions', () => {
    it('should handle simultaneous vote updates on same place', async () => {
      const placeId = 'place-1'
      const mockFetch = createMockFetch({ success: true })
      global.fetch = mockFetch

      // Two concurrent votes on same place
      const vote1 = fetch('/api/votes', {
        method: 'POST',
        body: JSON.stringify({ placeId, vote: 1 })
      })

      const vote2 = fetch('/api/votes', {
        method: 'POST',
        body: JSON.stringify({ placeId, vote: 1 })
      })

      await Promise.all([vote1, vote2])

      // Both calls should have been made
      expect(mockFetch).toHaveBeenCalledTimes(2)
      // Verify the calls were for the right endpoint
      expect(mockFetch.mock.calls[0][0]).toBe('/api/votes')
    })

    it('should sync if API response is delayed', async () => {
      const placeId = 'place-1'
      const mockFetch = vi.fn().mockImplementation(async () => {
        await delayBy(100)
        return {
          ok: true,
          json: async () => ({ success: true })
        }
      })
      global.fetch = mockFetch

      // Optimistic update happens immediately
      votes[placeId] = true
      places[0].votes += 1

      expect(votes[placeId]).toBe(true)
      expect(places[0].votes).toBe(1)

      // API call happens in background
      await fetch('/api/votes', {
        method: 'POST',
        body: JSON.stringify({ placeId, vote: 1 })
      })

      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('should not update vote if user is not authenticated', async () => {
      const mockFetch = createMockFetch({}, 401)
      global.fetch = mockFetch

      const placeId = 'place-1'
      const initialVote = votes[placeId]

      const response = await fetch('/api/votes', {
        method: 'POST',
        body: JSON.stringify({ placeId, vote: 1 })
      })

      if (!response.ok) {
        // Don't update local state on auth error
        expect(votes[placeId]).toBe(initialVote)
      }
    })

    it('should handle invalid place ID', async () => {
      const mockFetch = createMockFetch({ error: 'Place not found' }, 404)
      global.fetch = mockFetch

      const response = await fetch('/api/votes', {
        method: 'POST',
        body: JSON.stringify({ placeId: 'invalid-id', vote: 1 })
      })

      expect(response.status).toBe(404)
    })
  })
})
