export interface League {
  id: string
  name: string
  sport: string
  alternate?: string
  searchText: string
}

export interface SeasonBadge {
  season: string
  badgeUrl: string
}

export interface Filters {
  query: string
  sport: string | null
}

export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
}

export function cleanAlternate(raw?: string | null): string | undefined {
  const trimmed = raw?.trim()
  return trimmed ? trimmed : undefined
}
