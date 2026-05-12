/**
 * PokeCalc — ItemSelect Component
 * Text input that signals focus to CalcCard to open the ItemList overlay.
 * The input is fully controlled by CalcCard via query/onQueryChange props.
 * The toggle button shows/hides the overlay (mimicking NatureSelect pattern).
 */

import './ItemSelect.css'

interface ItemSelectProps {
  value: string | undefined
  onChange: (item: string | undefined) => void
  disabled?: boolean
  onFocus: () => void
  onToggle: () => void
  isOpen: boolean
  query: string
  onQueryChange: (q: string) => void
}

export function ItemSelect({
  value,
  onChange,
  disabled,
  onFocus,
  onToggle,
  isOpen,
  query,
  onQueryChange,
}: ItemSelectProps) {
  return (
    <div className="item-select">
      <label className="item-select__label" htmlFor="item-select">
        Held Item
      </label>
      <div className="item-select__wrapper">
        <input
          className="item-select__input"
          id="item-select"
          type="text"
          placeholder="Search items..."
          value={query.length > 0 ? query : (value || '')}
          disabled={disabled}
          onChange={(e) => {
            onQueryChange(e.target.value)
            if (!e.target.value) {
              onChange(undefined)
            }
          }}
          onFocus={() => {
            if (!disabled) {
              onFocus()
            }
          }}
          autoComplete="off"
        />
        {disabled ? (
          <span className="item-select__icon material-symbols-outlined">
            lock
          </span>
        ) : (
          <button
            type="button"
            className={`item-select__toggle${isOpen ? ' item-select__toggle--open' : ''}`}
            aria-label={isOpen ? 'Hide item list' : 'Show item list'}
            aria-expanded={isOpen ? 'true' : 'false'}
            onMouseDown={(e) => {
              e.preventDefault()
            }}
            onClick={onToggle}
          >
            <span className="item-select__icon material-symbols-outlined" aria-hidden>
              expand_more
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
