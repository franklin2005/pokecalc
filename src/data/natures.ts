/**
 * PokeCalc — Natures
 * All 25 Pokémon natures with their stat modifications.
 * Neutral natures have plus === minus (no net stat change).
 * Stat abbreviations match @smogon/calc's StatID type.
 */

import type { StatName } from '../types/calc'

export interface NatureEntry {
  name: string
  plus: StatName | null
  minus: StatName | null
}

/**
 * All 25 natures.
 * Neutral natures (Hardy, Docile, Serious, Bashful, Quirky) have
 * plus === minus, meaning they don't modify any stat.
 */
export const NATURES: NatureEntry[] = [
  // Neutral natures (plus === minus, no net effect)
  { name: 'Hardy', plus: 'atk', minus: 'atk' },
  { name: 'Docile', plus: 'def', minus: 'def' },
  { name: 'Serious', plus: 'spe', minus: 'spe' },
  { name: 'Bashful', plus: 'spa', minus: 'spa' },
  { name: 'Quirky', plus: 'spd', minus: 'spd' },

  // +Atk natures
  { name: 'Lonely', plus: 'atk', minus: 'def' },
  { name: 'Adamant', plus: 'atk', minus: 'spa' },
  { name: 'Naughty', plus: 'atk', minus: 'spd' },
  { name: 'Brave', plus: 'atk', minus: 'spe' },

  // +Def natures
  { name: 'Bold', plus: 'def', minus: 'atk' },
  { name: 'Impish', plus: 'def', minus: 'spa' },
  { name: 'Lax', plus: 'def', minus: 'spd' },
  { name: 'Relaxed', plus: 'def', minus: 'spe' },

  // +SpA natures
  { name: 'Modest', plus: 'spa', minus: 'atk' },
  { name: 'Mild', plus: 'spa', minus: 'def' },
  { name: 'Rash', plus: 'spa', minus: 'spd' },
  { name: 'Quiet', plus: 'spa', minus: 'spe' },

  // +SpD natures
  { name: 'Calm', plus: 'spd', minus: 'atk' },
  { name: 'Gentle', plus: 'spd', minus: 'def' },
  { name: 'Careful', plus: 'spd', minus: 'spa' },
  { name: 'Sassy', plus: 'spd', minus: 'spe' },

  // +Spe natures
  { name: 'Timid', plus: 'spe', minus: 'atk' },
  { name: 'Hasty', plus: 'spe', minus: 'def' },
  { name: 'Jolly', plus: 'spe', minus: 'spa' },
  { name: 'Naive', plus: 'spe', minus: 'spd' },
]

/**
 * Check if a nature is neutral (no stat modification).
 */
export function isNeutralNature(natureName: string): boolean {
  const nature = NATURES.find((n) => n.name === natureName)
  if (!nature) return false
  return nature.plus === nature.minus
}

/**
 * Get a nature entry by name.
 */
export function getNature(name: string): NatureEntry | undefined {
  return NATURES.find((n) => n.name === name)
}
