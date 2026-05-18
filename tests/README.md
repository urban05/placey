# Placey Test Suite

A comprehensive, high-value test suite for Placey focused on critical paths and business logic.

## Philosophy

**Not** 100% code coverage. **Instead**: tests that catch real bugs, prevent regressions, and document expected behavior.

## Test Structure

```
tests/
├── utils.ts                  # Shared test utilities and mock factories
├── unit/
│   ├── usePlaces.test.ts    # Place discovery + search + throttling
│   ├── useVotes.test.ts     # Voting + optimistic updates + sync
│   └── useUser.test.ts      # Auth flow + JWT + user state
└── integration/
    ├── places.test.ts       # API: nearby places + search endpoints
    ├── votes.test.ts        # API: vote upsert + aggregation
    ├── auth.test.ts         # API: registration + OTP + login
    └── journeys.test.ts     # User flows: discover → search → vote → collect
```

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test -- --watch

# UI mode
pnpm test:ui

# Coverage report
pnpm test:coverage
```

## What Each Test Suite Covers

### Composable Tests (Unit)

#### `usePlaces.test.ts`
- ✓ Fetch places within 10km radius
- ✓ Filter places outside radius
- ✓ Search with fuzzy matching + special characters
- ✓ Throttling (1s location, 500ms search)
- ✓ Error handling (API failures, network errors)
- ✓ Empty results handling

**Why these matter**: If distance filtering breaks, users see wrong places. Throttling prevents API hammering during map drags.

#### `useVotes.test.ts`
- ✓ Optimistic UI updates (vote shows immediately)
- ✓ Rollback on API failure
- ✓ Vote syncing (upvote → downvote → remove)
- ✓ Vote state caching
- ✓ Race conditions (simultaneous votes)
- ✓ Auth requirement
- ✓ Vote deduplication

**Why these matter**: Vote bugs silently lose user data. Optimistic updates without sync = stale UI. Race conditions break vote counts.

#### `useUser.test.ts`
- ✓ OTP request → OTP verification → JWT return
- ✓ Token persistence in localStorage
- ✓ Protected requests with Bearer token
- ✓ Token expiry handling
- ✓ Logout clears session
- ✓ Duplicate email/username rejection
- ✓ Invalid/expired OTP rejection

**Why these matter**: Auth bugs lock users out or expose accounts. Token expiry mishandling breaks authenticated features.

### API Integration Tests

#### `places.test.ts` — GET /api/places
- ✓ PostGIS query returns 10km radius correctly
- ✓ Places outside radius excluded
- ✓ Vote aggregates included
- ✓ Distance sorting
- ✓ Coordinate validation (lat/long bounds)
- ✓ Empty radius handling

**Why**: PostGIS bugs = wrong places shown. Sorting bugs = confusing UX.

#### `places.test.ts` — GET /api/places/search
- ✓ Case-insensitive ILIKE matching
- ✓ Partial term matching
- ✓ Special character handling (no SQL injection)
- ✓ Result limit (50 max)
- ✓ Distance-based ordering
- ✓ Empty results

**Why**: Search bugs = users can't find places. SQL injection = critical security issue.

#### `votes.test.ts` — POST /api/votes
- ✓ Upsert behavior (same user can change vote)
- ✓ Composite key enforcement (one vote per user-place pair)
- ✓ Vote value validation (1, -1, null only)
- ✓ Auth required
- ✓ Vote aggregation
- ✓ Remove vote (set to null)

**Why**: Upsert bugs = duplicate votes, double-counting. Missing auth = anyone can vote.

#### `votes.test.ts` — GET /api/votes
- ✓ Return user's votes
- ✓ Auth required
- ✓ Empty result if no votes

#### `auth.test.ts` — POST /api/user
- ✓ Register new user
- ✓ Reject duplicate email (409)
- ✓ Reject duplicate username (409)
- ✓ Email format validation
- ✓ Username length validation

#### `auth.test.ts` — POST /api/user/requestLogin
- ✓ Generate OTP for email
- ✓ Reject nonexistent user (404)
- ✓ OTP storage in DB
- ✓ OTP expiry (15 min)
- ✓ Email format validation

#### `auth.test.ts` — POST /api/user/login
- ✓ Verify OTP → return JWT token
- ✓ Reject invalid OTP (401)
- ✓ Reject expired OTP (401)
- ✓ Clear OTP after successful login
- ✓ Rate limit after 3 failed attempts (429)
- ✓ JWT payload includes user ID
- ✓ No password/OTP in response

**Why**: OTP bugs = lockout. Rate limiting missing = brute force attack.

### User Journey Tests (E2E-style)

#### `journeys.test.ts`
End-to-end flow tests that exercise multiple systems:

- **Discover nearby places**: Drag map → API call → markers appear
- **Search for places**: Type query → fuzzy results → click to zoom
- **Authenticate**: Signup → OTP request → verify → JWT saved
- **Vote on places**: Upvote (optimistic) → sync → toggle vote types
- **Check in & collect**: Add place to collection → profile grid
- **Error handling**: Network error, empty results, token expiry
- **Data consistency**: Page reload → votes restored, collection synced

**Why**: These catch integration bugs where individual units work but don't integrate.

## What's NOT Tested (Intentionally)

❌ Component snapshots (brittle, low value)
❌ Tailwind CSS rendering
❌ MapLibre GL internals
❌ Database connection pooling
❌ Every validation message
❌ Line-by-line coverage

These add noise without catching bugs.

## Running in Real Environment

These tests mock the API, so they **don't require a database**. To test against real PostgreSQL:

1. Spin up test DB: `pnpm dbreset` (creates a test database)
2. Modify test files to skip mocks and hit real endpoints
3. Clean up: `docker compose down -v`

## Coverage Goals

- **Composables**: 80%+ (where bugs hide)
- **API routes**: 85%+ (core business logic)
- **Pages/components**: 0-20% (UI testing is better done with E2E)

Running `pnpm test:coverage` shows current coverage.

## Adding New Tests

1. **For new features**: Add to relevant test file (composable/API/journey)
2. **For bugs**: Write test that reproduces bug first, then fix
3. **For edge cases**: Add to error handling sections

Example:

```typescript
it('should handle X when Y happens', async () => {
  // Arrange
  const mockFetch = createMockFetch({ ... })
  
  // Act
  const response = await fetch(...)
  
  // Assert
  expect(response.status).toBe(...)
})
```

## Debugging Failed Tests

```bash
# Run single test file
pnpm test tests/unit/usePlaces.test.ts

# Run specific test
pnpm test -t "should fetch places"

# Show console.log output
pnpm test -- --reporter=verbose

# Debug in Node inspector
node --inspect-brk node_modules/.bin/vitest tests/...
```
