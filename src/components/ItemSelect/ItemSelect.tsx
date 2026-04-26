/**
 * PokeCalc — ItemSelect Component
 * Dropdown of Champions-allowed items, grouped by category.
 */

import { CHAMPIONS_ITEMS } from '../../data/champions-items'
import './ItemSelect.css'

interface ItemSelectProps {
  value: string | undefined
  onChange: (item: string | undefined) => void
}

/** Categorize Champions items into logical groups */
function categorizeItem(item: string): string {
  // Mega Stones
  if (item.endsWith('ite') || item === 'Mewtwonite X' || item === 'Mewtwonite Y') {
    return 'Mega Stones'
  }

  // Choice items
  if (item.startsWith('Choice')) {
    return 'Choice Items'
  }

  // Berries
  if (item.endsWith('Berry')) {
    return 'Berries'
  }

  // Offensive items
  const offensive = [
    'Life Orb', 'Expert Belt', 'Muscle Band', 'Wise Glasses', 'Metronome',
    'Black Glasses', 'Charcoal', 'Dragon Fang', 'Hard Stone', 'Magnet',
    'Miracle Seed', 'Mystic Water', 'Never-Melt Ice', 'Poison Barb',
    'Sharp Beak', 'Silk Scarf', 'Silver Powder', 'Soft Sand', 'Spell Tag',
    'Twisted Spoon',
  ]
  if (offensive.includes(item)) {
    return 'Offensive Items'
  }

  // Defensive items
  const defensive = [
    'Leftovers', 'Assault Vest', 'Focus Sash', 'Rocky Helmet', 'Black Sludge',
    'Heavy-Duty Boots', 'Eviolite', 'Air Balloon', 'Covert Cloak', 'Clear Amulet',
  ]
  if (defensive.includes(item)) {
    return 'Defensive Items'
  }

  // Everything else goes to Battle Effect
  return 'Battle Effect Items'
}

const CATEGORY_ORDER = [
  'Choice Items',
  'Offensive Items',
  'Defensive Items',
  'Berries',
  'Battle Effect Items',
  'Mega Stones',
]

export function ItemSelect({ value, onChange }: ItemSelectProps) {
  // Group items by category
  const grouped = new Map<string, string[]>()
  for (const item of CHAMPIONS_ITEMS) {
    const category = categorizeItem(item)
    const existing = grouped.get(category) || []
    existing.push(item)
    grouped.set(category, existing)
  }

  return (
    <div className="item-select">
      <label className="item-select__label" htmlFor="item-select">
        Held Item
      </label>
      <div className="item-select__wrapper">
        <select
          className="item-select__select"
          id="item-select"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || undefined)}
        >
          <option value="">No Item</option>
          {CATEGORY_ORDER.map((category) => {
            const items = grouped.get(category)
            if (!items || items.length === 0) return null
            return (
              <optgroup key={category} label={category}>
                {items.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </optgroup>
            )
          })}
        </select>
        <span className="item-select__icon material-symbols-outlined">
          expand_more
        </span>
      </div>
    </div>
  )
}
