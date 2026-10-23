import { useMemo, useState } from 'react'
import { BadgeSheet } from './components/BadgeSheet'
import { DataSourceNote } from './components/DataSourceNote'
import { EmptyState } from './components/EmptyState'
import { ErrorState } from './components/ErrorState'
import { LeagueList } from './components/LeagueList'
import { LeagueListSkeleton } from './components/LeagueListSkeleton'
import { ResultsSummary } from './components/ResultsSummary'
import { SearchInput } from './components/SearchInput'
import { SportSelect } from './components/SportSelect'
import { isDemo } from './config'
import { filterLeagues, sportsFrom } from './domain/filter'
import { useFilters } from './hooks/useFilters'
import { useLeagues } from './hooks/useLeagues'

export default function App() {
  const demo = isDemo()
  const { filters, setQuery, setSport, clear } = useFilters()
  const { data: leagues = [], isPending, error, refetch } = useLeagues(demo)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const options = useMemo(() => sportsFrom(leagues), [leagues])
  const sport = options.some((option) => option.sport === filters.sport) ? filters.sport : null
  const shown = useMemo(
    () => filterLeagues(leagues, { query: filters.query, sport }),
    [leagues, filters.query, sport],
  )
  const selected = leagues.find((league) => league.id === selectedId) ?? null

  function results() {
    if (isPending) return <LeagueListSkeleton />
    if (error) return <ErrorState error={error} onRetry={refetch} />
    return (
      <>
        <ResultsSummary shown={shown.length} total={leagues.length} />
        {shown.length === 0 ? (
          <EmptyState query={filters.query} onClear={clear} />
        ) : (
          <LeagueList leagues={shown} selectedId={selectedId} onSelect={(league) => setSelectedId(league.id)} />
        )}
      </>
    )
  }

  return (
    <>
      <header className="app-head">
        <h1>Sports Leagues</h1>
        <p>Data: TheSportsDB</p>
      </header>
      <DataSourceNote demo={demo} sportCount={options.length} />
      <div className="filters" role="search">
        <SearchInput value={filters.query} onChange={setQuery} />
        <SportSelect value={sport} options={options} onChange={setSport} />
      </div>
      {results()}
      <BadgeSheet league={selected} onClose={() => setSelectedId(null)} />
    </>
  )
}
