# Fixtures: real TheSportsDB responses

Verbatim responses from the free v1 API (key `123`), fetched on 2026-10-21, one request every
6 seconds. Base URL for every call: `https://www.thesportsdb.com/api/v1/json/123/`.

| File | Request | Used by |
|---|---|---|
| `demo-leagues.json` | `all_leagues.php` (the 10 leagues the free key returns) plus `search_all_leagues.php?s=<sport>` for Basketball, Motorsport, Ice Hockey and Tennis (5 each), reduced to the `all_leagues` shape plus `strLeagueAlternate` | `?demo=1` and the filter tests |
| `../test/fixtures/badge-4328.json` | `search_all_seasons.php?badge=1&id=4328` (English Premier League) | API and cache tests |
| `../test/fixtures/badge-none.json` | `search_all_seasons.php?badge=1&id=999999` (unknown id) | the "no badge" test |

The demo file exists because the free key returns 10 soccer leagues: with live data the sport filter
has one option. Values are untouched. `strLeagueAlternate` is missing on the 10 live leagues, is `""`
on some, has a trailing space on one and lists several comma-separated names on others. The code has
to handle all of that, which is why the fixture is real data and not hand-written.
