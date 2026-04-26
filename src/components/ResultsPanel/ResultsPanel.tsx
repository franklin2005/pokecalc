/**
 * PokeCalc — ResultsPanel Component
 * Displays damage calculation results: range, KO text, effectiveness, and swap button.
 */

import type { CalcResult } from '../../types/calc'
import { ErrorDisplay } from '../ErrorDisplay/ErrorDisplay'
import './ResultsPanel.css'

interface ResultsPanelProps {
  result: CalcResult | null
  onSwap: () => void
  hasSelection: boolean
}

export function ResultsPanel({ result, onSwap, hasSelection }: ResultsPanelProps) {
  if (!result) {
    if (hasSelection) {
      return (
        <div className="results-panel">
          <h3 className="results-panel__title">Results</h3>
          <ErrorDisplay
            message="Unable to calculate damage. Check your Pokémon and move selection."
          />
          <button
            className="results-panel__swap-btn results-panel__swap-btn--disabled"
            type="button"
            onClick={onSwap}
            aria-label="Swap attacker and defender"
            disabled
          >
            <span className="material-symbols-outlined">swap_horiz</span>
            Swap
          </button>
        </div>
      )
    }

    return (
      <div className="results-panel">
        <h3 className="results-panel__title">Results</h3>
        <p className="results-panel__placeholder">
          Select a Pokémon and move to calculate damage
        </p>
        <button
          className="results-panel__swap-btn results-panel__swap-btn--disabled"
          type="button"
          onClick={onSwap}
          aria-label="Swap attacker and defender"
          disabled
        >
          <span className="material-symbols-outlined">swap_horiz</span>
          Swap
        </button>
      </div>
    )
  }

  const [minPct, maxPct] = result.damageRange
  const effectivenessClass = `results-panel__effectiveness results-panel__effectiveness--${result.effectiveness}`

  return (
    <div className="results-panel results-panel--active">
      <h3 className="results-panel__title">Results</h3>

      {/* Damage Range */}
      <div className="results-panel__damage-range">
        <span className="results-panel__damage-pct">
          {minPct.toFixed(1)}% — {maxPct.toFixed(1)}%
        </span>
      </div>

      {/* Visual Damage Bar */}
      <div className="results-panel__damage-bar">
        <div
          className="results-panel__damage-bar-fill"
          style={{
            marginLeft: `${Math.min(minPct, 100)}%`,
            width: `${Math.min(maxPct - minPct, 100 - minPct)}%`,
          }}
        />
        <div className="results-panel__damage-bar-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* KO Text */}
      <p className="results-panel__ko-text">{result.koText}</p>

      {/* Effectiveness */}
      <div className={effectivenessClass}>
        {result.effectiveness === 'super-effective' && (
          <>
            <span className="material-symbols-outlined">arrow_upward</span>
            Super Effective
          </>
        )}
        {result.effectiveness === 'not-very-effective' && (
          <>
            <span className="material-symbols-outlined">arrow_downward</span>
            Not Very Effective
          </>
        )}
        {result.effectiveness === 'neutral' && (
          <>
            <span className="material-symbols-outlined">remove</span>
            Neutral
          </>
        )}
      </div>

      {/* Swap Button */}
      <button
        className="results-panel__swap-btn"
        type="button"
        onClick={onSwap}
        aria-label="Swap attacker and defender"
      >
        <span className="material-symbols-outlined">swap_horiz</span>
        Swap
      </button>
    </div>
  )
}
