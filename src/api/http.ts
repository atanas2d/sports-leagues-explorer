import { ApiError, kindForStatus } from './errors'

const SNIPPET_LENGTH = 100

/**
 * Checks status and content type before parsing: the provider answers a bad key (403) and a rate
 * limit (429) with plain text, so a blind response.json() would hide the real reason.
 */
export async function getJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetchOrNetworkError(url, signal)
  if (!response.ok) {
    throw new ApiError(kindForStatus(response.status), await bodySnippet(response), response.status)
  }
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new ApiError('bad-response', `Expected JSON, got ${contentType || 'no content type'}`, response.status)
  }
  try {
    return await response.json()
  } catch {
    throw new ApiError('bad-response', 'The response body is not valid JSON', response.status)
  }
}

// fetch() throws only when no response arrives: offline, DNS, or a reply without CORS headers (the
// provider's 429 looks like that in a browser). An abort is a cancelled request, not a failure.
async function fetchOrNetworkError(url: string, signal?: AbortSignal): Promise<Response> {
  try {
    return await fetch(url, { signal })
  } catch (error) {
    if (isAbort(error)) throw error
    throw new ApiError('network', error instanceof Error ? error.message : 'Network request failed')
  }
}

// By name, not instanceof DOMException: jsdom and the browser use different classes.
function isAbort(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'
}

async function bodySnippet(response: Response): Promise<string> {
  const text = (await response.text()).trim()
  return text ? text.slice(0, SNIPPET_LENGTH) : `HTTP ${response.status}`
}
