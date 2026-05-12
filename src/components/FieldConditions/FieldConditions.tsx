/**
 * PokeCalc — FieldConditions Component
 * Collapsible panel for weather, terrain, and per-side field conditions.
 */

import type { FieldState, Weather, Terrain, SideConditions } from '../../types/calc'
import './FieldConditions.css'

interface FieldConditionsProps {
  field: FieldState
  onFieldChange: (field: FieldState) => void
}

const WEATHER_OPTIONS: (Weather | 'None')[] = [
  'None',
  'Sun',
  'Rain',
  'Sand',
  'Hail',
  'Harsh Sunshine',
  'Heavy Rain',
  'Strong Winds',
]

const TERRAIN_OPTIONS: (Terrain | 'None')[] = [
  'None',
  'Electric',
  'Grassy',
  'Misty',
  'Psychic',
]

const SPIKE_OPTIONS = [0, 1, 2, 3] as const

function SideConditionFields({
  label,
  conditions,
  onChange,
}: {
  label: string
  conditions: SideConditions
  onChange: (conditions: SideConditions) => void
}) {
  const update = (partial: Partial<SideConditions>) => {
    onChange({ ...conditions, ...partial })
  }

  return (
    <fieldset className="field-conditions__side">
      <legend className="field-conditions__side-title">{label}</legend>

      <div className="field-conditions__condition">
        <label className="field-conditions__checkbox-label">
          <input
            type="checkbox"
            className="field-conditions__checkbox"
            checked={conditions.stealthRock}
            onChange={(e) => update({ stealthRock: e.target.checked })}
          />
          Stealth Rock
        </label>
      </div>

      <div className="field-conditions__condition">
        <label className="field-conditions__select-label">
          Spikes
          <select
            className="field-conditions__select"
            value={conditions.spikes}
            onChange={(e) => update({ spikes: Number(e.target.value) })}
          >
            {SPIKE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n === 0 ? 'None' : `${n} layer${n > 1 ? 's' : ''}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="field-conditions__condition">
        <label className="field-conditions__checkbox-label">
          <input
            type="checkbox"
            className="field-conditions__checkbox"
            checked={conditions.reflect}
            onChange={(e) => update({ reflect: e.target.checked })}
          />
          Reflect
        </label>
      </div>

      <div className="field-conditions__condition">
        <label className="field-conditions__checkbox-label">
          <input
            type="checkbox"
            className="field-conditions__checkbox"
            checked={conditions.lightScreen}
            onChange={(e) => update({ lightScreen: e.target.checked })}
          />
          Light Screen
        </label>
      </div>

      <div className="field-conditions__condition">
        <label className="field-conditions__checkbox-label">
          <input
            type="checkbox"
            className="field-conditions__checkbox"
            checked={conditions.auroraVeil}
            onChange={(e) => update({ auroraVeil: e.target.checked })}
          />
          Aurora Veil
        </label>
      </div>

      <div className="field-conditions__condition">
        <label className="field-conditions__checkbox-label">
          <input
            type="checkbox"
            className="field-conditions__checkbox"
            checked={conditions.tailwind}
            onChange={(e) => update({ tailwind: e.target.checked })}
          />
          Tailwind
        </label>
      </div>

      <div className="field-conditions__condition">
        <label className="field-conditions__checkbox-label">
          <input
            type="checkbox"
            className="field-conditions__checkbox"
            checked={conditions.helpingHand}
            onChange={(e) => update({ helpingHand: e.target.checked })}
          />
          Helping Hand
        </label>
      </div>
    </fieldset>
  )
}

export function FieldConditions({ field, onFieldChange }: FieldConditionsProps) {
  const handleWeatherChange = (value: string) => {
    onFieldChange({
      ...field,
      weather: value === 'None' ? null : (value as Weather),
    })
  }

  const handleTerrainChange = (value: string) => {
    onFieldChange({
      ...field,
      terrain: value === 'None' ? null : (value as Terrain),
    })
  }

  const handleLeftSideChange = (conditions: SideConditions) => {
    onFieldChange({
      ...field,
      leftSide: conditions,
    })
  }

  const handleRightSideChange = (conditions: SideConditions) => {
    onFieldChange({
      ...field,
      rightSide: conditions,
    })
  }

  return (
    <details className="field-conditions">
      <summary className="field-conditions__summary">
        <span className="material-symbols-outlined">grid_on</span>
        Field Conditions
      </summary>

      <div className="field-conditions__content">
        {/* Weather and Terrain */}
        <div className="field-conditions__grid">
          <div className="field-conditions__group">
            <label className="field-conditions__select-label">
              Weather
              <select
                className="field-conditions__select"
                value={field.weather || 'None'}
                onChange={(e) => handleWeatherChange(e.target.value)}
              >
                {WEATHER_OPTIONS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="field-conditions__group">
            <label className="field-conditions__select-label">
              Terrain
              <select
                className="field-conditions__select"
                value={field.terrain || 'None'}
                onChange={(e) => handleTerrainChange(e.target.value)}
              >
                {TERRAIN_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Per-side conditions */}
        <div className="field-conditions__sides">
          <SideConditionFields
            label="Left Side"
            conditions={field.leftSide}
            onChange={handleLeftSideChange}
          />
          <SideConditionFields
            label="Right Side"
            conditions={field.rightSide}
            onChange={handleRightSideChange}
          />
        </div>
      </div>
    </details>
  )
}
