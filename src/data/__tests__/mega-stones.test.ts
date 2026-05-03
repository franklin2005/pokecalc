import { describe, it, expect } from 'vitest'
import { getMegaStone, MEGA_STONE_MAP } from '../mega-stones'

describe('mega-stones', () => {
  it('should export a non-empty map', () => {
    expect(Object.keys(MEGA_STONE_MAP).length).toBeGreaterThan(0)
  })

  it('should return correct stone for Charizard-Mega-X', () => {
    expect(getMegaStone('Charizard', 'Mega-X')).toBe('Charizardite X')
  })

  it('should return correct stone for Charizard-Mega-Y', () => {
    expect(getMegaStone('Charizard', 'Mega-Y')).toBe('Charizardite Y')
  })

  it('should return correct stone for Venusaur-Mega', () => {
    expect(getMegaStone('Venusaur', 'Mega')).toBe('Venusaurite')
  })

  it('should return undefined for Rayquaza (no mega stone)', () => {
    expect(getMegaStone('Rayquaza', 'Mega')).toBeUndefined()
  })

  it('should return undefined for non-mega species', () => {
    expect(getMegaStone('Pikachu', 'Mega')).toBeUndefined()
  })

  it('MEGA_STONE_MAP should include Mewtwo-Mega-X and Y', () => {
    expect(MEGA_STONE_MAP['Mewtwo-Mega-X']).toBe('Mewtwonite X')
    expect(MEGA_STONE_MAP['Mewtwo-Mega-Y']).toBe('Mewtwonite Y')
  })
})
