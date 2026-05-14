import { toID } from '@smogon/calc'
import gen9Sets from './gen9-sets.json'

/**
 * Returns up to 4 competitive moves for a Pokémon species
 * from Pokémon Showdown's gen9 random battle sets.
 *
 * Resolution chain:
 * 1. toID(speciesName) → direct lookup in sets.json
 * 2. If not found and name contains '-', strip suffix → base species lookup
 * 3. Return null if no match found
 *
 * Returns null if the species is not found in the set database.
 */
export function getDefaultMoves(speciesName: string): string[] | null {
  const id = toID(speciesName)

  // Look up the species in sets.json (keys are already toID'd)
  const data = (gen9Sets as Record<string, { sets?: Array<{ movepool?: string[] }> } | undefined>)[id]
  if (data?.sets?.[0]?.movepool && data.sets[0].movepool.length > 0) {
    // Return the first 4 moves from the first set's movepool
    return data.sets[0].movepool.slice(0, 4)
  }

  // If species has a forme suffix (e.g., "Venusaur-Mega"), try the base species
  if (speciesName.includes('-')) {
    const baseName = speciesName.split('-')[0]
    return getDefaultMoves(baseName)
  }

  return null
}
