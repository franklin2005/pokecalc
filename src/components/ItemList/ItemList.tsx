/**
 * PokeCalc — ItemList Component
 * Scrollable overlay panel showing Champions-allowed items, filterable by query.
 * Replaces the stats section when the item input is focused.
 */

import { useMemo } from 'react'
import { CHAMPIONS_ITEMS, getItemCategory } from '../../data/champions-items'
import { getItemDesc } from '../../data/ability-item-data'
import { getItemSpriteUrl, handleItemSpriteError } from '../../data/item-sprite-urls'
import './ItemList.css'

interface ItemListProps {
  query: string
  selectedItem: string | undefined
  disabled: boolean
  onSelect: (item: string | undefined) => void
  onClose: () => void
}

export function ItemList({
  query,
  selectedItem,
  disabled,
  onSelect,
  onClose,
}: ItemListProps) {
  // Filter items by query
  const filtered = useMemo(() => {
    const lower = query.toLowerCase()
    const results = CHAMPIONS_ITEMS.filter((name) =>
      lower.length === 0 || name.toLowerCase().includes(lower)
    )

    // Sort alphabetically for consistent ordering
    results.sort((a, b) => a.localeCompare(b))

    return results
  }, [query])

  // Handle Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  // Disabled state
  if (disabled) {
    return (
      <div
        className="item-list"
        role="dialog"
        aria-label="Item selection"
      >
        <div className="item-list__header">
          <span className="item-list__title">Select Item</span>
          <button
            className="item-list__close"
            type="button"
            onClick={onClose}
            aria-label="Close item list"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="item-list__disabled">
          <span className="material-symbols-outlined">lock</span>
          <span>Item locked</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="item-list"
      role="dialog"
      aria-label="Item selection"
      onKeyDown={handleKeyDown}
    >
      <div className="item-list__header">
        <span className="item-list__title">Select Item</span>
        <button
          className="item-list__close"
          type="button"
          onClick={onClose}
          aria-label="Close item list"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="item-list__scroll">
        {/* "No Item" option always at the top */}
        <li
          className={`item-list__item item-list__item--no-item${selectedItem === undefined ? ' item-list__item--selected' : ''}`}
          onMouseDown={(e) => {
            e.preventDefault()
            onSelect(undefined)
          }}
        >
          <span className="item-list__item-name">No Item</span>
        </li>

        {filtered.map((name) => {
          const category = getItemCategory(name)
          const desc = getItemDesc(name)
          return (
            <li
              key={name}
              className={`item-list__item${name === selectedItem ? ' item-list__item--selected' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault()
                onSelect(name)
              }}
            >
              <img
                className="item-list__item-icon"
                src={getItemSpriteUrl(name)}
                alt=""
                onError={handleItemSpriteError(name)}
                aria-hidden="true"
              />
              <span className="item-list__item-name">{name}</span>
              <span className="item-list__item-category">{category}</span>
              {desc && <span className="item-list__item-desc">{desc}</span>}
            </li>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="item-list__empty">No items found</p>
      )}
    </div>
  )
}
