/**
 * PokeCalc — CalcCard Component
 * Main card component that assembles species selection, stats, EVs, nature,
 * ability, item, and move selection for attacker or defender.
 */

import { toID, Generations } from '@smogon/calc'
import type { CalcCardState, StatName } from '../../types/calc'
import { CHAMPIONS_EV_TOTAL_MAX, CHAMPIONS_EV_MAX_PER_STAT } from '../../types/calc'
import type { TypeName, BaseStats } from '../../types/pokemon'
import { TypeBadge } from '../TypeBadge/TypeBadge'
import { StatBar } from '../StatBar/StatBar'
import { SpeciesSelect } from '../SpeciesSelect/SpeciesSelect'
import { EVSlider } from '../EVSlider/EVSlider'
import { NatureSelect } from '../NatureSelect/NatureSelect'
import { AbilitySelect } from '../AbilitySelect/AbilitySelect'
import { ItemSelect } from '../ItemSelect/ItemSelect'
import { MoveSelect } from '../MoveSelect/MoveSelect'
import { computeStats, getStatBarMax } from '../../utils/calc-stats'
import { totalEVs } from '../../data/ev-presets'
import { getSpriteUrl } from '../../data/species-to-id'
import './CalcCard.css'

type Generation = ReturnType<typeof Generations.get>

const STAT_CONFIG: { key: StatName; label: string; colorClass: string }[] = [
  { key: 'hp', label: 'HP', colorClass: 'stat-bar__fill--hp' },
  { key: 'atk', label: 'Atk', colorClass: 'stat-bar__fill--attack' },
  { key: 'def', label: 'Def', colorClass: 'stat-bar__fill--defense' },
  { key: 'spa', label: 'SpA', colorClass: 'stat-bar__fill--sp-attack' },
  { key: 'spd', label: 'SpD', colorClass: 'stat-bar__fill--sp-defense' },
  { key: 'spe', label: 'Spe', colorClass: 'stat-bar__fill--speed' },
]

interface CalcCardProps {
  role: 'attacker' | 'defender'
  state: CalcCardState
  onStateChange: (state: CalcCardState) => void
  gen: Generation
}

export function CalcCard({ role, state, onStateChange, gen }: CalcCardProps) {
  const isAttacker = role === 'attacker'

  // Get species data from calc
  const speciesName = state.forme ? `${state.species}-${state.forme}` : state.species
  const speciesData = state.species ? gen.species.get(toID(speciesName)) : null

  // Get base stats
  const baseStats: BaseStats | null = speciesData?.baseStats
    ? {
        hp: speciesData.baseStats.hp,
        atk: speciesData.baseStats.atk,
        def: speciesData.baseStats.def,
        spa: speciesData.baseStats.spa,
        spd: speciesData.baseStats.spd,
        spe: speciesData.baseStats.spe,
      }
    : null

  // Compute final stats
  const stats = baseStats
    ? computeStats(baseStats, state.evs, state.nature)
    : null

  // Get types
  const types: TypeName[] = speciesData?.types
    ? (speciesData.types as unknown as TypeName[])
    : []

  // Sprite URL
  const spriteUrl = speciesName ? getSpriteUrl(speciesName) : null

  // Total EVs
  const evTotal = totalEVs(state.evs)

  // Handle species selection
  const handleSpeciesChange = (species: string | null, forme: string | null) => {
    const newState: CalcCardState = {
      ...state,
      species,
      forme,
      ability: undefined,
      move: null,
    }

    // Auto-select primary ability
    if (species) {
      const sp = gen.species.get(toID(species))
      if (sp?.abilities?.['0']) {
        newState.ability = sp.abilities['0']
      }
    }

    onStateChange(newState)
  }

  // Handle EV change with Champions cap enforcement
  const handleEVChange = (stat: StatName, value: number) => {
    const newEVs = { ...state.evs, [stat]: value }
    const newTotal = totalEVs(newEVs)

    if (newTotal > CHAMPIONS_EV_TOTAL_MAX) {
      return
    }

    if (value > CHAMPIONS_EV_MAX_PER_STAT) {
      return
    }

    onStateChange({ ...state, evs: newEVs })
  }

  return (
    <article className={`calc-card calc-card--${role}`}>
      {/* Header */}
      <header className="calc-card__header">
        <h2 className="calc-card__title">{isAttacker ? 'Attacker' : 'Defender'}</h2>
        <span className={`calc-card__badge calc-card__badge--${role}`}>
          {isAttacker ? 'ATK' : 'DEF'}
        </span>
      </header>

      {/* Species Selection */}
      <div className="calc-card__section">
        <SpeciesSelect
          value={state.species}
          onChange={handleSpeciesChange}
          gen={gen}
        />
      </div>

      {speciesData && (
        <>
          {/* Sprite and Types */}
          <div className="calc-card__sprite-section">
            <div className="calc-card__sprite-wrapper">
              {spriteUrl ? (
                <img
                  className="calc-card__sprite"
                  src={spriteUrl}
                  alt={speciesName || ''}
                  loading="lazy"
                />
              ) : (
                <div className="calc-card__sprite-placeholder">
                  <span className="material-symbols-outlined">image</span>
                </div>
              )}
            </div>
            {types.length > 0 && (
              <div className="calc-card__types">
                {types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            )}
          </div>

          {/* Stats Display */}
          {stats && (
            <div className="calc-card__stats">
              {STAT_CONFIG.map(({ key, label, colorClass }) => {
                const maxValue = getStatBarMax(key)
                return (
                  <StatBar
                    key={key}
                    label={label}
                    value={stats[key]}
                    maxValue={maxValue}
                    colorClass={colorClass}
                  />
                )
              })}
            </div>
          )}

          {/* Controls: Nature, Ability, Item */}
          <div className="calc-card__controls">
            <NatureSelect
              value={state.nature}
              onChange={(nature: string) => onStateChange({ ...state, nature })}
            />
            <AbilitySelect
              species={state.species}
              value={state.ability}
              onChange={(ability: string | undefined) => onStateChange({ ...state, ability })}
              gen={gen}
            />
            <ItemSelect
              value={state.item}
              onChange={(item: string | undefined) => onStateChange({ ...state, item })}
            />
          </div>

          {/* Move Select (Attacker only) */}
          {isAttacker && (
            <div className="calc-card__section">
              <MoveSelect
                species={state.species}
                value={state.move}
                onChange={(move: string | null) => onStateChange({ ...state, move })}
                gen={gen}
              />
            </div>
          )}

          {/* EV Section */}
          <details className="calc-card__evs">
            <summary className="calc-card__evs-summary">
              <span>EV Distribution</span>
              <span className={`calc-card__evs-total ${evTotal >= CHAMPIONS_EV_TOTAL_MAX ? 'calc-card__evs-total--full' : ''}`}>
                {evTotal}/{CHAMPIONS_EV_TOTAL_MAX}
              </span>
            </summary>
            <div className="calc-card__evs-grid">
              {STAT_CONFIG.map(({ key }) => (
                <EVSlider
                  key={key}
                  statName={key}
                  value={state.evs[key]}
                  totalEVs={evTotal}
                  onChange={(value: number) => handleEVChange(key, value)}
                />
              ))}
            </div>
          </details>
        </>
      )}
    </article>
  )
}
