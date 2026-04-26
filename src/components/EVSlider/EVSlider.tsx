/**
 * PokeCalc — EVSlider Component
 * Range slider for allocating EVs to a single stat.
 * Champions: max 32 per stat, total ≤ 66.
 */

import { CHAMPIONS_EV_MAX_PER_STAT, CHAMPIONS_EV_TOTAL_MAX } from '../../types/calc'
import type { StatName } from '../../types/calc'
import './EVSlider.css'

const STAT_LABELS: Record<StatName, string> = {
  hp: 'HP',
  atk: 'Atk',
  def: 'Def',
  spa: 'SpA',
  spd: 'SpD',
  spe: 'Spe',
}

interface EVSliderProps {
  statName: StatName
  value: number
  totalEVs: number
  onChange: (value: number) => void
}

export function EVSlider({ statName, value, totalEVs, onChange }: EVSliderProps) {
  const isMaxed = value >= CHAMPIONS_EV_MAX_PER_STAT
  const isCapReached = totalEVs >= CHAMPIONS_EV_TOTAL_MAX && value === 0
  const label = STAT_LABELS[statName]

  return (
    <div className={`ev-slider ${isMaxed ? 'ev-slider--maxed' : ''}`}>
      <div className="ev-slider__header">
        <span className="ev-slider__label">{label}</span>
        <span className="ev-slider__value">{value}</span>
      </div>
      <input
        className="ev-slider__input"
        type="range"
        min={0}
        max={CHAMPIONS_EV_MAX_PER_STAT}
        value={value}
        disabled={isCapReached}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label} EVs`}
      />
    </div>
  )
}
