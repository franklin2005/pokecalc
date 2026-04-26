/**
 * PokeCalc — MoveSelect Component
 * Dropdown of moves with search/autocomplete.
 * Uses gen.moves for the full move list.
 */

import { useState, useMemo } from 'react'
import { Generations } from '@smogon/calc'
import './MoveSelect.css'

type Generation = ReturnType<typeof Generations.get>

interface MoveSelectProps {
  species: string | null
  value: string | null
  onChange: (move: string | null) => void
  gen: Generation
}

export function MoveSelect({ species, value, onChange, gen }: MoveSelectProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Build move list from gen.moves
  const allMoves = useMemo(() => {
    const moves: string[] = []
    for (const move of gen.moves) {
      moves.push(move.name)
    }
    return moves.sort()
  }, [gen])

  const filtered = query.length > 0
    ? allMoves.filter((m) => m.toLowerCase().includes(query.toLowerCase())).slice(0, 20)
    : []

  const isDisabled = !species

  return (
    <div className="move-select">
      <label className="move-select__label" htmlFor="move-select">
        Move
      </label>
      <div className="move-select__wrapper">
        <input
          className="move-select__input"
          id="move-select"
          type="text"
          placeholder={isDisabled ? 'Select a species first' : 'Search moves...'}
          value={value ?? query}
          disabled={isDisabled}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            if (!e.target.value) {
              onChange(null)
            }
          }}
          onFocus={() => !isDisabled && setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 150)
          }}
          autoComplete="off"
        />
        <span className="move-select__icon material-symbols-outlined">
          expand_more
        </span>
      </div>

      {isOpen && filtered.length > 0 && !isDisabled && (
        <ul className="move-select__dropdown" role="listbox">
          {filtered.map((move) => (
            <li
              key={move}
              className={`move-select__option ${move === value ? 'move-select__option--selected' : ''}`}
              role="option"
              aria-selected={move === value}
              onMouseDown={(e) => {
                e.preventDefault()
                onChange(move)
                setIsOpen(false)
              }}
            >
              {move}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
