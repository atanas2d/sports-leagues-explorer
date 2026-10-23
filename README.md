# Sports Leagues Explorer

A small single-page app that lists sports leagues from TheSportsDB, with search, a sport filter and
season badges.

## Stack

- React 19 + TypeScript, built with Vite
- TanStack Query for fetching and caching API responses
- Vitest + Testing Library for tests
- Own CSS with design tokens, no UI library

## Run

Requires Node 20 or newer.

    npm ci
    npm run dev       # http://localhost:5173
    npm test
    npm run build
    npm run lint

## Demo data

The free API key returns 10 leagues, all soccer, so the sport filter has nothing to filter. Open
`http://localhost:5173/?demo=1` to load 30 real leagues from 5 sports instead, captured from the same
API on 21 Oct 2026 (see `src/fixtures/README.md`). A banner shows while demo data is on.

## API key

The app uses TheSportsDB's free test key `123`, which the provider documents as public. The free tier
returns 10 leagues per call and 5 seasons per badge lookup, and allows 30 requests per minute; a
breach answers with HTTP 429 for about a minute, which the app reports as "try again in a minute".

To use another key, set `VITE_SPORTSDB_KEY` when running or building:

    VITE_SPORTSDB_KEY=your-key npm run dev

Anything in a `VITE_*` variable ends up in the public bundle, so a paid key belongs behind a proxy,
not in the browser.

## Notes

- [DECISIONS.md](DECISIONS.md): what the API really returns, the architecture, caching, errors,
  trade-offs and the time spent.
- [AI.md](AI.md): how AI tools were used and what was done by hand.
