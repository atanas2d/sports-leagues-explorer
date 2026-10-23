interface Props {
  demo: boolean
  sportCount: number
}

/** Tells the reviewer where the data comes from and offers the other source, as plain links. */
export function DataSourceNote({ demo, sportCount }: Props) {
  if (demo) {
    return (
      <p className="demo-banner">
        <b>Demo data:</b> 30 real leagues captured on 21 Oct 2026. The free API key returns only 10
        soccer leagues. <a href={window.location.pathname}>Back to live data</a>
      </p>
    )
  }
  if (sportCount !== 1) return null
  return (
    <p className="source-note">
      The free API key returns 10 soccer leagues.{' '}
      <a href="?demo=1">See 30 leagues from 5 sports (demo data)</a>
    </p>
  )
}
