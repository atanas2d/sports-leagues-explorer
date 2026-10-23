import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '../api/errors'
import { fetchLeagues, loadDemoLeagues } from '../api/sportsDb'
import type { League } from '../domain/league'

export function useLeagues(demo: boolean) {
  return useQuery<League[], ApiError>({
    queryKey: ['leagues', demo ? 'demo' : 'live'],
    queryFn: ({ signal }) => (demo ? loadDemoLeagues() : fetchLeagues(signal)),
    staleTime: Infinity,
  })
}
