/**
 * PokeCalc — AbilityList Component
 * Scrollable overlay panel showing ALL abilities a Pokémon can have.
 * Replaces the stats section when the ability input is focused.
 * No filtering — species have at most 3 abilities.
 */

import { useMemo } from 'react'
import { getAbilityDesc } from '../../data/ability-item-data'
import './AbilityList.css'

interface AbilityListProps {
  abilities: string[]
  selectedAbility: string | undefined
  onSelect: (ability: string) => void
  onClose: () => void
}

export function AbilityList({
  abilities,
  selectedAbility,
  onSelect,
  onClose,
}: AbilityListProps) {
  // Sort alphabetically — always show all
  const sorted = useMemo(
    () => [...abilities].sort((a, b) => a.localeCompare(b)),
    [abilities]
  )

  // Handle Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className="ability-list"
      role="dialog"
      aria-label="Ability selection"
      onKeyDown={handleKeyDown}
    >
      <div className="ability-list__header">
        <span className="ability-list__title">Select Ability</span>
        <button
          className="ability-list__close"
          type="button"
          onClick={onClose}
          aria-label="Close ability list"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="ability-list__scroll">
        {sorted.map((name) => {
          const desc = getAbilityDesc(name)
          return (
            <li
              key={name}
              className={`ability-list__item${name === selectedAbility ? ' ability-list__item--selected' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault()
                onSelect(name)
              }}
            >
              <span className="ability-list__item-name">{name}</span>
              {desc && <span className="ability-list__item-desc">{desc}</span>}
            </li>
          )
        })}
      </div>

      {sorted.length === 0 && (
        <p className="ability-list__empty">No abilities available</p>
      )}
    </div>
  )
}
