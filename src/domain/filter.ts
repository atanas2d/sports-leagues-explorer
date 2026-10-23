import { normalizeText, type Filters, type League, type SeasonBadge } from './league'

export interface SportOption {
  sport: string
  count: number
}

export function filterLeagues(leagues: League[], filters: Filters): League[] {
  const query = normalizeText(filters.query)
  return leagues.filter(
    (league) =>
      (filters.sport === null || league.sport === filters.sport) &&
      (query === '' || league.searchText.includes(query)),
  )
}

export function sportsFrom(leagues: League[]): SportOption[] {
  const counts = new Map<string, number>()
  for (const league of leagues) {
    counts.set(league.sport, (counts.get(league.sport) ?? 0) + 1)
  }
  return [...counts]
    .map(([sport, count]) => ({ sport, count }))
    .sort((a, b) => a.sport.localeCompare(b.sport))
}

export function pickBadge(seasons: SeasonBadge[]): SeasonBadge | undefined {
  return seasons.at(-1)
}
