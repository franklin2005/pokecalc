/**
 * PokeCalc — NatureSelect Component
 * Searchable combobox for 25 natures; dropdown opens downward below the field.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { NATURES } from '../../data/natures'
import type { StatName } from '../../types/calc'
import './NatureSelect.css'

const STAT_SHORT: Record<StatName, string> = {
  hp: 'HP',
  atk: 'Atk',
  def: 'Def',
  spa: 'SpA',
  spd: 'SpD',
  spe: 'Spe',
}

interface NatureSelectProps {
  value: string
  onChange: (nature: string) => void
  /** Unique id when multiple cards mount two selectors (label htmlFor). */
  inputId?: string
}

function formatNatureLabel(name: string): string {
  const nature = NATURES.find((n) => n.name === name)
  if (!nature) return name

  if (nature.plus === nature.minus) {
    return name
  }

  const plusStat = nature.plus ? STAT_SHORT[nature.plus] : ''
  const minusStat = nature.minus ? STAT_SHORT[nature.minus] : ''

  return `${name} (+${plusStat}, -${minusStat})`
}

/** First nature to scroll to / emphasize: full list stays visible; this picks the “active” row. */
function findMatchNatureName(rawQuery: string, currentNatureName: string): string | null {
  const q = rawQuery.trim().toLowerCase()
  if (!q) {
    return currentNatureName || null
  }

  const byNameStart = NATURES.find((n) => n.name.toLowerCase().startsWith(q))
  if (byNameStart) {
    return byNameStart.name
  }

  const byLabel = NATURES.find((n) =>
    formatNatureLabel(n.name).toLowerCase().includes(q),
  )
  if (byLabel) {
    return byLabel.name
  }

  const byNameIncludes = NATURES.find((n) => n.name.toLowerCase().includes(q))
  return byNameIncludes?.name ?? null
}

export function NatureSelect({ value, onChange, inputId = 'nature-select' }: NatureSelectProps) {
  const listboxId = `${inputId}-listbox`
  const [query, setQuery] = useState(() => formatNatureLabel(value))
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const optionElRefs = useRef<Record<string, HTMLLIElement | null>>({})

  const displayLabel = useMemo(() => formatNatureLabel(value), [value])

  const matchNatureName = useMemo(
    () => findMatchNatureName(query, value),
    [query, value],
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setQuery(displayLabel)
    }
  }, [value, isOpen, displayLabel])

  const handleSelect = useCallback(
    (name: string) => {
      setQuery(formatNatureLabel(name))
      setIsOpen(false)
      onChange(name)
    },
    [onChange],
  )

  useEffect(() => {
    if (!isOpen || !matchNatureName) {
      return
    }
    const el = optionElRefs.current[matchNatureName]
    el?.scrollIntoView({ block: 'nearest' })
  }, [isOpen, matchNatureName])

  return (
    <div className="nature-select" ref={wrapperRef}>
      <label className="nature-select__label" htmlFor={inputId}>
        Nature
      </label>
      <div className="nature-select__wrapper">
        <input
          ref={inputRef}
          className="nature-select__select"
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-controls={isOpen ? listboxId : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
        />
        <button
          type="button"
          className={`nature-select__toggle${isOpen ? ' nature-select__toggle--open' : ''}`}
          aria-label={isOpen ? 'Hide nature list' : 'Show nature list'}
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-controls={isOpen ? listboxId : undefined}
          onMouseDown={(e) => {
            e.preventDefault()
          }}
          onClick={() => {
            setIsOpen((wasOpen) => {
              const next = !wasOpen
              if (next) {
                queueMicrotask(() => inputRef.current?.focus())
              }
              return next
            })
          }}
        >
          <span className="nature-select__icon material-symbols-outlined" aria-hidden>
            expand_more
          </span>
        </button>
      </div>

      {isOpen && (
        <ul className="nature-select__dropdown" id={listboxId} role="listbox">
          {NATURES.map((nature) => {
            const label = formatNatureLabel(nature.name)
            const selected = nature.name === value
            const isMatchRow = nature.name === matchNatureName
            const optionClass = [
              'nature-select__option',
              selected ? 'nature-select__option--selected' : '',
              isMatchRow ? 'nature-select__option--match' : '',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <li
                key={nature.name}
                ref={(el) => {
                  optionElRefs.current[nature.name] = el
                }}
                className={optionClass}
                role="option"
                aria-selected={selected ? 'true' : 'false'}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelect(nature.name)
                }}
              >
                {label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
