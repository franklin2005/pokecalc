/**
 * PokeCalc — AbilitySelect Component
 * Dropdown of abilities for the selected species.
 *
 * Uses SPECIES_ABILITIES from our static data (generated from PokeAPI)
 * because @smogon/calc only stores the primary ability per species.
 * Falls back to calc's abilities if species not found in our mapping.
 */

import { toID } from '@smogon/calc'
import { Generations } from '@smogon/calc'
import { getSpeciesAbilities } from '../../data/species-abilities'
import './AbilitySelect.css'

type Generation = ReturnType<typeof Generations.get>

interface AbilitySelectProps {
  species: string | null
  value: string | undefined
  onChange: (ability: string | undefined) => void
  gen: Generation
}

export function AbilitySelect({ species, value, onChange, gen }: AbilitySelectProps) {
  // Get abilities from our static mapping (has primary, secondary, hidden)
  let abilities: string[] = []

  if (species) {
    const speciesId = toID(species)

    // First try our comprehensive mapping from PokeAPI
    abilities = getSpeciesAbilities(speciesId)

    // Fallback: if not in our mapping, try calc's abilities
    // (calc only has primary ability, but better than nothing)
    if (abilities.length === 0) {
      const sp = gen.species.get(speciesId)
      if (sp?.abilities?.['0']) {
        abilities = [sp.abilities['0']]
      }
    }
  }

  const isDisabled = !species || abilities.length === 0

  return (
    <div className="ability-select">
      <label className="ability-select__label" htmlFor="ability-select">
        Ability
      </label>
      <div className="ability-select__wrapper">
        <select
          className="ability-select__select"
          id="ability-select"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || undefined)}
          disabled={isDisabled}
        >
          {isDisabled ? (
            <option value="">Select a species first</option>
          ) : (
            abilities.map((ability) => (
              <option key={ability} value={ability}>
                {ability}
              </option>
            ))
          )}
        </select>
        <span className="ability-select__icon material-symbols-outlined">
          expand_more
        </span>
      </div>
    </div>
  )
}
