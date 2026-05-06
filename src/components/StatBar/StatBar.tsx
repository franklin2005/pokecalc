/**
 * PokeCalc — StatBar Component
 * Renders a stat bar with label, numeric value, nature effect indicator,
 * inline SP slider, track, and colored fill.
 */

import type { ChangeEvent, CSSProperties } from 'react'
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
  baseValue?: number
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
  statKey: _statKey,
  baseValue,
}: StatBarProps) {
  const percentage = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0
  const spFillPct = spMax > 0 ? Math.min(100, Math.max(0, (spValue / spMax) * 100)) : 0
  const isSPDisabled = spTotal >= 66 && spValue === 0

  const natureLabel =
    natureEffect === 'boosted' ? '↑+10%' : natureEffect === 'hindered' ? '↓−10%' : '—'

  const handleSPInput = (e: ChangeEvent<HTMLInputElement>) => {
    onSPChange(Number(e.target.value))
  }

  const handleSPNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === '') {
      onSPChange(0)
      return
    }
    const num = Number(raw)
    if (!isNaN(num)) {
      onSPChange(Math.min(Math.max(num, 0), spMax))
    }
  }

  return (
    <div className="stat-bar">
      <div className="stat-bar__header">
        {baseValue !== undefined && (
          <span className="stat-bar__base-value">{baseValue}</span>
        )}
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
            style={{ '--stat-sp-fill-pct': `${spFillPct}%` } as CSSProperties}
          />
          <input
            className="stat-bar__sp-number"
            type="number"
            min={0}
            max={spMax}
            value={spValue}
            disabled={isSPDisabled}
            onChange={handleSPNumberChange}
            inputMode="numeric"
            pattern="[0-9]*"
            aria-label={`${label} SP number input`}
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