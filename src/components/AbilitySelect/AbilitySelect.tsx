/**
 * PokeCalc — AbilitySelect Component
 * Dropdown of abilities for the selected species.
 * Note: @smogon/calc only exposes the primary ability (abilities['0']).
 */

import { toID } from '@smogon/calc'
import { Generations } from '@smogon/calc'
import './AbilitySelect.css'

type Generation = ReturnType<typeof Generations.get>

interface AbilitySelectProps {
  species: string | null
  value: string | undefined
  onChange: (ability: string | undefined) => void
  gen: Generation
}

export function AbilitySelect({ species, value, onChange, gen }: AbilitySelectProps) {
  // Get abilities from species data
  // @smogon/calc only exposes primary ability in abilities['0']
  const abilities: string[] = []
  if (species) {
    const sp = gen.species.get(toID(species))
    if (sp?.abilities?.['0']) {
      abilities.push(sp.abilities['0'])
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
