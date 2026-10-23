import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderApp, stubFetch } from './renderApp'

const SOCCER = {
  leagues: [
    { idLeague: '4328', strLeague: 'English Premier League', strSport: 'Soccer' },
    { idLeague: '4331', strLeague: 'German Bundesliga', strSport: 'Soccer' },
  ],
}

afterEach(() => {
  vi.unstubAllGlobals()
  history.replaceState(null, '', '/')
})

describe('App: the URL and the data source', () => {
  it('renders a query of HTML as text, never as markup', async () => {
    history.replaceState(null, '', '/?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E')
    stubFetch(SOCCER)
    renderApp()
    const heading = await screen.findByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('No leagues match “<script>alert(1)</script>”')
    expect(document.querySelector('script')).toBeNull()
  })

  it('serves the demo fixture without a request and keeps ?demo=1 while filtering', async () => {
    history.replaceState(null, '', '/?demo=1#top')
    const fetchMock = stubFetch(SOCCER)
    renderApp()
    await screen.findByRole('button', { name: /V8 Supercars/ })
    expect(fetchMock).not.toHaveBeenCalled()
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search leagues' }), 'repco')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(window.location.search).toBe('?demo=1&q=repco')
    expect(window.location.hash).toBe('#top')
  })
})
