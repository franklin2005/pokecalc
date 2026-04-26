/**
 * PokeCalc — Pokemon Types
 * Type definitions only. Nature data lives in data/natures.ts.
 */

/** All 18 Pokémon type names */
export type TypeName =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Electric'
  | 'Grass'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Dark'
  | 'Steel'
  | 'Fairy'

/** Base stats from species data */
export interface BaseStats {
  hp: number
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
}

/** Pokemon data returned from calc species lookup */
export interface PokemonData {
  name: string
  types: TypeName[]
  baseStats: BaseStats
  abilities: string[]
  moves: string[]
  forme?: string
}

/** Computed final stats after EVs, IVs, nature, and level */
export interface Stats {
  hp: number
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
}
