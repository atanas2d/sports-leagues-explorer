import { describe, expect, it } from 'vitest'
import { API_BASE, API_KEY, isDemo } from '../config'

describe('config', () => {
  it('uses the free test key unless VITE_SPORTSDB_KEY is set', () => {
    expect(API_KEY).toBe('123')
    expect(API_BASE).toBe('https://www.thesportsdb.com/api/v1/json')
  })

  it('reads demo mode from ?demo=1 only', () => {
    expect(isDemo('?demo=1')).toBe(true)
    expect(isDemo('?q=prem&demo=1')).toBe(true)
    expect(isDemo('?demo=0')).toBe(false)
    expect(isDemo('')).toBe(false)
  })
})
