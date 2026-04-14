# The Idea

A reactive web app, where the community can enter 3rd-places on a map.
Registered users can up- and downvote places, discuss places and create events.
Unsers can collect places by visiting them, either entering them manually (weak), with geodata (strong) or by scanning a QR-Code or RFID chip at the place (strongest).
The plattform allows moderators to verfiy places and remove entries and comments, if necessary.

## Feature Creep

- collect places like trading cards and duell with other users.
- own map design.

## Architecture

Framework:

- Nuxt v4
  - based on vite

Vite Plugins:

- tailwind css

Nuxt v4 modules:

- nuxt-maplibre, based on maplibre, a wrapper for openstreetmaps
- @nuxt/eslint
- @nuxt/icon
- @vueuse/nuxt

npm dependcies:

- pg connector for postgres

Database:

- PostgreSQL

Map:

- versatiles for vector tiles
- iconify/glyphs-twemoji for icons, CC-BY 4.0

## Requirements

- NodeJs
- PNPM
- Nuxt
- Tailwind CSS