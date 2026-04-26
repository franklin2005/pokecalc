import { describe, it, expect } from 'vitest'
import { getSpeciesId, getSpriteUrl } from '../species-to-id'

describe('species-to-id', () => {
  it('should return correct ID for common Gen 1 species', () => {
    expect(getSpeciesId('Bulbasaur')).toBe(1)
    expect(getSpeciesId('Charizard')).toBe(6)
    expect(getSpeciesId('Pikachu')).toBe(25)
    expect(getSpeciesId('Gengar')).toBe(94)
    expect(getSpeciesId('Mewtwo')).toBe(150)
    expect(getSpeciesId('Mew')).toBe(151)
  })

  it('should return correct ID for Gen 2-3 species', () => {
    expect(getSpeciesId('Tyranitar')).toBe(248)
    expect(getSpeciesId('Gardevoir')).toBe(282)
    expect(getSpeciesId('Salamence')).toBe(373)
    expect(getSpeciesId('Metagross')).toBe(376)
  })

  it('should return correct ID for Gen 4-5 species', () => {
    expect(getSpeciesId('Garchomp')).toBe(445)
    expect(getSpeciesId('Lucario')).toBe(448)
    expect(getSpeciesId('Hydreigon')).toBe(635)
  })

  it('should return correct ID for Gen 6-7 species', () => {
    expect(getSpeciesId('Greninja')).toBe(658)
    expect(getSpeciesId('Mimikyu')).toBe(778)
  })

  it('should return correct ID for Gen 8-9 species', () => {
    expect(getSpeciesId('Dragapult')).toBe(887)
    expect(getSpeciesId('Meowscarada')).toBe(908)
    expect(getSpeciesId('Gholdengo')).toBe(1000)
    expect(getSpeciesId('Pecharunt')).toBe(1025)
  })

  it('should handle Mega forme variants by stripping suffix', () => {
    expect(getSpeciesId('Charizard-Mega-X')).toBe(6)
    expect(getSpeciesId('Charizard-Mega-Y')).toBe(6)
    expect(getSpeciesId('Gengar-Mega')).toBe(94)
    expect(getSpeciesId('Lucario-Mega')).toBe(448)
    expect(getSpeciesId('Tyranitar-Mega')).toBe(248)
  })

  it('should handle other forme variants', () => {
    expect(getSpeciesId('Pikachu-Gmax')).toBe(25)
    expect(getSpeciesId('Eternatus-Eternamax')).toBe(890)
    expect(getSpeciesId('Zacian-Crowned')).toBe(888)
  })

  it('should return null for unknown species', () => {
    expect(getSpeciesId('NonexistentPokemon')).toBeNull()
  })

  it('getSpriteUrl should return correct URL for known species', () => {
    expect(getSpriteUrl('Pikachu')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
    )
    expect(getSpriteUrl('Charizard')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png'
    )
  })

  it('getSpriteUrl should return null for unknown species', () => {
    expect(getSpriteUrl('NonexistentPokemon')).toBeNull()
  })

  it('getSpriteUrl should handle Mega formes', () => {
    expect(getSpriteUrl('Charizard-Mega-X')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png'
    )
  })
})
