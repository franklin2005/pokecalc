/**
 * PokeCalc — useSpeciesData Hook
 * Provides species search functionality using Generations.get(9).species.
 */

import { useMemo, useCallback } from 'react'
import { toID } from '@smogon/calc'
import type { Generations } from '@smogon/calc'
import { getSpeciesId } from '../data/species-to-id'

type Generation = ReturnType<typeof Generations.get>
type SpeciesEntry = { name: string; id: number }

const MAX_SEARCH_RESULTS = 10

export function useSpeciesData(gen: Generation) {
  // Build a memoized list of all species
  const speciesList = useMemo<SpeciesEntry[]>(() => {
    const list: SpeciesEntry[] = []
    for (const sp of gen.species) {
      if (sp) {
        const id = getSpeciesId(sp.name)
        if (id !== null) {
          list.push({ name: sp.name, id })
        }
      }
    }
    return list
  }, [gen])

  // Search species by name substring (case-insensitive)
  const searchSpecies = useCallback(
    (query: string): SpeciesEntry[] => {
      if (!query || query.length === 0) return []
      const lower = query.toLowerCase()
      return speciesList
        .filter((sp) => sp.name.toLowerCase().includes(lower))
        .slice(0, MAX_SEARCH_RESULTS)
    },
    [speciesList]
  )

  // Get full Species object by name
  const getSpecies = useCallback(
    (name: string) => {
      return gen.species.get(toID(name))
    },
    [gen]
  )

  return { speciesList, searchSpecies, getSpecies }
}
