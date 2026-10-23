import { useState } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import type { ApiError } from '../api/errors'
import type { League, SeasonBadge } from '../domain/league'
import { ErrorState } from './ErrorState'

interface Props {
  league: League
  badge: UseQueryResult<SeasonBadge | undefined, ApiError>
}

/** The 128×128 box is there in every state, so the sheet never jumps when the image arrives. */
export function BadgeBox({ league, badge }: Props) {
  if (badge.isPending) {
    return (
      <>
        <div className="badge-box loading" aria-hidden="true" />
        <p className="badge-cap">Loading season badge…</p>
      </>
    )
  }
  if (badge.isError) return <ErrorState error={badge.error} onRetry={badge.refetch} />
  if (!badge.data) {
    return (
      <>
        <div className="badge-box" aria-hidden="true" />
        <p className="badge-cap">No season badge available for this league.</p>
      </>
    )
  }
  return (
    <>
      <BadgeImage key={badge.data.badgeUrl} league={league} badge={badge.data} />
      <p className="badge-cap">Season {badge.data.season}</p>
    </>
  )
}

function BadgeImage({ league, badge }: { league: League; badge: SeasonBadge }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="badge-box fallback" role="img" aria-label="Badge image unavailable">
        <ShieldIcon />
      </div>
    )
  }
  return (
    <div className="badge-box">
      <img
        src={`${badge.badgeUrl}/small`}
        width={128}
        height={128}
        alt={`${league.name} ${badge.season} season badge`}
        onError={() => setFailed(true)}
      />
    </div>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true" focusable="false">
      <path
        d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}
