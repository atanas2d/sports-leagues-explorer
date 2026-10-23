import { skipToken, useQuery } from '@tanstack/react-query'
import type { ApiError } from '../api/errors'
import { fetchSeasonBadges } from '../api/sportsDb'
import { pickBadge } from '../domain/filter'
import type { SeasonBadge } from '../domain/league'

/**
 * gcTime: Infinity keeps the badge of a closed sheet in the cache. By default an unobserved query is
 * dropped after five minutes, and opening the same league again would be a new request.
 */
export function useSeasonBadge(leagueId: string | null) {
  return useQuery<SeasonBadge[], ApiError, SeasonBadge | undefined>({
    queryKey: ['badge', leagueId],
    queryFn: leagueId === null ? skipToken : ({ signal }) => fetchSeasonBadges(leagueId, signal),
    staleTime: Infinity,
    gcTime: Infinity,
    select: pickBadge,
  })
}
