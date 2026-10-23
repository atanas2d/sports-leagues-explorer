export type ApiErrorKind = 'rejected' | 'rate-limited' | 'server' | 'network' | 'bad-response'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}

const RETRYABLE: ReadonlySet<ApiErrorKind> = new Set(['rate-limited', 'server', 'network'])

// Only 429 and 5xx are worth a retry. Every other failing status is the provider turning the request
// down (a disabled key gives 403), so it is reported once and not repeated.
export function kindForStatus(status: number): ApiErrorKind {
  if (status === 429) return 'rate-limited'
  if (status >= 500) return 'server'
  return 'rejected'
}

export function isRetryable(error: unknown): boolean {
  return error instanceof ApiError && RETRYABLE.has(error.kind)
}
