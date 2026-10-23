import type { League } from '../domain/league'
import { LeagueCard } from './LeagueCard'

interface Props {
  leagues: League[]
  selectedId: string | null
  onSelect: (league: League) => void
}

export function LeagueList({ leagues, selectedId, onSelect }: Props) {
  return (
    <ul className="list">
      {leagues.map((league) => (
        <li key={league.id}>
          <LeagueCard league={league} selected={league.id === selectedId} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  )
}
