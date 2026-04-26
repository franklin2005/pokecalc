import { describe, it, expect } from 'vitest'
import { SP_PRESETS, isValidChampionsSPs, totalSPs } from '../sp-presets'
import { CHAMPIONS_SP_MAX_PER_STAT, CHAMPIONS_SP_TOTAL_MAX } from '../../types/calc'

describe('sp-presets', () => {
  it('should export a non-empty array of presets', () => {
    expect(Array.isArray(SP_PRESETS)).toBe(true)
    expect(SP_PRESETS.length).toBeGreaterThan(0)
  })

  it('each preset should have a name and sps object', () => {
    for (const preset of SP_PRESETS) {
      expect(typeof preset.name).toBe('string')
      expect(preset.name.length).toBeGreaterThan(0)
      expect(preset.sps).toBeDefined()
      expect(typeof preset.sps).toBe('object')
    }
  })

  it('each preset SPs should have all 6 stats', () => {
    const statKeys = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const
    for (const preset of SP_PRESETS) {
      for (const key of statKeys) {
        expect(preset.sps[key]).toBeDefined()
        expect(typeof preset.sps[key]).toBe('number')
      }
    }
  })

  it('all presets should respect max per stat (32)', () => {
    const statKeys = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const
    for (const preset of SP_PRESETS) {
      for (const key of statKeys) {
        expect(preset.sps[key]).toBeLessThanOrEqual(CHAMPIONS_SP_MAX_PER_STAT)
        expect(preset.sps[key]).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('all presets should respect total SP limit (66)', () => {
    for (const preset of SP_PRESETS) {
      const total = totalSPs(preset.sps)
      expect(total).toBeLessThanOrEqual(CHAMPIONS_SP_TOTAL_MAX)
    }
  })

  it('isValidChampionsSPs should validate correct SPs', () => {
    expect(
      isValidChampionsSPs({ hp: 32, atk: 32, def: 0, spa: 0, spd: 0, spe: 2 })
    ).toBe(true)
    expect(
      isValidChampionsSPs({ hp: 10, atk: 10, def: 10, spa: 10, spd: 10, spe: 16 })
    ).toBe(true)
  })

  it('isValidChampionsSPs should reject invalid SPs', () => {
    expect(
      isValidChampionsSPs({ hp: 32, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 })
    ).toBe(false)
    expect(
      isValidChampionsSPs({ hp: 33, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 })
    ).toBe(false)
    expect(
      isValidChampionsSPs({ hp: -1, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 })
    ).toBe(false)
  })

  it('totalSPs should sum all stats correctly', () => {
    expect(
      totalSPs({ hp: 32, atk: 32, def: 0, spa: 0, spd: 0, spe: 2 })
    ).toBe(66)
    expect(
      totalSPs({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 })
    ).toBe(0)
    expect(
      totalSPs({ hp: 10, atk: 10, def: 10, spa: 10, spd: 10, spe: 10 })
    ).toBe(60)
  })

  it('should include common competitive presets', () => {
    const names = SP_PRESETS.map((p) => p.name)
    expect(names).toContain('Max Speed + Max Attack')
    expect(names).toContain('Max Speed + Max SpA')
    expect(names).toContain('Physical Wall')
    expect(names).toContain('Special Wall')
  })
})