import { describe, it, expect } from 'vitest'
import { computeStats, spToEV, getNatureEffect } from '../calc-stats'
import { Pokemon, Generations } from '@smogon/calc'

describe('calc-stats (Champions SPs)', () => {
  it('should compute stats correctly with 0 SPs', () => {
    const result = computeStats(
      { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
      { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      'Hardy'
    )
    // Hardy is neutral, level 50, IVs=31
    // HP = floor((2*45+31+100)*50/100)+10 = floor(221*50/100)+10 = 110+10 = 120
    expect(result.hp).toBe(120)
  })

  it('should compute stats with SPs added before nature (neutral nature)', () => {
    // With Hardy (neutral), SPs still add flat +1 per point
    const resultNoSPs = computeStats(
      { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
      { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      'Hardy'
    )
    const resultWithSPs = computeStats(
      { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
      { hp: 0, atk: 32, def: 0, spa: 0, spd: 0, spe: 0 },
      'Hardy'
    )
    // With neutral nature, 1.0 multiplier means SPs are still +1 each
    expect(resultWithSPs.atk - resultNoSPs.atk).toBe(32)
  })

  it('should apply nature modifier AFTER adding SPs', () => {
    // Jolly (+Spe, -SpA) with 32 SPs in speed
    // Venusaur base speed = 80, IV=31, Level=50
    // Raw with SPs: floor((2*80+31)*50/100) + 5 + 32 = 95 + 5 + 32 = 132
    // With Jolly: floor(132 * 1.1) = floor(145.2) = 145
    const result = computeStats(
      { hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80 },
      { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 32 },
      'Jolly'
    )
    expect(result.spe).toBe(145)
  })

  it('should apply hindering nature modifier AFTER adding SPs', () => {
    // Adamant (+Atk, -SpA) with 10 SPs in SpA
    // base spa = 65, IV=31, Level=50
    // Raw with SPs: floor((2*65+31)*50/100) + 5 + 10 = 80 + 5 + 10 = 95
    // With hindering: floor(95 * 0.9) = floor(85.5) = 85
    const result = computeStats(
      { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
      { hp: 0, atk: 10, def: 0, spa: 10, spd: 0, spe: 0 },
      'Adamant'
    )
    expect(result.spa).toBe(85)
  })

  it('should add SPs to HP correctly', () => {
    const resultNoSPs = computeStats(
      { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
      { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      'Hardy'
    )
    const resultWithSPs = computeStats(
      { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
      { hp: 32, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      'Hardy'
    )
    // Nature doesn't affect HP, so SPs are always flat +1
    expect(resultWithSPs.hp - resultNoSPs.hp).toBe(32)
  })

  it('should match @smogon/calc for 0 SPs (baseline)', () => {
    const gen = Generations.get(9)

    // Venusaur with Jolly nature, 0 EVs/SPs — both formulas must agree
    const pokemon = new Pokemon(gen, 'Venusaur', {
      level: 50,
      nature: 'Jolly',
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    })

    const result = computeStats(
      { hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80 },
      { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      'Jolly'
    )

    // With 0 SPs, Champions formula and smogon/calc agree:
    // floor(floor((2*80+31)*50/100 + 5) * 1.1) = floor(100 * 1.1) = 110
    expect(result.spe).toBe(pokemon.stats.spe)
  })

  it('should compute Champions-specific stat (SPs added before nature)', () => {
    // Venusaur, Jolly, 32 SPs in speed
    // Champions: floor(floor((2*80+31)*50/100 + 5 + 32) * 1.1)
    //          = floor(floor(95.5 + 5 + 32) * 1.1)  — wait let me recalculate
    //          = floor(floor((191*50)/100 + 5 + 32) * 1.1)
    //          = floor(floor(95.5 + 37) * 1.1)
    //          = floor(floor(132.5) * 1.1)
    //          = floor(132 * 1.1)
    //          = floor(145.2) = 145
    //
    // Standard EV formula gives 127 (floor((2*80+31+32)*50/100+5) * 1.1)
    // Champions SP formula gives 145 because SPs are added AFTER the inner floor
    // and BEFORE the nature multiplier — different from standard EVs.
    const result = computeStats(
      { hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80 },
      { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 32 },
      'Jolly'
    )
    expect(result.spe).toBe(145)
  })

  describe('spToEV — exact EV mapping for @smogon/calc', () => {
    it('should return EV=0 for SPs=0 (neutral nature)', () => {
      const evs = spToEV(
        { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        { hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80 },
        'Hardy'
      )
      expect(evs.spe).toBe(0)
    })

    it('should find correct EV for boosting nature (Jolly +Spe)', () => {
      // Venusaur base Spe=80, Jolly, 32 SPs
      // Champions: floor(floor((191*50/100)+5+32)*1.1) = floor(132*1.1) = 145
      const evs = spToEV(
        { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 32 },
        { hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80 },
        'Jolly'
      )

      // Verify: @smogon/calc Pokemon with these EVs should produce Spe = 145
      const gen = Generations.get(9)
      const poke = new Pokemon(gen, 'Venusaur', {
        level: 50,
        nature: 'Jolly',
        evs,
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 }
      })
      expect(poke.stats.spe).toBe(145)
    })

    it('should find correct EV for hindering nature (Adamant -SpA)', () => {
      // Bulbasaur base SpA=65, Adamant, 10 SPs
      // Champions: floor(floor((161*50/100)+5+10)*0.9) = floor(95*0.9) = 85
      const evs = spToEV(
        { hp: 0, atk: 10, def: 0, spa: 10, spd: 0, spe: 0 },
        { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
        'Adamant'
      )

      const gen = Generations.get(9)
      const poke = new Pokemon(gen, 'Bulbasaur', {
        level: 50,
        nature: 'Adamant',
        evs,
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 }
      })
      expect(poke.stats.spa).toBe(85)
    })

    it('should work for HP (nature does not affect HP)', () => {
      const evs = spToEV(
        { hp: 32, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        { hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80 },
        'Adamant' // nature irrelevant for HP
      )

      const gen = Generations.get(9)
      const poke = new Pokemon(gen, 'Venusaur', {
        level: 50,
        nature: 'Adamant',
        evs,
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 }
      })
      // Champions HP: floor((2*80+31+100)*50/100)+10+32 = floor(145.5)+10+32 = 187
      expect(poke.stats.hp).toBe(187)
    })

    it('should produce EV=0 when SP=0 for any nature', () => {
      const evs = spToEV(
        { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        { hp: 80, atk: 100, def: 90, spa: 120, spd: 80, spe: 110 },
        'Modest'
      )
      expect(evs.atk).toBe(0)
      expect(evs.spa).toBe(0)
      expect(evs.hp).toBe(0)
    })
  })

  it('getNatureEffect should return correct effect', () => {
    expect(getNatureEffect('atk', 'Adamant')).toBe('boosted')
    expect(getNatureEffect('spa', 'Adamant')).toBe('hindered')
    expect(getNatureEffect('atk', 'Hardy')).toBe('neutral')
    expect(getNatureEffect('hp', 'Adamant')).toBe('neutral')
  })
})