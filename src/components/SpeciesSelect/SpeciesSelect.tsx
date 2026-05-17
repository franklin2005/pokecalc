/**
 * PokeCalc — SpeciesSelect Component
 * Text input with search/autocomplete for Pokémon species selection.
 */

import { useState, useRef, useEffect, useMemo } from 'react'
import { Generations, toID } from '@smogon/calc'
import { getSpriteUrl, getDexSpriteUrl } from '../../data/species-to-id'
import './SpeciesSelect.css'

type Generation = ReturnType<typeof Generations.get>
type Specie = NonNullable<ReturnType<Generation['species']['get']>>

interface SpeciesSelectProps {
  value: string | null
  onChange: (species: string | null, forme: string | null) => void
  gen: Generation
  onOverlayOpen: () => void
  onOverlayClose: () => void
  onFilteredChange: (species: Specie[]) => void
  isOverlayOpen: boolean
}

/**
 * Get forme variants for a species.
 * Checks species.otherFormes and filters to Champions-relevant forms (Mega).
 * Exported for use by CalcCard to compute available Mega formes.
 */
export function getFormes(species: Specie): string[] {
  if (!species.otherFormes) return []

  const formes: string[] = []
  const baseName = species.name

  for (const formeName of species.otherFormes) {
    // Only include Mega forms for Champions, excluding Mega-Z and Staraptor-Mega (not yet in game)
    if (formeName.includes('Mega') && !formeName.includes('Mega-Z') && formeName !== 'Staraptor-Mega') {
      const suffix = formeName.replace(`${baseName}-`, '')
      if (suffix) {
        formes.push(suffix)
      }
    }
  }

  return formes
}

export function SpeciesSelect({
  value,
  onChange,
  gen,
  onOverlayOpen,
  onOverlayClose,
  onFilteredChange,
  isOverlayOpen,
}: SpeciesSelectProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [spriteStage, setSpriteStage] = useState<'home' | 'dex' | 'none'>('home')
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Build species list from gen (cache in ref)
  const speciesList = useRef<Specie[]>([])
  if (speciesList.current.length === 0) {
    for (const sp of gen.species) {
      // Exclude Mega-Z formes and Staraptor-Mega (not yet available in Pokémon Champions)
      if (sp && !sp.name.includes('-Mega-Z') && sp.name !== 'Staraptor-Mega') {
        speciesList.current.push(sp)
      }
    }
  }

  // Filter species by query — return all when empty, filter when typing
  const filtered = useMemo(() => {
    if (query.length === 0) {
      return speciesList.current.slice(0, 50)
    }
    const lower = query.toLowerCase()
    return speciesList.current
      .filter((sp) => sp.name.toLowerCase().includes(lower))
      .slice(0, 10)
  }, [query])

  // Notify CalcCard when filtered results change
  useEffect(() => {
    onFilteredChange(filtered)
  }, [filtered, onFilteredChange])

  // Close overlay on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        onOverlayClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onOverlayClose])

  // Get selected species for sprite display
  const selectedSpecies = value ? gen.species.get(toID(value)) : null

  // Get sprite URLs with DEX fallback
  const spriteUrl = value ? getSpriteUrl(value) : null
  const dexSpriteUrl = value ? getDexSpriteUrl(value) : null

  // Sync query with value
  useEffect(() => {
    if (value && !isOpen) {
      setQuery(value)
    }
  }, [value, isOpen])

  // Sync isOpen with parent overlay state (CalcCard closes overlay on select/Escape)
  useEffect(() => {
    if (!isOverlayOpen && isOpen) {
      setIsOpen(false)
    }
  }, [isOverlayOpen, isOpen])

  return (
    <div className="species-select" ref={wrapperRef}>
      <div className="species-select__input-wrapper">
        <input
          className="species-select__input"
          type="text"
          placeholder="Search Pokémon..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!isOpen) {
              setIsOpen(true)
              onOverlayOpen()
            }
          }}
          onFocus={() => {
            setIsOpen(true)
            onOverlayOpen()
          }}
          autoComplete="off"
        />
        {spriteUrl && selectedSpecies && spriteStage !== 'none' && (
          <img
            className="species-select__sprite"
            src={spriteStage === 'dex' && dexSpriteUrl ? dexSpriteUrl : spriteUrl}
            alt={selectedSpecies.name}
            loading="lazy"
            onError={() => setSpriteStage((prev) => prev === 'home' ? 'dex' : 'none')}
          />
        )}
      </div>
    </div>
  )
}
