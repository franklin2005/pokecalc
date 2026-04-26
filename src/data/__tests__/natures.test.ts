import { describe, it, expect } from 'vitest'
import { NATURES, isNeutralNature, getNature } from '../natures'

describe('natures', () => {
  it('should have exactly 25 natures', () => {
    expect(NATURES).toHaveLength(25)
  })

  it('should have valid stat abbreviations for all natures', () => {
    const validStats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']
    for (const nature of NATURES) {
      expect(validStats).toContain(nature.plus)
      expect(validStats).toContain(nature.minus)
    }
  })

  it('should have 5 neutral natures (plus === minus)', () => {
    const neutralNatures = NATURES.filter((n) => n.plus === n.minus)
    expect(neutralNatures).toHaveLength(5)

    const neutralNames = neutralNatures.map((n) => n.name)
    expect(neutralNames).toContain('Hardy')
    expect(neutralNames).toContain('Docile')
    expect(neutralNames).toContain('Serious')
    expect(neutralNames).toContain('Bashful')
    expect(neutralNames).toContain('Quirky')
  })

  it('should have 20 modifying natures (plus !== minus)', () => {
    const modifyingNatures = NATURES.filter((n) => n.plus !== n.minus)
    expect(modifyingNatures).toHaveLength(20)
  })

  it('should include well-known natures with correct stat mods', () => {
    const adam = NATURES.find((n) => n.name === 'Adamant')
    expect(adam).toEqual({ name: 'Adamant', plus: 'atk', minus: 'spa' })

    const timid = NATURES.find((n) => n.name === 'Timid')
    expect(timid).toEqual({ name: 'Timid', plus: 'spe', minus: 'atk' })

    const modest = NATURES.find((n) => n.name === 'Modest')
    expect(modest).toEqual({ name: 'Modest', plus: 'spa', minus: 'atk' })

    const jolly = NATURES.find((n) => n.name === 'Jolly')
    expect(jolly).toEqual({ name: 'Jolly', plus: 'spe', minus: 'spa' })
  })

  it('isNeutralNature should return true for neutral natures', () => {
    expect(isNeutralNature('Hardy')).toBe(true)
    expect(isNeutralNature('Docile')).toBe(true)
    expect(isNeutralNature('Serious')).toBe(true)
    expect(isNeutralNature('Bashful')).toBe(true)
    expect(isNeutralNature('Quirky')).toBe(true)
  })

  it('isNeutralNature should return false for modifying natures', () => {
    expect(isNeutralNature('Adamant')).toBe(false)
    expect(isNeutralNature('Timid')).toBe(false)
    expect(isNeutralNature('Modest')).toBe(false)
  })

  it('isNeutralNature should return false for unknown natures', () => {
    expect(isNeutralNature('Nonexistent')).toBe(false)
  })

  it('getNature should return correct nature entry', () => {
    expect(getNature('Adamant')).toEqual({
      name: 'Adamant',
      plus: 'atk',
      minus: 'spa',
    })
    expect(getNature('Unknown')).toBeUndefined()
  })
})
