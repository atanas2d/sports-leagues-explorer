export const API_BASE = 'https://www.thesportsdb.com/api/v1/json'

export const API_KEY: string = import.meta.env.VITE_SPORTSDB_KEY ?? '123'

/**
 * ?demo=1 loads 30 real leagues from 5 sports (src/fixtures) instead of the live API: the free key
 * returns 10 soccer leagues, which never exercises the sport filter, and is rate-limited.
 */
export function isDemo(search: string = window.location.search): boolean {
  return new URLSearchParams(search).get('demo') === '1'
}
