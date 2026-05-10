/**
 * PokeCalc — ItemSelect Component
 * Text input with search/autocomplete for Champions-allowed items.
 * Shows category labels in the dropdown.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { CHAMPIONS_ITEMS, getItemCategory } from '../../data/champions-items'
import './ItemSelect.css'

interface ItemSelectProps {
  value: string | undefined
  onChange: (item: string | undefined) => void
  disabled?: boolean
}

export function ItemSelect({ value, onChange, disabled }: ItemSelectProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Filter items by query (case-insensitive substring match)
  const filtered = useMemo(() => {
    if (query.length === 0) return []
    const lower = query.toLowerCase()
    return CHAMPIONS_ITEMS
      .filter((item) => item.toLowerCase().includes(lower))
      .slice(0, 20)
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

  // Sync query with value when value changes externally
  useEffect(() => {
    if (value && !isOpen) {
      setQuery(value)
    }
  }, [value, isOpen])

  const handleSelect = useCallback((item: string | undefined) => {
    if (item) {
      setQuery(item)
    } else {
      setQuery('')
    }
    setIsOpen(false)
    onChange(item)
  }, [onChange])

  return (
    <div className="item-select" ref={wrapperRef}>
      <label className="item-select__label" htmlFor="item-select">
        Held Item
      </label>
      <div className="item-select__wrapper">
        <input
          className="item-select__input"
          id="item-select"
          type="text"
          placeholder="Search items..."
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            if (!e.target.value) {
              onChange(undefined)
            }
          }}
          onFocus={() => !disabled && setIsOpen(true)}
          autoComplete="off"
        />
        <span className="item-select__icon material-symbols-outlined">
          {disabled ? 'lock' : 'expand_more'}
        </span>
      </div>

      {isOpen && !disabled && (filtered.length > 0 || query.length > 0) && (
        <ul className="item-select__dropdown" role="listbox">
          <li
            className="item-select__option item-select__option--no-item"
            role="option"
            aria-selected={value === undefined}
            onMouseDown={(e) => {
              e.preventDefault()
              handleSelect(undefined)
            }}
          >
            <span className="item-select__option-name">No Item</span>
          </li>
          {filtered.map((item) => {
            const category = getItemCategory(item)
            return (
              <li
                key={item}
                className={`item-select__option ${item === value ? 'item-select__option--selected' : ''}`}
                role="option"
                aria-selected={item === value}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelect(item)
                }}
              >
                <span className="item-select__option-name">{item}</span>
                <span className="item-select__option-category">{category}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
