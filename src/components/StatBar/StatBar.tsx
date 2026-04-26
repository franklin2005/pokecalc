/**
 * PokeCalc — StatBar Component
 * Renders a stat bar with label, numeric value, nature effect indicator,
 * inline SP slider, track, and colored fill.
 */

import './StatBar.css'
import type { StatName } from '../../types/calc'

interface StatBarProps {
  label: string
  value: number
  maxValue: number
  colorClass: string
  spValue: number
  spMax: number
  spTotal: number
  onSPChange: (value: number) => void
  natureEffect: 'boosted' | 'hindered' | 'neutral'
  statKey: StatName
}

export function StatBar({
  label,
  value,
  maxValue,
  colorClass,
  spValue,
  spMax,
  spTotal,
  onSPChange,
  natureEffect,
  statKey,
}: StatBarProps) {
  const percentage = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0
  const isSPDisabled = spTotal >= 66 && spValue === 0

  const natureLabel =
    natureEffect === 'boosted' ? '↑+10%' : natureEffect === 'hindered' ? '↓−10%' : '—'

  const handleSPInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSPChange(Number(e.target.value))
  }

  return (
    <div className="stat-bar">
      <div className="stat-bar__header">
        <span className="stat-bar__label">{label}</span>
        <span className="stat-bar__value">{value}</span>
        <span className={`stat-bar__nature stat-bar__nature--${natureEffect}`}>
          {natureLabel}
        </span>
        <div className="stat-bar__sp-inline">
          <input
            className="stat-bar__sp-input"
            type="range"
            min={0}
            max={spMax}
            value={spValue}
            disabled={isSPDisabled}
            onChange={handleSPInput}
            aria-label={`${label} SPs`}
          />
          <span className="stat-bar__sp-count">{spValue}/{spMax}</span>
        </div>
      </div>
      <div className="stat-bar__track">
        <div
          className={`stat-bar__fill ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}