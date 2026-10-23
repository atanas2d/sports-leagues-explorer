import type { ApiError, ApiErrorKind } from '../api/errors'

interface Props {
  error: ApiError
  onRetry: () => void
}

const UNREACHABLE = {
  title: "Couldn't reach the data provider",
  detail: 'If this keeps happening, it may be limiting requests: try again in a minute.',
  retry: true,
}

const MESSAGES: Record<ApiErrorKind, { title: string; detail: string; retry: boolean }> = {
  rejected: {
    title: 'The data provider rejected the request',
    detail: 'The API key may have changed. See "API key" in the README.',
    retry: false,
  },
  'rate-limited': {
    title: 'Too many requests to the data provider',
    detail: 'Try again in a minute.',
    retry: true,
  },
  network: UNREACHABLE,
  server: UNREACHABLE,
  'bad-response': {
    title: 'Unexpected response from the data provider',
    detail: 'Try again. If it keeps happening, the API may have changed.',
    retry: true,
  },
}

export function ErrorState({ error, onRetry }: Props) {
  // Every query function throws an ApiError; the fallback keeps a stray Error from blanking the page.
  const { title, detail, retry } = MESSAGES[error.kind] ?? UNREACHABLE
  return (
    <div className="state" role="alert">
      <h2>{title}</h2>
      <p>{detail}</p>
      {retry && (
        <button type="button" className="app-btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
