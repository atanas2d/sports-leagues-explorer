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
