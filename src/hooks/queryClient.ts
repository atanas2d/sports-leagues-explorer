import { QueryClient } from '@tanstack/react-query'
import { isRetryable } from '../api/errors'

const MAX_RETRIES = 2
const MAX_RETRY_DELAY_MS = 8000

/**
 * Retries are few and jittered on purpose: the provider blocks an IP that keeps hitting its rate
 * limit, so a client that retries hard makes the block longer. Static data: no refetch on focus.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => isRetryable(error) && failureCount < MAX_RETRIES,
      retryDelay: (attempt) => Math.random() * Math.min(1000 * 2 ** attempt, MAX_RETRY_DELAY_MS),
      refetchOnWindowFocus: false,
    },
  },
})
