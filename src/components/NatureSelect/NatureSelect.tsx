/**
 * PokeCalc — NatureSelect Component
 * Dropdown of 25 natures with stat boost/hindrance display.
 */

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
}

function formatNatureLabel(name: string): string {
  const nature = NATURES.find((n) => n.name === name)
  if (!nature) return name

  // Neutral nature (plus === minus)
  if (nature.plus === nature.minus) {
    return name
  }

  const plusStat = nature.plus ? STAT_SHORT[nature.plus] : ''
  const minusStat = nature.minus ? STAT_SHORT[nature.minus] : ''

  return `${name} (+${plusStat}, -${minusStat})`
}

export function NatureSelect({ value, onChange }: NatureSelectProps) {
  return (
    <div className="nature-select">
      <label className="nature-select__label" htmlFor="nature-select">
        Nature
      </label>
      <div className="nature-select__wrapper">
        <select
          className="nature-select__select"
          id="nature-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {NATURES.map((nature) => (
            <option key={nature.name} value={nature.name}>
              {formatNatureLabel(nature.name)}
            </option>
          ))}
        </select>
        <span className="nature-select__icon material-symbols-outlined">
          expand_more
        </span>
      </div>
    </div>
  )
}
