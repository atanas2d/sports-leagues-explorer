import { useEffect, useState } from 'react'
import type { Filters } from '../domain/league'

/** Search and sport filters, mirrored in the URL (?q=, ?sport=) so a filtered view can be shared. */
export function useFilters() {
  const [filters, setFilters] = useState<Filters>(() => readFilters(window.location.search))

  useEffect(() => {
    writeFilters(filters)
  }, [filters])

  return {
    filters,
    setQuery: (query: string) => setFilters((current) => ({ ...current, query })),
    setSport: (sport: string | null) => setFilters((current) => ({ ...current, sport })),
    clear: () => setFilters({ query: '', sport: null }),
  }
}

function readFilters(search: string): Filters {
  const params = new URLSearchParams(search)
  return { query: params.get('q') ?? '', sport: params.get('sport') || null }
}

function writeFilters({ query, sport }: Filters) {
  const url = new URL(window.location.href)
  if (query) url.searchParams.set('q', query)
  else url.searchParams.delete('q')
  if (sport) url.searchParams.set('sport', sport)
  else url.searchParams.delete('sport')
  history.replaceState(null, '', url)
}
