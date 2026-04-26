/**
 * PokeCalc — StatBar Component
 * Renders a stat bar with label, numeric value, track, and colored fill.
 */

import './StatBar.css'

interface StatBarProps {
  label: string
  value: number
  maxValue: number
  colorClass: string
}

export function StatBar({ label, value, maxValue, colorClass }: StatBarProps) {
  const percentage = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0

  return (
    <div className="stat-bar">
      <div className="stat-bar__header">
        <span className="stat-bar__label">{label}</span>
        <span className="stat-bar__value">{value}</span>
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
