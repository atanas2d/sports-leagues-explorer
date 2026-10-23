const ROWS = 6

export function LeagueListSkeleton() {
  return (
    <ul className="list" aria-busy="true" aria-label="Loading leagues">
      {Array.from({ length: ROWS }, (_, index) => (
        <li key={index} className="skel" />
      ))}
    </ul>
  )
}
