import { API_BASE, API_KEY } from '../config'
import { cleanAlternate, normalizeText, type League, type SeasonBadge } from '../domain/league'
import { ApiError } from './errors'
import { getJson } from './http'

type RawLeague = {
  idLeague: string
  strLeague: string
  strSport: string
  strLeagueAlternate?: string | null
}

type RawSeason = {
  strSeason: string
  strBadge: string | null
}

export function toLeague(raw: RawLeague): League {
  const alternate = cleanAlternate(raw.strLeagueAlternate)
  return {
    id: raw.idLeague,
    name: raw.strLeague,
    sport: raw.strSport,
    alternate,
    searchText: normalizeText(`${raw.strLeague} ${alternate ?? ''}`),
  }
}

export async function fetchLeagues(signal?: AbortSignal): Promise<League[]> {
  const body = await getJson(`${API_BASE}/${API_KEY}/all_leagues.php`, signal)
  return rows<RawLeague>(body, 'leagues').map(toLeague)
}

export async function fetchSeasonBadges(leagueId: string, signal?: AbortSignal): Promise<SeasonBadge[]> {
  const url = `${API_BASE}/${API_KEY}/search_all_seasons.php?badge=1&id=${encodeURIComponent(leagueId)}`
  const body = await getJson(url, signal)
  return rows<RawSeason>(body, 'seasons').flatMap((season) =>
    season.strBadge ? [{ season: season.strSeason, badgeUrl: season.strBadge }] : [],
  )
}

export async function loadDemoLeagues(): Promise<League[]> {
  const { default: demo } = await import('../fixtures/demo-leagues.json')
  return demo.leagues.map(toLeague)
}

function rows<T>(body: unknown, key: 'leagues' | 'seasons'): T[] {
  const value = isRecord(body) ? body[key] : undefined
  if (value === null) return []
  if (!Array.isArray(value)) {
    throw new ApiError('bad-response', `Expected "${key}" to be a list or null`)
  }
  return value as T[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
