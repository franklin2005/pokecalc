import { describe, it, expect } from 'vitest'
import { EV_PRESETS, isValidChampionsEVs, totalEVs } from '../ev-presets'
import { CHAMPIONS_EV_MAX_PER_STAT, CHAMPIONS_EV_TOTAL_MAX } from '../../types/calc'

describe('ev-presets', () => {
  it('should export a non-empty array of presets', () => {
    expect(Array.isArray(EV_PRESETS)).toBe(true)
    expect(EV_PRESETS.length).toBeGreaterThan(0)
  })

  it('each preset should have a name and evs object', () => {
    for (const preset of EV_PRESETS) {
      expect(typeof preset.name).toBe('string')
      expect(preset.name.length).toBeGreaterThan(0)
      expect(preset.evs).toBeDefined()
      expect(typeof preset.evs).toBe('object')
    }
  })

  it('each preset EVs should have all 6 stats', () => {
    const statKeys = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const
    for (const preset of EV_PRESETS) {
      for (const key of statKeys) {
        expect(preset.evs[key]).toBeDefined()
        expect(typeof preset.evs[key]).toBe('number')
      }
    }
  })

  it('all presets should respect max per stat (32)', () => {
    const statKeys = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const
    for (const preset of EV_PRESETS) {
      for (const key of statKeys) {
        expect(preset.evs[key]).toBeLessThanOrEqual(CHAMPIONS_EV_MAX_PER_STAT)
        expect(preset.evs[key]).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('all presets should respect total EV limit (66)', () => {
    for (const preset of EV_PRESETS) {
      const total = totalEVs(preset.evs)
      expect(total).toBeLessThanOrEqual(CHAMPIONS_EV_TOTAL_MAX)
    }
  })

  it('isValidChampionsEVs should validate correct EVs', () => {
    expect(
      isValidChampionsEVs({ hp: 32, atk: 32, def: 0, spa: 0, spd: 0, spe: 2 })
    ).toBe(true)
    expect(
      isValidChampionsEVs({ hp: 10, atk: 10, def: 10, spa: 10, spd: 10, spe: 16 })
    ).toBe(true)
  })

  it('isValidChampionsEVs should reject invalid EVs', () => {
    // Over total limit
    expect(
      isValidChampionsEVs({ hp: 32, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 })
    ).toBe(false)
    // Over per-stat limit
    expect(
      isValidChampionsEVs({ hp: 33, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 })
    ).toBe(false)
    // Negative value
    expect(
      isValidChampionsEVs({ hp: -1, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 })
    ).toBe(false)
  })

  it('totalEVs should sum all stats correctly', () => {
    expect(
      totalEVs({ hp: 32, atk: 32, def: 0, spa: 0, spd: 0, spe: 2 })
    ).toBe(66)
    expect(
      totalEVs({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 })
    ).toBe(0)
    expect(
      totalEVs({ hp: 10, atk: 10, def: 10, spa: 10, spd: 10, spe: 10 })
    ).toBe(60)
  })

  it('should include common competitive presets', () => {
    const names = EV_PRESETS.map((p) => p.name)
    expect(names).toContain('Max Speed + Max Attack')
    expect(names).toContain('Max Speed + Max SpA')
    expect(names).toContain('Physical Wall')
    expect(names).toContain('Special Wall')
  })
})
