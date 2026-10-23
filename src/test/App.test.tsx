import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'

const LEAGUES = {
  leagues: [
    { idLeague: '4328', strLeague: 'English Premier League', strSport: 'Soccer' },
    { idLeague: '4331', strLeague: 'German Bundesliga', strSport: 'Soccer' },
    {
      idLeague: '4734',
      strLeague: 'Argentine LNB',
      strSport: 'Basketball',
      strLeagueAlternate: 'Liga Nacional de Básquet',
    },
  ],
}

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
}

function renderApp() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  history.replaceState(null, '', '/')
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('renders the leagues and filters them as the user types', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(LEAGUES)))
    renderApp()
    expect(await screen.findByRole('button', { name: /English Premier League/ })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('Showing 3 of 3 leagues')).toBeInTheDocument()

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search leagues' }), 'basquet')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByRole('button', { name: /Argentine LNB/ })).toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 3 leagues')).toBeInTheDocument()
    expect(window.location.search).toBe('?q=basquet')
  })

  it('filters by sport from a dropdown built from the data', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(LEAGUES)))
    renderApp()
    await screen.findByRole('button', { name: /English Premier League/ })

    const select = screen.getByRole('combobox', { name: 'Sport' })
    expect(select).toHaveTextContent('All sports (3)')
    expect(select).toHaveTextContent('Basketball (1)')
    expect(select).toHaveTextContent('Soccer (2)')

    await userEvent.selectOptions(select, 'Basketball')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(window.location.search).toBe('?sport=Basketball')
  })

  it('shows an empty state with a working "Clear filters" button', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(LEAGUES)))
    renderApp()
    await screen.findByRole('button', { name: /English Premier League/ })

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search leagues' }), 'xyz')
    expect(screen.getByText(/No leagues match/)).toHaveTextContent('xyz')
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(window.location.search).toBe('')
  })

  it('offers the demo data when the live data has a single sport', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ leagues: LEAGUES.leagues.slice(0, 2) })))
    renderApp()
    await screen.findByRole('button', { name: /English Premier League/ })
    expect(screen.getByRole('link', { name: /demo data/ })).toHaveAttribute('href', '?demo=1')
  })

  it('shows the error state and makes a new request on "Try again"', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('oops', { status: 503, headers: { 'content-type': 'text/html' } }))
      .mockResolvedValueOnce(jsonResponse(LEAGUES))
    vi.stubGlobal('fetch', fetchMock)
    renderApp()
    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't reach the data provider")

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('button', { name: /English Premier League/ })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
