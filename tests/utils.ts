import { vi } from 'vitest'

export const createMockFetch = (response: any = {}, status = 200) => {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(response),
    text: vi.fn().mockResolvedValue(JSON.stringify(response)),
  })
}

export const createMockPlace = (overrides = {}) => ({
  id: 'test-place-1',
  name: 'Test Place',
  icon: 'twemoji:books',
  verified: false,
  address: '123 Test St',
  description: 'A test place',
  latitude: 53.4995,
  longitude: 10.0032,
  image: null,
  votes: 0,
  ...overrides,
})

export const createMockUser = (overrides = {}) => ({
  id: 'test-user-1',
  email: 'test@example.com',
  username: 'testuser',
  token: 'test-jwt-token',
  ...overrides,
})

export const createMockVote = (overrides = {}) => ({
  place_id: 'test-place-1',
  user_id: 'test-user-1',
  vote: 1,
  ...overrides,
})

export const delayBy = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const createMockHttpEvent = (options = {}) => ({
  node: {
    req: {
      headers: {},
      ...options,
    },
    res: {},
  },
  ...options,
})
