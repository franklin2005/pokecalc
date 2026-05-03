import { describe, it, expect } from 'vitest'
import { getSpeciesAbilities } from '../species-abilities'

describe('species-abilities', () => {
  it('should return abilities for Venusaur (Overgrow + Chlorophyll)', () => {
    const abs = getSpeciesAbilities('venusaur')
    expect(abs).toContain('Overgrow')
    expect(abs).toContain('Chlorophyll')
    expect(abs.length).toBeGreaterThanOrEqual(2)
  })

  it('should return abilities for Charizard (Blaze + Solar Power)', () => {
    const abs = getSpeciesAbilities('charizard')
    expect(abs).toContain('Blaze')
    expect(abs).toContain('Solar Power')
    expect(abs.length).toBeGreaterThanOrEqual(2)
  })

  it('should return abilities for Greninja (Torrent + Protean)', () => {
    const abs = getSpeciesAbilities('greninja')
    expect(abs).toContain('Torrent')
    expect(abs).toContain('Protean')
    expect(abs.length).toBeGreaterThanOrEqual(2)
  })

  it('should return at least 1 ability for any valid species', () => {
    const abs = getSpeciesAbilities('gengar')
    expect(abs.length).toBeGreaterThanOrEqual(1)
  })

  it('should return empty array for invalid species', () => {
    const abs = getSpeciesAbilities('notapokemon')
    expect(abs).toEqual([])
  })

  it('should return empty array for empty string', () => {
    const abs = getSpeciesAbilities('')
    expect(abs).toEqual([])
  })
})
