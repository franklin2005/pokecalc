/**
 * PokeCalc — useLearnset Hook
 * Async hook that loads a Pokémon's learnset when a species is selected.
 * Handles loading state and caches results via the move-data layer.
 */

import { useState, useEffect } from 'react'
import { getLearnset, type LearnsetMap } from '../data/move-data'

export function useLearnset(speciesName: string | null) {
  const [learnset, setLearnset] = useState<LearnsetMap | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!speciesName) {
      setLearnset(null)
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    getLearnset(speciesName).then(ls => {
      if (!cancelled) {
        setLearnset(ls)
        setIsLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [speciesName])

  return { learnset, isLoading }
}
