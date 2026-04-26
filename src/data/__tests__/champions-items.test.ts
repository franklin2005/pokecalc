import { describe, it, expect } from 'vitest'
import { CHAMPIONS_ITEMS, isChampionsItem } from '../champions-items'

describe('champions-items', () => {
  it('should export a non-empty array of strings', () => {
    expect(Array.isArray(CHAMPIONS_ITEMS)).toBe(true)
    expect(CHAMPIONS_ITEMS.length).toBeGreaterThan(0)
    for (const item of CHAMPIONS_ITEMS) {
      expect(typeof item).toBe('string')
      expect(item.length).toBeGreaterThan(0)
    }
  })

  it('should include common Champions items', () => {
    const expectedItems = [
      'Choice Band',
      'Choice Specs',
      'Choice Scarf',
      'Life Orb',
      'Leftovers',
      'Assault Vest',
      'Focus Sash',
      'Expert Belt',
      'Eviolite',
      'Heavy-Duty Boots',
    ]
    for (const item of expectedItems) {
      expect(CHAMPIONS_ITEMS).toContain(item)
    }
  })

  it('should include mega stones', () => {
    const megaStones = [
      'Charizardite X',
      'Charizardite Y',
      'Gengarite',
      'Lucarionite',
      'Mewtwonite X',
    ]
    for (const stone of megaStones) {
      expect(CHAMPIONS_ITEMS).toContain(stone)
    }
  })

  it('isChampionsItem should return true for allowed items', () => {
    expect(isChampionsItem('Life Orb')).toBe(true)
    expect(isChampionsItem('Choice Scarf')).toBe(true)
    expect(isChampionsItem('Leftovers')).toBe(true)
  })

  it('isChampionsItem should return false for disallowed items', () => {
    // Items not in Champions mode
    expect(isChampionsItem('Master Ball')).toBe(false)
    expect(isChampionsItem('Rare Candy')).toBe(false)
    expect(isChampionsItem('Nonexistent Item')).toBe(false)
  })

  it('should have no duplicate items', () => {
    const uniqueItems = new Set(CHAMPIONS_ITEMS)
    expect(uniqueItems.size).toBe(CHAMPIONS_ITEMS.length)
  })
})
