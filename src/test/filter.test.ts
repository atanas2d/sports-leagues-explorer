import { describe, expect, it } from 'vitest'
import demo from '../fixtures/demo-leagues.json'
import { toLeague } from '../api/sportsDb'
import { cleanAlternate, normalizeText, type League, type SeasonBadge } from '../domain/league'
import { filterLeagues, pickBadge, sportsFrom } from '../domain/filter'

const leagues: League[] = demo.leagues.map(toLeague)
const names = (list: League[]) => list.map((league) => league.name)

describe('normalizeText', () => {
  it('lowercases, trims and strips diacritics', () => {
    expect(normalizeText('  Básquet ')).toBe('basquet')
    expect(normalizeText('Québec')).toBe('quebec')
  })
})

describe('filterLeagues', () => {
  it('returns every league in the original order when the filters are empty', () => {
    expect(filterLeagues(leagues, { query: '', sport: null })).toEqual(leagues)
  })

  it('ignores case and surrounding spaces in the query', () => {
    const result = filterLeagues(leagues, { query: '  PREMIER ', sport: null })
    expect(names(result)).toEqual(['English Premier League', 'Scottish Premier League'])
  })

  it('matches alternate names', () => {
    const result = filterLeagues(leagues, { query: 'repco', sport: null })
    expect(names(result)).toEqual(['V8 Supercars'])
  })

  it('ignores diacritics in the query and in the names', () => {
    const result = filterLeagues(leagues, { query: 'basquet', sport: null })
    expect(names(result)).toEqual(['Argentine LNB'])
  })

  it('keeps only the chosen sport', () => {
    const result = filterLeagues(leagues, { query: '', sport: 'Basketball' })
    expect(result).toHaveLength(5)
    expect(result.every((league) => league.sport === 'Basketball')).toBe(true)
  })

  it('applies the query and the sport together', () => {
    expect(filterLeagues(leagues, { query: 'premier', sport: 'Motorsport' })).toEqual([])
  })
})

describe('sportsFrom', () => {
  it('lists each sport once, sorted by name, with its count', () => {
    expect(sportsFrom(leagues)).toEqual([
      { sport: 'Basketball', count: 5 },
      { sport: 'Ice Hockey', count: 5 },
      { sport: 'Motorsport', count: 5 },
      { sport: 'Soccer', count: 10 },
      { sport: 'Tennis', count: 5 },
    ])
  })
})

describe('cleanAlternate', () => {
  it('trims surrounding whitespace', () => {
    expect(cleanAlternate('bet-at-home ICE Hockey League ')).toBe('bet-at-home ICE Hockey League')
  })

  it('turns an empty, blank, null or missing value into undefined', () => {
    expect(cleanAlternate('')).toBeUndefined()
    expect(cleanAlternate('   ')).toBeUndefined()
    expect(cleanAlternate(null)).toBeUndefined()
    expect(cleanAlternate(undefined)).toBeUndefined()
  })
})

describe('pickBadge', () => {
  const seasons: SeasonBadge[] = [
    {
      season: '1992-1993',
      badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badgearchive/02egea1661959225.png',
    },
    {
      season: '1996-1997',
      badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badgearchive/1eaj5e1661959269.png',
    },
  ]

  it('picks the last season returned, the newest the API gives', () => {
    expect(pickBadge(seasons)).toEqual(seasons[1])
  })

  it('returns undefined when there are no seasons', () => {
    expect(pickBadge([])).toBeUndefined()
  })
})
