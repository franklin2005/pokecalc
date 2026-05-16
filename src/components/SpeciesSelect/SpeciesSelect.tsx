/**
 * PokeCalc — SpeciesSelect Component
 * Text input with search/autocomplete for Pokémon species selection.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Generations, toID } from '@smogon/calc'
import { getSpriteUrl } from '../../data/species-to-id'
import './SpeciesSelect.css'

type Generation = ReturnType<typeof Generations.get>
type Specie = NonNullable<ReturnType<Generation['species']['get']>>

interface SpeciesSelectProps {
  value: string | null
  onChange: (species: string | null, forme: string | null) => void
  gen: Generation
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
    // Only include Mega forms for Champions, excluding Mega-Z (not yet in game)
    if (formeName.includes('Mega') && !formeName.includes('Mega-Z')) {
      const suffix = formeName.replace(`${baseName}-`, '')
      if (suffix) {
        formes.push(suffix)
      }
    }
  }

  return formes
}

export function SpeciesSelect({ value, onChange, gen }: SpeciesSelectProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Build species list from gen (cache in ref)
  const speciesList = useRef<Specie[]>([])
  if (speciesList.current.length === 0) {
    for (const sp of gen.species) {
      // Exclude Mega-Z formes not yet available in Pokémon Champions
      if (sp && !sp.name.includes('-Mega-Z')) {
        speciesList.current.push(sp)
      }
    }
  }

  // Filter species by query
  const filtered = useMemo(() => {
    if (query.length === 0) return []
    const lower = query.toLowerCase()
    return speciesList.current
      .filter((sp) => sp.name.toLowerCase().includes(lower))
      .slice(0, 10)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = useCallback((speciesName: string) => {
    setQuery(speciesName)
    setIsOpen(false)
    onChange(speciesName, null)
  }, [onChange])

  // Get selected species for sprite display
  const selectedSpecies = value ? gen.species.get(toID(value)) : null

  // Get sprite URL (base species only — forme sprites handled by CalcCard)
  const spriteUrl = value ? getSpriteUrl(value) : null

  // Sync query with value
  useEffect(() => {
    if (value && !isOpen) {
      setQuery(value)
    }
  }, [value, isOpen])

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
            setIsOpen(true)
            if (!e.target.value) {
              onChange(null, null)
            }
          }}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
        {spriteUrl && selectedSpecies && (
          <img
            className="species-select__sprite"
            src={spriteUrl}
            alt={selectedSpecies.name}
            loading="lazy"
          />
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <ul className="species-select__dropdown" role="listbox">
          {filtered.map((sp) => (
            <li
              key={sp.name}
              className={`species-select__option ${sp.name === value ? 'species-select__option--selected' : ''}`}
              role="option"
              aria-selected={sp.name === value}
              onClick={() => handleSelect(sp.name)}
            >
              <span className="species-select__option-name">{sp.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
