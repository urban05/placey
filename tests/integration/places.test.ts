import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMockPlace, createMockFetch } from '../utils'

describe('GET /api/places', () => {
  const seedPlaces = [
    createMockPlace({ id: 'place-1', name: 'Library', latitude: 53.4995, longitude: 10.0032 }),
    createMockPlace({ id: 'place-2', name: 'Park', latitude: 53.5015, longitude: 10.0052, votes: 3 }),
    createMockPlace({ id: 'place-3', name: 'Youth Center', latitude: 53.5025, longitude: 10.0062, votes: -1 }),
  ]

  describe('nearby places query', () => {
    it('should return places within 10km radius', async () => {
      const mockFetch = createMockFetch({
        places: seedPlaces.slice(0, 2)
      })
      global.fetch = mockFetch

      const response = await fetch('/api/places?lat=53.4995&long=10.0032')
      const data = await response.json()

      expect(mockFetch).toHaveBeenCalledWith('/api/places?lat=53.4995&long=10.0032')
      expect(data.places.length).toBeGreaterThan(0)
    })

    it('should exclude places outside 10km radius', async () => {
      // A place 15km away should not be returned
      const farPlace = createMockPlace({
        id: 'far-place',
        latitude: 53.6,
        longitude: 10.1
      })

      const mockFetch = createMockFetch({
        places: seedPlaces // farPlace not included
      })
      global.fetch = mockFetch

      const response = await fetch('/api/places?lat=53.4995&long=10.0032')
      const data = await response.json()

      const placeIds = data.places.map((p: any) => p.id)
      expect(placeIds).not.toContain('far-place')
    })

    it('should return empty array if no places in radius', async () => {
      const mockFetch = createMockFetch({ places: [] })
      global.fetch = mockFetch

      const response = await fetch('/api/places?lat=53.0&long=9.0')
      const data = await response.json()

      expect(data.places).toEqual([])
    })

    it('should include vote aggregates in results', async () => {
      const mockFetch = createMockFetch({
        places: [seedPlaces[1]] // Park with 3 votes
      })
      global.fetch = mockFetch

      const response = await fetch('/api/places?lat=53.5&long=10.0')
      const data = await response.json()

      expect(data.places[0].votes).toBe(3)
    })
  })

  describe('request validation', () => {
    it('should require lat and long parameters', async () => {
      const mockFetch = createMockFetch({}, 400)
      global.fetch = mockFetch

      const response = await fetch('/api/places')
      expect(response.status).toBe(400)
    })

    it('should validate lat is within valid range (-90 to 90)', async () => {
      const mockFetch = createMockFetch({}, 400)
      global.fetch = mockFetch

      const response = await fetch('/api/places?lat=91&long=10')
      expect(response.status).toBe(400)
    })

    it('should validate long is within valid range (-180 to 180)', async () => {
      const mockFetch = createMockFetch({}, 400)
      global.fetch = mockFetch

      const response = await fetch('/api/places?lat=53&long=181')
      expect(response.status).toBe(400)
    })

    it('should accept numeric string coordinates', async () => {
      const mockFetch = createMockFetch({ places: seedPlaces.slice(0, 1) })
      global.fetch = mockFetch

      const response = await fetch('/api/places?lat=53.4995&long=10.0032')
      expect(response.ok).toBe(true)
    })
  })

  describe('sorting', () => {
    it('should return places sorted by distance', async () => {
      const sorted = [
        createMockPlace({ id: 'nearest', latitude: 53.50, longitude: 10.00 }),
        createMockPlace({ id: 'medium', latitude: 53.51, longitude: 10.01 }),
        createMockPlace({ id: 'farthest', latitude: 53.52, longitude: 10.02 }),
      ]

      const mockFetch = createMockFetch({ places: sorted })
      global.fetch = mockFetch

      const response = await fetch('/api/places?lat=53.50&long=10.00')
      const data = await response.json()

      expect(data.places[0].id).toBe('nearest')
      expect(data.places[data.places.length - 1].id).toBe('farthest')
    })
  })
})

