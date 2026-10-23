import { afterEach, describe, expect, it, vi } from 'vitest'
import badge4328 from './fixtures/badge-4328.json'
import badgeNone from './fixtures/badge-none.json'
import { ApiError, isRetryable } from '../api/errors'
import { fetchLeagues, fetchSeasonBadges, toLeague } from '../api/sportsDb'

const KEY_DISABLED =
  "The old '3' Free Sports API key is permanently disabled, Please use the new test key \"123\" for development."

function respond(body: string, status: number, contentType: string) {
  const fetchMock = vi.fn(async () => new Response(body, { status, headers: { 'content-type': contentType } }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const respondJson = (value: unknown) => respond(JSON.stringify(value), 200, 'application/json')

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchLeagues', () => {
  it('requests all_leagues.php with the configured key and maps the rows to leagues', async () => {
    const fetchMock = respondJson({
      leagues: [{ idLeague: '4328', strLeague: 'English Premier League', strSport: 'Soccer' }],
    })
    await expect(fetchLeagues()).resolves.toEqual([
      { id: '4328', name: 'English Premier League', sport: 'Soccer', searchText: 'english premier league' },
    ])
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.thesportsdb.com/api/v1/json/123/all_leagues.php',
      expect.anything(),
    )
  })

  it('returns an empty list when the API sends { leagues: null }', async () => {
    respondJson({ leagues: null })
    await expect(fetchLeagues()).resolves.toEqual([])
  })

  it('maps a 403 with a text body to a rejected ApiError carrying the text', async () => {
    respond(KEY_DISABLED, 403, 'text/plain')
    const request = fetchLeagues()
    await expect(request).rejects.toBeInstanceOf(ApiError)
    await expect(request).rejects.toMatchObject({ kind: 'rejected', status: 403 })
    await expect(request).rejects.toThrow(/permanently disabled/)
  })

  it('maps a 429 to a retryable rate-limited ApiError', async () => {
    respond('error code: 1015', 429, 'text/plain')
    const error: unknown = await fetchLeagues().catch((e: unknown) => e)
    expect(error).toMatchObject({ kind: 'rate-limited', status: 429 })
    expect(isRetryable(error)).toBe(true)
  })

  it('maps a failed fetch to a retryable network ApiError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    const error: unknown = await fetchLeagues().catch((e: unknown) => e)
    expect(error).toMatchObject({ kind: 'network', message: 'Failed to fetch' })
    expect(isRetryable(error)).toBe(true)
  })

  it('maps a 200 with HTML to a bad-response ApiError', async () => {
    respond('<!doctype html><title>Maintenance</title>', 200, 'text/html')
    await expect(fetchLeagues()).rejects.toMatchObject({ kind: 'bad-response' })
  })

})

describe('fetchSeasonBadges', () => {
  it('returns one badge per season, in the order the API sends them', async () => {
    const fetchMock = respondJson(badge4328)
    const badges = await fetchSeasonBadges('4328')
    expect(badges).toHaveLength(5)
    expect(badges[0]).toEqual({
      season: '1992-1993',
      badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badgearchive/02egea1661959225.png',
    })
    expect(badges.at(-1)?.season).toBe('1996-1997')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.thesportsdb.com/api/v1/json/123/search_all_seasons.php?badge=1&id=4328',
      expect.anything(),
    )
  })

  it('returns an empty list when the API sends { seasons: null }', async () => {
    respondJson(badgeNone)
    await expect(fetchSeasonBadges('999999')).resolves.toEqual([])
  })

})

describe('toLeague', () => {
  it('leaves alternate undefined and out of searchText when the API omits it', () => {
    const league = toLeague({ idLeague: '4328', strLeague: 'English Premier League', strSport: 'Soccer' })
    expect(league.alternate).toBeUndefined()
    expect(league.searchText).toBe('english premier league')
  })

})
