import type { League } from '../domain/league'

interface Props {
  league: League
  selected: boolean
  onSelect: (league: League) => void
}

export function LeagueCard({ league, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      className="league"
      aria-current={selected ? 'true' : undefined}
      onClick={() => onSelect(league)}
    >
      <span className="name">{league.name}</span>
      <span className="sport">{league.sport}</span>
      {league.alternate && <span className="alt">{league.alternate}</span>}
    </button>
  )
}