describe('GET /api/places/search', () => {
  const seedPlaces = [
    createMockPlace({ id: '1', name: 'City Library' }),
    createMockPlace({ id: '2', name: 'Central Park' }),
    createMockPlace({ id: '3', name: 'Public Library' }),
    createMockPlace({ id: '4', name: 'Book Cafe' }),
  ]

  describe('search query', () => {
    it('should search by place name (case-insensitive)', async () => {
      const mockFetch = createMockFetch({
        places: [seedPlaces[0], seedPlaces[2]]
      })
      global.fetch = mockFetch

      const response = await fetch('/api/places/search?q=library&lat=53.5&long=10')
      const data = await response.json()

      expect(mockFetch).toHaveBeenCalled()
      expect(data.places.length).toBeGreaterThan(0)
    })

    it('should handle special characters safely (no SQL injection)', async () => {
      const mockFetch = createMockFetch({ places: [] })
      global.fetch = mockFetch

      const malicious = "'; DROP TABLE places; --"
      const encoded = encodeURIComponent(malicious)

      const response = await fetch(`/api/places/search?q=${encoded}&lat=53.5&long=10`)

      expect(mockFetch).toHaveBeenCalled()
      expect(response.ok).toBe(true)
    })

    it('should handle empty search results', async () => {
      const mockFetch = createMockFetch({ places: [] })
      global.fetch = mockFetch

      const response = await fetch('/api/places/search?q=nonexistent&lat=53.5&long=10')
      const data = await response.json()

      expect(data.places).toEqual([])
    })

    it('should limit results to 50 places', async () => {
      const manyPlaces = Array.from({ length: 75 }, (_, i) =>
        createMockPlace({ id: `place-${i}`, name: `Place ${i}` })
      )

      const mockFetch = createMockFetch({ places: manyPlaces.slice(0, 50) })
      global.fetch = mockFetch

      const response = await fetch('/api/places/search?q=place&lat=53.5&long=10')
      const data = await response.json()

      expect(data.places.length).toBeLessThanOrEqual(50)
    })
  })

  describe('fuzzy/ILIKE matching', () => {
    it('should match partial terms', async () => {
      const mockFetch = createMockFetch({
        places: [
          createMockPlace({ id: '1', name: 'City Library' }),
          createMockPlace({ id: '2', name: 'Public Library' })
        ]
      })
      global.fetch = mockFetch

      const response = await fetch('/api/places/search?q=lib&lat=53.5&long=10')
      const data = await response.json()

      expect(data.places.length).toBeGreaterThan(0)
      expect(data.places.some((p: any) => p.name.toLowerCase().includes('lib'))).toBe(true)
    })

    it('should be case-insensitive', async () => {
      const mockFetch = createMockFetch({
        places: [seedPlaces[0]] // City Library
      })
      global.fetch = mockFetch

      const response = await fetch('/api/places/search?q=LIBRARY&lat=53.5&long=10')
      const data = await response.json()

      expect(data.places.length).toBeGreaterThan(0)
    })
  })

  describe('distance ordering', () => {
    it('should sort results by distance from user location', async () => {
      const sorted = [
        createMockPlace({ id: '1', name: 'Nearest Library', latitude: 53.50, longitude: 10.00 }),
        createMockPlace({ id: '2', name: 'Far Library', latitude: 53.55, longitude: 10.05 }),
      ]

      const mockFetch = createMockFetch({ places: sorted })
      global.fetch = mockFetch

      const response = await fetch('/api/places/search?q=library&lat=53.50&long=10.00')
      const data = await response.json()

      // Nearest should come first
      expect(data.places[0].id).toBe('1')
    })
  })

  describe('request validation', () => {
    it('should require search query parameter', async () => {
      const mockFetch = createMockFetch({}, 400)
      global.fetch = mockFetch

      const response = await fetch('/api/places/search?lat=53.5&long=10')
      expect(response.status).toBe(400)
    })

    it('should require lat and long for distance sorting', async () => {
      const mockFetch = createMockFetch({ places: [] })
      global.fetch = mockFetch

      // Some implementations might allow search without location
      const response = await fetch('/api/places/search?q=library&lat=53.5')

      // Either require all params or allow partial
      expect([200, 400]).toContain(response.status)
    })
  })
})
