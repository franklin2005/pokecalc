import { describe, it, expect } from 'vitest'
import { getMoveData, getLearnset } from '../move-data'

describe('move-data', () => {
  describe('getMoveData', () => {
    it('should return data for Shadow Ball', () => {
      const move = getMoveData('Shadow Ball')
      expect(move).not.toBeNull()
      expect(move!.name).toBe('Shadow Ball')
      expect(move!.type).toBe('Ghost')
      expect(move!.category).toBe('Special')
      expect(move!.basePower).toBe(80)
      expect(move!.accuracy).toBe(100)
      expect(move!.pp).toBe(15)
      expect(move!.desc.length).toBeGreaterThan(0)
    })

    it('should return null basePower for status moves (Swords Dance)', () => {
      const move = getMoveData('Swords Dance')
      expect(move).not.toBeNull()
      expect(move!.category).toBe('Status')
      expect(move!.basePower).toBeNull()
    })

    it('should return null accuracy for always-hit moves', () => {
      const move = getMoveData('Swift')
      expect(move).not.toBeNull()
      // Swift has -- accuracy in gens 1-8, 100 in gen9
      // Use Aerial Ace which is always-hit
      const aa = getMoveData('Aerial Ace')
      expect(aa).not.toBeNull()
      expect(aa!.accuracy).toBeNull()
    })

    it('should return null for non-existent move', () => {
      const move = getMoveData('NotAMove')
      expect(move).toBeNull()
    })

    it('should return Physical category for Earthquake', () => {
      const move = getMoveData('Earthquake')
      expect(move!.category).toBe('Physical')
    })
  })

  describe('getLearnset', () => {
    it('should return learnset for Venusaur', async () => {
      const learnset = await getLearnset('Venusaur')
      expect(Object.keys(learnset).length).toBeGreaterThan(0)
      // Venusaur learns Solar Beam in Gen 9
      const solarBeamKey = Object.keys(learnset).find(k => k.includes('solarbeam'))
      expect(solarBeamKey).toBeDefined()
    })

    it('should only include moves learnable in Gen 9', async () => {
      const learnset = await getLearnset('Venusaur')
      // Each move in the learnset should have at least one Gen 9 method
      for (const methods of Object.values(learnset)) {
        if (Array.isArray(methods)) {
          const hasGen9 = methods.some((m: string) => m.startsWith('9'))
          expect(hasGen9).toBe(true)
        }
      }
    })

    it('should NOT include legacy-only moves for Blastoise', async () => {
      const learnset = await getLearnset('Blastoise')
      // Fissure was Gen 1 TM only — should NOT appear
      const fissureKeys = Object.keys(learnset).filter(k => k.includes('fissure'))
      expect(fissureKeys.length).toBe(0)
    })

    it('should cache learnsets (second call is sync)', async () => {
      await getLearnset('Venusaur')
      const start = Date.now()
      const learnset = await getLearnset('Venusaur')
      const elapsed = Date.now() - start
      expect(Object.keys(learnset).length).toBeGreaterThan(0)
      expect(elapsed).toBeLessThan(50) // cached, should be <50ms
    })

    it('should handle formes via baseSpecies', async () => {
      const learnset = await getLearnset('Rotom-Wash')
      // Rotom-Wash should have Rotom's learnset (Electro Ball, Thunder, etc.)
      expect(Object.keys(learnset).length).toBeGreaterThan(10)
      const thunderKey = Object.keys(learnset).find(k => k.includes('thunder') && !k.includes('thunderbolt') && !k.includes('thunderpunch'))
      expect(thunderKey).toBeDefined()
    })
  })
})
