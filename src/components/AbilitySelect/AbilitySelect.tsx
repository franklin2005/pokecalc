/**
 * PokeCalc — AbilitySelect Component
 * Text input that signals focus to CalcCard to open the AbilityList overlay.
 * The input is fully controlled by CalcCard via query/onQueryChange props.
 * The toggle button shows/hides the overlay (mimicking NatureSelect pattern).
 *
 * Uses SPECIES_ABILITIES from our static data (generated from PokeAPI)
 * because @smogon/calc only stores the primary ability per species.
 * Falls back to calc's abilities if species not found in our mapping.
 */

import { useMemo } from 'react'
import { toID } from '@smogon/calc'
import { Generations } from '@smogon/calc'
import { getSpeciesAbilities } from '../../data/species-abilities'
import './AbilitySelect.css'

type Generation = ReturnType<typeof Generations.get>

interface AbilitySelectProps {
  species: string | null
  value: string | undefined
  onChange: (ability: string | undefined) => void
  onFocus: () => void
  onToggle: () => void
  isOpen: boolean
  query: string
  onQueryChange: (q: string) => void
  gen: Generation
}

export function AbilitySelect({
  species,
  value,
  onChange,
  onFocus,
  onToggle,
  isOpen,
  query,
  onQueryChange,
  gen,
}: AbilitySelectProps) {
  // Get abilities list for the selected species
  const abilitiesList = useMemo(() => {
    if (!species) return []

    const speciesId = toID(species)

    // First try our comprehensive mapping from PokeAPI
    const mapped = getSpeciesAbilities(speciesId)
    if (mapped.length > 0) return mapped

    // Fallback: if not in our mapping, try calc's abilities
    const sp = gen.species.get(speciesId)
    if (sp?.abilities?.['0']) {
      return [sp.abilities['0']]
    }

    return []
  }, [species, gen])

  const isDisabled = !species || abilitiesList.length === 0

  return (
    <div className="ability-select">
      <label className="ability-select__label" htmlFor="ability-select">
        Ability
      </label>
      <div className="ability-select__wrapper">
        <input
          className="ability-select__input"
          id="ability-select"
          type="text"
          placeholder={isDisabled ? 'Select a species first' : 'Search abilities...'}
          value={isDisabled ? '' : (query.length > 0 ? query : (value || ''))}
          disabled={isDisabled}
          onChange={(e) => {
            onQueryChange(e.target.value)
            if (!e.target.value) {
              onChange(undefined)
            }
          }}
          onFocus={() => {
            if (!isDisabled) {
              onFocus()
            }
          }}
          autoComplete="off"
        />
        {isDisabled ? (
          <span className="ability-select__icon material-symbols-outlined">
            lock
          </span>
        ) : (
          <button
            type="button"
            className={`ability-select__toggle${isOpen ? ' ability-select__toggle--open' : ''}`}
            aria-label={isOpen ? 'Hide ability list' : 'Show ability list'}
            aria-expanded={isOpen ? 'true' : 'false'}
            onMouseDown={(e) => {
              e.preventDefault()
            }}
            onClick={onToggle}
          >
            <span className="ability-select__icon material-symbols-outlined" aria-hidden>
              expand_more
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
