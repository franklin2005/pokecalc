import { describe, it, expect } from 'vitest'
import { TYPE_COLORS, ALL_TYPES, getTypeColor } from '../type-colors'

describe('type-colors', () => {
  it('should have entries for all 18 types', () => {
    const expectedTypes = [
      'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice',
      'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
      'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy',
    ]
    for (const type of expectedTypes) {
      expect(TYPE_COLORS[type as keyof typeof TYPE_COLORS]).toBeDefined()
    }
  })

  it('should have bg and text for each type', () => {
    for (const type of ALL_TYPES) {
      const color = TYPE_COLORS[type]
      expect(color.bg).toBeDefined()
      expect(color.text).toBeDefined()
      expect(typeof color.bg).toBe('string')
      expect(typeof color.text).toBe('string')
      expect(color.bg.length).toBeGreaterThan(0)
      expect(color.text.length).toBeGreaterThan(0)
    }
  })

  it('should have valid color formats (hex or rgba)', () => {
    const colorRegex = /^(#[0-9a-fA-F]{3,8}|rgba?\()/
    for (const type of ALL_TYPES) {
      const color = TYPE_COLORS[type]
      expect(color.text).toMatch(colorRegex)
      expect(color.bg).toMatch(colorRegex)
    }
  })

  it('ALL_TYPES should contain exactly 18 types', () => {
    expect(ALL_TYPES).toHaveLength(18)
  })

  it('getTypeColor should return Normal for unknown types', () => {
    const unknown = getTypeColor('UnknownType')
    expect(unknown).toEqual(TYPE_COLORS.Normal)
  })

  it('getTypeColor should return correct color for known types', () => {
    expect(getTypeColor('Fire')).toEqual(TYPE_COLORS.Fire)
    expect(getTypeColor('Water')).toEqual(TYPE_COLORS.Water)
    expect(getTypeColor('Dragon')).toEqual(TYPE_COLORS.Dragon)
  })
})
