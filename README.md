# Placey 📍

> **Find your place. Collect it. Own it.**

Placey is an open-source, community-driven map of **third places** — freely accessible spaces outside of school and work — built for teenagers and young adults in Wilhelmsburg, Hamburg, and beyond.

---

## What is Placey?

Many young people, especially in neighborhoods with a low socioeconomic status, lack a reliable overview of safe, welcoming, and free places nearby. Existing information is scattered, outdated, or simply doesn't feel made for them.

Placey fixes that: a mobile-first progressive web app where the community builds and maintains the map together. Filter by what matters to you — FLINTA\*-friendly, free of charge, calm vibe — and discover places you never knew existed.

### The Twist — Collect & Duel

Placey turns exploring your neighborhood into a game. Check in at places to collect them as trading cards, each carrying stats derived from community ratings and attributes. Challenge other users to duels with your collection and turn passive discovery into friendly competition.

---

## Features

| Area | What you can do |
|---|---|
| 🗺️ **Map** | Browse an interactive map, search and filter by attributes |
| 📍 **Places** | View details, community comments, linked events, and opening info |
| ✍️ **Contribute** | Submit new places, leave comments, up- or downvote |
| 🎴 **Collection** | Check in, collect place cards, duel other users |
| 🔖 **Save** | Save places as a guest (cookie) or sync to your account |
| 🛡️ **Moderation** | Verified submissions, moderator tools for a trustworthy map |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | [Vue 3](https://vuejs.org/) + [Nuxt 4](https://nuxt.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Map | [MapLibre GL](https://maplibre.org/) + [VersaTiles](https://versatiles.org/) (OpenStreetMap) |
| Icons | [Twemoji](https://github.com/jdecked/twemoji) via `@iconify-json/twemoji` |
| Server | Nuxt Nitro |
| Database | [PostgreSQL](https://www.postgresql.org/) + [PostGIS](https://postgis.net/) |
| Migrations | [node-pg-migrate](https://github.com/salsita/node-pg-migrate) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [pnpm](https://pnpm.io/)
- A running PostgreSQL instance with the PostGIS extension

### Install & Run

```bash
# Install dependencies
pnpm install

# Run database migrations and seed test data
pnpm migrate up

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgres://user:password@localhost:5432/placey
TOKEN_SECRET=[a random string for JWT signing]
```

You can generate a random string for `TOKEN_SECRET` with:

```bash
openssl rand -base64 32
```

### Docker Compose

A `compose.yaml` is included for running PostgreSQL locally:

```bash
docker compose up -d
```

---

## Project Structure

```
placey/
├── app/
│   ├── pages/          # File-based routes (Nuxt router)
│   ├── components/     # Reusable Vue components
│   └── composables/    # Business logic (usePlaces, useVotes, …)
├── server/
│   ├── api/            # Nitro API endpoints
│   └── utils/          # Shared server utilities (postgres.ts)
├── shared/             # Types shared across client & server
├── migrations/         # SQL migration files
└── public/             # Static assets
```

---

## Target Group & Design Philosophy

Placey is built specifically for teenagers and young adults in Wilhelmsburg — a neighborhood in Hamburg with a high share of residents from low-income households. Two personas guide every design decision:

- **Mia** (16) — spontaneous, mobile-first, low data budget, needs FLINTA\*-friendly filtering and fast load times
- **Jonas** (17) — methodical, privacy-conscious, needs vibe information and the ability to browse without signing up

Every feature is justified by a user story. Every design constraint is justified by their real lives.

Full requirements analysis: [`docs/requirements-analysis.md`](docs/requirements-analysis.md)

---

## Contributing

Placey is open-source and community-driven — contributions are welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a pull request **against `staging`** (not `main`)

Please run `pnpm lint` before opening a PR and keep entries accurate, inclusive, and respectful of the community this project serves.

---

## License

[MIT](LICENSE)

---

*Built with ❤️ in Hamburg.*
