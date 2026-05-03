/**
 * PokeCalc — Move Data Access Layer
 * Uses @pkmn/dex to provide move data and learnset lookups.
 * Replaces the static gen.moves iteration with real learnset filtering,
 * accuracy, PP, and move descriptions.
 */

import { ModdedDex, toID } from '@pkmn/dex'

const dex = new ModdedDex('gen9')

export { dex, toID }

export interface MoveDisplayData {
  name: string
  type: string
  category: 'Physical' | 'Special' | 'Status'
  basePower: number | null  // null for status moves
  accuracy: number | null   // null for always-hit moves
  pp: number
  desc: string
}

/**
 * Get display-ready data for a single move.
 * Returns null if the move doesn't exist in gen9.
 */
export function getMoveData(moveName: string): MoveDisplayData | null {
  const move = dex.moves.get(moveName)
  if (!move || !move.exists) return null
  return {
    name: move.name,
    type: move.type,
    category: move.category as 'Physical' | 'Special' | 'Status',
    basePower: move.basePower && move.basePower > 0 ? move.basePower : null,
    accuracy: typeof move.accuracy === 'number' ? move.accuracy : null,
    pp: move.pp,
    desc: move.shortDesc || move.desc || '',
  }
}

/** Map of move ID → list of learn methods (e.g. ["9M", "9L48"]) */
export type LearnsetMap = Record<string, string[]>

const learnsetCache = new Map<string, LearnsetMap>()

/**
 * Get the learnset for a species. Async — first call loads ~475KB of data.
 * Subsequent calls use the in-memory cache.
 *
 * For formes (Rotom-Wash, Landorus-Therian), looks up the baseSpecies
 * to get the full learnset.
 */
export async function getLearnset(speciesName: string): Promise<LearnsetMap> {
  const key = toID(speciesName)

  if (learnsetCache.has(key)) {
    return learnsetCache.get(key)!
  }

  // Handle formes: use baseSpecies for learnset lookup
  const species = dex.species.get(speciesName)
  const lookupId = species?.baseSpecies
    ? toID(species.baseSpecies)
    : key

  const result = await dex.learnsets.getByID(lookupId)
  const rawLearnset = result?.learnset || {}

  // Filter: only keep moves learnable in Gen 9 (methods starting with "9")
  const learnset: LearnsetMap = {}
  for (const [moveId, methods] of Object.entries(rawLearnset)) {
    if (Array.isArray(methods) && methods.some((m: string) => m.startsWith('9'))) {
      learnset[moveId] = methods
    }
  }

  learnsetCache.set(key, learnset)
  return learnset
}
