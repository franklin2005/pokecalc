import { describe, it, expect } from 'vitest'
import { getAbilityDesc, getItemDesc } from '../ability-item-data'

describe('ability-item-data', () => {
  describe('getAbilityDesc', () => {
    it('should return shortDesc for a known ability', () => {
      const desc = getAbilityDesc('Overgrow')
      expect(desc).toBeTruthy()
      expect(typeof desc).toBe('string')
      expect(desc.length).toBeGreaterThan(0)
    })

    it('should return shortDesc for another known ability', () => {
      const desc = getAbilityDesc('Levitate')
      expect(desc).toBeTruthy()
      expect(desc.length).toBeGreaterThan(0)
    })

    it('should return empty string for an unknown ability', () => {
      const desc = getAbilityDesc('NonexistentAbilityXYZ')
      expect(desc).toBe('')
    })
  })

  describe('getItemDesc', () => {
    it('should return shortDesc for a known item', () => {
      const desc = getItemDesc('Focus Sash')
      expect(desc).toBeTruthy()
      expect(typeof desc).toBe('string')
      expect(desc.length).toBeGreaterThan(0)
    })

    it('should return shortDesc for another known item', () => {
      const desc = getItemDesc('Leftovers')
      expect(desc).toBeTruthy()
      expect(desc.length).toBeGreaterThan(0)
    })

    it('should return empty string for an unknown item', () => {
      const desc = getItemDesc('NonexistentItemXYZ')
      expect(desc).toBe('')
    })
  })
})
