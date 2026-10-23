# Decisions

Design notes for this take-home. Short on purpose: the code and the tests carry the detail.

## 1. Product context

The brief describes a component of an online bookmaker platform. Its users are on phones, often cheap
Android devices, on expensive or flaky mobile data. That shaped three choices: no UI library and no web
fonts (a small bundle, text that renders at once), everything cached so a tap never repeats a request,
and honest error screens instead of spinners that never end.

## 2. What the API actually returns

Checked against the live API and its documentation before writing code.

| Finding                                                                                                                            | Consequence                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The key `3` from the brief is permanently disabled (HTTP 403, plain text)                                                          | The app uses the documented free key `123`; a 403 is shown as "the data provider rejected the request"                                                                                  |
| `all_leagues.php` returns 10 leagues with the free key, all soccer; the docs say "Free Limit: 10"                                  | A deliberate cap, not a bug. The sport dropdown is built from the data, so it shows what is there                                                                                       |
| `all_leagues.php` has no `strLeagueAlternate` on any tier: the OpenAPI `LeagueSchema` has only `idLeague`, `strLeague`, `strSport` | The field is optional and shown when present. Fetching it per league via `lookupleague.php` would be N+1 requests (10 on load, 31 in demo mode) against a 30-per-minute limit: rejected |
| The badge call returns up to 5 seasons, oldest first; an unknown id returns `{"seasons":null}`                                     | The newest returned season is shown; `null` is a "no badge" state, not an error                                                                                                         |
| Free tier: 30 requests per minute; a breach is a Cloudflare 429 without CORS headers                                               | In a browser that 429 surfaces as a network error; retries are few and jittered; development used demo data                                                                             |

Because the live data cannot show the sport filter doing anything, `?demo=1` loads 30 real leagues
from five sports, captured from the same API (see `src/fixtures/README.md`).

## 3. Requirements coverage

| Requirement                                            | How                                                                                                          |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Fetch and display leagues: name, sport, alternate name | `fetchLeagues` maps the raw rows to `League`; `LeagueCard` shows the alternate name when present             |
| Search by name                                         | `filterLeagues`: a substring match over name and alternate, ignoring case, surrounding spaces and diacritics |
| Dropdown filter by sport                               | `sportsFrom` builds the options from the data, with a count per sport                                        |
| Component architecture                                 | `api → domain → hooks → components`, one responsibility per file                                             |
| Responsive                                             | Mobile-first, one column; three columns and a centred modal from 720 px                                      |
| Click a league, show a season badge                    | `useSeasonBadge` and `BadgeSheet`, a native `<dialog>`                                                       |
| Cache responses                                        | TanStack Query, see 5                                                                                        |

## 4. Architecture

`TheSportsDB → api/ → domain/ → hooks/ → components/`. Only `api/` knows the provider's URLs and field
names. `domain/` is plain TypeScript with no imports: the filters and the badge choice, tested in
milliseconds with a fixture. `hooks/` is the only place that knows TanStack Query. Components receive a
`League` and callbacks. Dependencies point one way, so the provider, the data library or the view layer
can each be replaced on their own.

## 5. Caching

Two layers. In memory, TanStack Query keeps every response by key (`['leagues', 'live' | 'demo']`,
`['badge', id]`) with `staleTime: Infinity`, so a second tap on the same league is served without a
request, and two fast taps are deduplicated into one. Badges also get `gcTime: Infinity`: without it a
closed sheet leaves the query unobserved and the cache drops it after five minutes, which would mean a
new request on the next tap, exactly what the brief forbids. The second layer is free: the provider
sends `cache-control: max-age=14400`, so a reload within four hours is served from the browser's disk
cache.

An own cache (about 40 lines) was considered and rejected: it would re-implement deduplication,
retries, cancellation and loading states that the library already has, and every line would need tests.

## 6. Errors and retries

Every failure becomes an `ApiError` with a `kind`:

| kind           | When                                              | Retried automatically | What the user sees                                               |
| -------------- | ------------------------------------------------- | --------------------- | ---------------------------------------------------------------- |
| `rejected`     | 401, 403 and other 4xx                            | no                    | "The data provider rejected the request", no button              |
| `rate-limited` | 429                                               | yes                   | "Too many requests to the data provider. Try again in a minute." |
| `server`       | 5xx                                               | yes                   | "Couldn't reach the data provider" and a Try again button        |
| `network`      | `fetch` threw: offline, DNS, or the CORS-less 429 | yes                   | the same                                                         |
| `bad-response` | 200 but not JSON, or the wrong shape              | no                    | "Unexpected response", with a manual Try again                   |

Automatic retries: at most two, with full jitter (a random delay of up to one, then two seconds),
because hammering a rate-limited address extends the block. The status and the content type are
checked before `response.json()`, so the 403's text reaches the message instead of a JSON parse error.
`bad-response` gets a manual button but no automatic retry: a human deciding to try again is not a
retry storm.

## 7. Trade-offs and next steps

- A paid key would go behind a small proxy: it keeps the key private, absorbs the rate limit and shares
  one cache across users. Anything in `VITE_*` is public.
- At 1,000+ leagues: `useDeferredValue` for the query and list virtualisation. `searchText` is already
  computed once per league, not on every keystroke.
- No fuzzy search: the brief asks for a filter by name; a substring match is predictable and costs 0 KB.
- The same `domain/` and `api/` would serve a Vue 3 version with `@tanstack/vue-query` and composables.

## 8. Time

About 1 hour and a half of coding (with AI) over two days, plus about 1 hour investigating the API key and the rate
limit before writing code.
