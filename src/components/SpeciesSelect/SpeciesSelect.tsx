/**
 * PokeCalc — SpeciesSelect Component
 * Text input with search/autocomplete for Pokémon species selection.
 * Supports forme selection for Mega Evolutions.
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
 */
function getFormes(species: Specie): string[] {
  if (!species.otherFormes) return []

  const formes: string[] = []
  const baseName = species.name

  for (const formeName of species.otherFormes) {
    // Only include Mega forms for Champions
    if (formeName.includes('Mega')) {
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
  const [selectedForme, setSelectedForme] = useState<string | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Build species list from gen (cache in ref)
  const speciesList = useRef<Specie[]>([])
  if (speciesList.current.length === 0) {
    for (const sp of gen.species) {
      if (sp) speciesList.current.push(sp)
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
    setSelectedForme(null)
    onChange(speciesName, null)
  }, [onChange])

  const handleFormeChange = useCallback((forme: string) => {
    if (!value) return
    setSelectedForme(forme || null)
    onChange(value, forme || null)
  }, [value, onChange])

  // Get selected species for forme display
  const selectedSpecies = value ? gen.species.get(toID(value)) : null
  const availableFormes = selectedSpecies ? getFormes(selectedSpecies) : []

  // Get sprite URL
  const displaySpecies = selectedForme && value ? `${value}-${selectedForme}` : value
  const spriteUrl = displaySpecies ? getSpriteUrl(displaySpecies) : null

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
              setSelectedForme(null)
            }
          }}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
        {spriteUrl && (
          <img
            className="species-select__sprite"
            src={spriteUrl}
            alt={displaySpecies || ''}
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

      {availableFormes.length > 0 && (
        <div className="species-select__forme">
          <label className="species-select__forme-label">Forme</label>
          <div className="species-select__forme-options">
            <button
              className={`species-select__forme-btn ${!selectedForme ? 'species-select__forme-btn--active' : ''}`}
              type="button"
              onClick={() => handleFormeChange('')}
            >
              Base
            </button>
            {availableFormes.map((forme) => (
              <button
                key={forme}
                className={`species-select__forme-btn ${selectedForme === forme ? 'species-select__forme-btn--active' : ''}`}
                type="button"
                onClick={() => handleFormeChange(forme)}
              >
                {forme}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
