/**
 * PokeCalc — MoveSlot Component
 * Inline move search+select with pokeball radio button for activation.
 * Replaces the old MoveSelect dropdown with a compact slot-based UI.
 */

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Generations } from '@smogon/calc'
import type { TypeName } from '../../types/pokemon'
import { TYPE_COLORS } from '../../data/type-colors'
import { getMoveData, type MoveDisplayData } from '../../data/move-data'
import './MoveSlot.css'

type Generation = ReturnType<typeof Generations.get>

const CATEGORY_LABELS: Record<string, string> = {
  Physical: 'PHY',
  Special: 'SPE',
  Status: 'STA',
}

interface MoveSlotProps {
  /** 0-3, which move slot this is */
  index: number
  /** Current move name (empty string = no move) */
  value: string
  /** Whether this slot's move is the active one for damage calc */
  isActive: boolean
  /** Called when move name changes */
  onMoveChange: (index: number, moveName: string) => void
  /** Called when pokeball is clicked */
  onActivate: (index: number) => void
  /** Called when input receives focus — triggers MoveList overlay */
  onSlotFocus?: (index: number) => void
  /** Called on every keystroke — used to update MoveList search query */
  onInputChange?: (index: number, value: string) => void
  /** When true, suppress the internal dropdown (MoveList overlay is active) */
  suppressDropdown?: boolean
  /** Learnset map for move filtering (from @pkmn/dex) */
  learnset?: Record<string, string[]> | null
  /** @smogon/calc Generation for move data */
  gen: Generation
}

export function MoveSlot({ index, value, isActive, onMoveChange, onActivate, onSlotFocus, onInputChange, suppressDropdown, learnset, gen }: MoveSlotProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Build move list from move-data via learnset (cache in ref)
  const movesList = useRef<MoveDisplayData[]>([])
  const prevLearnset = useRef<Record<string, string[]> | null | undefined>(null)
  if (learnset !== prevLearnset.current) {
    prevLearnset.current = learnset
    movesList.current = []
    if (learnset) {
      for (const moveId of Object.keys(learnset)) {
        const moveData = getMoveData(moveId)
        if (moveData) movesList.current.push(moveData)
      }
    }
  }

  // Filter moves by query
  const filtered = useMemo(() => {
    if (query.length === 0) return []
    const lower = query.toLowerCase()
    return movesList.current
      .filter((m) => m.name.toLowerCase().includes(lower))
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

  // Sync query with value when not focused
  useEffect(() => {
    if (value && !isOpen) {
      setQuery(value)
    }
  }, [value, isOpen])

  const handleSelect = useCallback((moveName: string) => {
    setQuery(moveName)
    setIsOpen(false)
    onMoveChange(index, moveName)
  }, [index, onMoveChange])

  const handleClear = useCallback(() => {
    setQuery('')
    setIsOpen(false)
    onMoveChange(index, '')
  }, [index, onMoveChange])

  // Get move data for display
  const selectedMove = value ? gen.moves.get(value.toLowerCase().replace(/[^a-z0-9]/g, '') as any) : null
  const selectedType = selectedMove?.type as TypeName | undefined
  const typeColor = selectedType ? TYPE_COLORS[selectedType] ?? TYPE_COLORS.Normal : null

  const placeholder = `Move ${index + 1}`

  return (
    <div className="move-slot" ref={wrapperRef}>
      {/* Pokeball radio button */}
      <input
        className="move-slot__radio"
        type="radio"
        name="active-move"
        id={`move-radio-${index}`}
        checked={isActive}
        onChange={() => onActivate(index)}
      />
      <label
        className="move-slot__pokeball"
        htmlFor={`move-radio-${index}`}
        aria-label={`Activate move slot ${index + 1}`}
      >
        <span className="move-slot__pokeball-top" />
        <span className="move-slot__pokeball-line" />
        <span className="move-slot__pokeball-button" />
        <span className="move-slot__pokeball-bottom" />
      </label>

      {/* Move input */}
      <div className="move-slot__input-wrapper">
        {selectedType && typeColor && (
          <span
            className="move-slot__type-indicator"
            style={{ backgroundColor: typeColor.bg }}
            title={selectedType}
          />
        )}
        <input
          className="move-slot__input"
          type="text"
          placeholder={placeholder}
            value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!suppressDropdown) {
              setIsOpen(true)
            }
            if (onInputChange) {
              onInputChange(index, e.target.value)
            }
            if (!e.target.value) {
              handleClear()
            }
          }}
          onFocus={() => {
            if (onSlotFocus) onSlotFocus(index)
            if (!suppressDropdown) {
              setIsOpen(true)
            }
            if (value) setQuery(value)
          }}
          autoComplete="off"
        />
        {value && (
          <button
            className="move-slot__clear"
            type="button"
            onClick={handleClear}
            aria-label="Clear move"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {!suppressDropdown && isOpen && filtered.length > 0 && (
        <ul className="move-slot__dropdown" role="listbox">
          {filtered.map((move) => {
            const moveType = move.type as TypeName
            const moveColor = TYPE_COLORS[moveType] ?? TYPE_COLORS.Normal
            const catLabel = CATEGORY_LABELS[move.category ?? 'Status']
            return (
              <li
                key={move.name}
                className={`move-slot__option ${move.name === value ? 'move-slot__option--selected' : ''}`}
                role="option"
                aria-selected={move.name === value}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelect(move.name)
                }}
              >
                <span className="move-slot__option-name">{move.name}</span>
                <span className="move-slot__option-meta">
                  <span
                    className="move-slot__option-type"
                    style={{ backgroundColor: moveColor.bg, color: moveColor.text }}
                  >
                    {move.type}
                  </span>
                  <span className="move-slot__option-category">
                    {catLabel}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
