# Sequence Diagram Example, vote on a place

```mermaid
---
config:
  layout: elk
  theme: neutral
---
sequenceDiagram
  actor User
  participant B as browser : Browser
  participant PS as search : PlaceSearch
  participant uP as places : usePlaces
  participant N as server : NitroServer
  participant PG as db : PostgreSQL
  participant VT as tiles : VersaTiles

  User->>B: navigate("/")
  activate B
  B->>N: GET /api/places
  activate N
  N->>PG: queryAllPlaces()
  activate PG
  PG-->>N: Place[]
  deactivate PG
  N-->>B: Place[]
  deactivate N
  B->>VT: requestTiles(viewport)
  activate VT
  VT-->>B: TileData
  deactivate VT
  B->>User: renderMap(markers)
  deactivate B

  User->>B: typeSearchQuery(q)
  activate B
  B->>PS: input(q)
  activate PS
  PS->>uP: fetchPlaces(q)
  activate uP
  uP->>N: GET /api/places/search?q=
  activate N
  N->>PG: queryPlacesByName(q)
  activate PG
  PG-->>N: Place[]
  deactivate PG
  N-->>uP: Place[]
  deactivate N
  uP-->>PS: places (reactive update)
  deactivate uP
  PS-->>B: listUpdated()
  deactivate PS
  B->>User: showFilteredResults()
  deactivate B

  User->>B: clickMarker(placeId)
  activate B
  B->>User: openDrawer(placeDetail)
  deactivate B

  User->>B: clickUpvote(placeId)
  activate B
  B->>N: POST /api/places/vote
  activate N
  alt unauthenticated
    N-->>B: 401 Unauthorized
    B->>User: promptLogin()
  else authenticated
    N->>PG: insertVote(placeId, userId, vote)
    activate PG
    PG-->>N: OK
    deactivate PG
    N-->>B: 201 Created
    B->>User: updateVoteCount()
  end
  deactivate N
  deactivate B
```
