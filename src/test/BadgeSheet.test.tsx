import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BadgeSheet } from '../components/BadgeSheet'
import type { League } from '../domain/league'
import badges from './fixtures/badge-4328.json'
import noBadges from './fixtures/badge-none.json'

const PREMIER: League = {
  id: '4328',
  name: 'English Premier League',
  sport: 'Soccer',
  alternate: 'Premier League',
  searchText: 'english premier league premier league',
}
const NEWEST_BADGE = 'https://r2.thesportsdb.com/images/media/league/badgearchive/1eaj5e1661959269.png'

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
}

function renderSheet(league: League | null) {
  const onClose = vi.fn()
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <BadgeSheet league={league} onClose={onClose} />
    </QueryClientProvider>,
  )
  return onClose
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('BadgeSheet', () => {
  it('names the dialog after the league and shows the newest season badge', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(badges)))
    renderSheet(PREMIER)
    expect(screen.getByRole('dialog', { name: 'English Premier League' })).toBeInTheDocument()
    expect(screen.getByText('Soccer · Premier League')).toBeInTheDocument()
    expect(screen.getByText('Loading season badge…')).toBeInTheDocument()

    const image = await screen.findByRole('img', { name: 'English Premier League 1996-1997 season badge' })
    expect(image).toHaveAttribute('src', `${NEWEST_BADGE}/small`)
    expect(image).toHaveAttribute('width', '128')
    expect(image).toHaveAttribute('height', '128')
    expect(screen.getByText('Season 1996-1997')).toBeInTheDocument()
    expect(screen.queryByText('Loading season badge…')).not.toBeInTheDocument()
  })

  it('says so when the league has no season badge', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(noBadges)))
    renderSheet(PREMIER)
    expect(await screen.findByText('No season badge available for this league.')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('closes on a tap on the backdrop but not on its content', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(badges)))
    const onClose = renderSheet(PREMIER)
    fireEvent.click(screen.getByRole('heading', { name: 'English Premier League' }))
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
