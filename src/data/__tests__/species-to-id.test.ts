import { describe, it, expect } from 'vitest'
import { getSpeciesId, getSpriteUrl } from '../species-to-id'

describe('species-to-id', () => {
  describe('getSpeciesId', () => {
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

    it('should fall back to base species for unknown formes', () => {
      expect(getSpeciesId('Pikachu-Gmax')).toBe(25)
      expect(getSpeciesId('Zacian-Crowned')).toBe(888)
    })

    it('should return null for unknown species', () => {
      expect(getSpeciesId('NonexistentPokemon')).toBeNull()
    })
  })

  describe('getSpriteUrl', () => {
    it('should return Showdown HOME sprite URL for base species', () => {
      expect(getSpriteUrl('Charizard')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/charizard.png'
      )
      expect(getSpriteUrl('Pikachu')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/pikachu.png'
      )
      expect(getSpriteUrl('Gengar')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/gengar.png'
      )
    })

    it('should return correct URL for Mega forms with Showdown naming', () => {
      // Mega-X/Y: no hyphen between "mega" and "x"/"y"
      expect(getSpriteUrl('Charizard-Mega-X')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/charizard-megax.png'
      )
      expect(getSpriteUrl('Charizard-Mega-Y')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/charizard-megay.png'
      )
      expect(getSpriteUrl('Mewtwo-Mega-X')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/mewtwo-megax.png'
      )
      expect(getSpriteUrl('Mewtwo-Mega-Y')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/mewtwo-megay.png'
      )
      // Simple Mega: hyphen stays
      expect(getSpriteUrl('Gengar-Mega')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/gengar-mega.png'
      )
      expect(getSpriteUrl('Lucario-Mega')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/lucario-mega.png'
      )
    })

    it('should return correct URL for ZA_PATCH Champions Megas', () => {
      expect(getSpriteUrl('Dragonite-Mega')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/dragonite-mega.png'
      )
      expect(getSpriteUrl('Greninja-Mega')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/greninja-mega.png'
      )
      expect(getSpriteUrl('Chandelure-Mega')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/chandelure-mega.png'
      )
    })

    it('should return correct URL for Primal forms', () => {
      expect(getSpriteUrl('Groudon-Primal')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/groudon-primal.png'
      )
      expect(getSpriteUrl('Kyogre-Primal')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/kyogre-primal.png'
      )
    })

    it('should return null for empty input', () => {
      expect(getSpriteUrl('')).toBeNull()
    })

    it('should handle hyphenated species names', () => {
      expect(getSpriteUrl('Mr-Mime')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/mr-mime.png'
      )
      expect(getSpriteUrl('Tapu-Koko')).toBe(
        'https://play.pokemonshowdown.com/sprites/home/tapu-koko.png'
      )
    })
  })
})