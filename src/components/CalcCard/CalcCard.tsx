/**
 * PokeCalc — CalcCard Component
 * Main card component that assembles species selection, stats, Stat Points, nature,
 * ability, item, and move selection for attacker or defender.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { toID, Generations } from '@smogon/calc'
import type { CalcCardState, StatName } from '../../types/calc'
import { CHAMPIONS_SP_TOTAL_MAX, CHAMPIONS_SP_MAX_PER_STAT } from '../../types/calc'
import type { TypeName, BaseStats } from '../../types/pokemon'
import { TypeBadge } from '../TypeBadge/TypeBadge'
import { StatBar } from '../StatBar/StatBar'
import { SpeciesSelect, getFormes } from '../SpeciesSelect/SpeciesSelect'
import { NatureSelect } from '../NatureSelect/NatureSelect'
import { AbilitySelect } from '../AbilitySelect/AbilitySelect'
import { ItemSelect } from '../ItemSelect/ItemSelect'
import { MoveSlot } from '../MoveSlot/MoveSlot'
import { MoveList } from '../MoveList/MoveList'
import { Spinner } from '../Spinner/Spinner'
import { getMegaStone } from '../../data/mega-stones'
import { computeStats, getStatBarMax, getNatureEffect } from '../../utils/calc-stats'
import { totalSPs } from '../../data/sp-presets'
import { getSpriteUrl } from '../../data/species-to-id'
import { useLearnset } from '../../hooks/useLearnset'
import megaButtonImg from '../../assets/megaButton.png'
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
  const [isImageLoading, setIsImageLoading] = useState(true)
  const imgRef = useRef<HTMLImageElement>(null)

  // Move list overlay state
  const [activeMoveSlot, setActiveMoveSlot] = useState<number | null>(null)
  const [moveSearchQuery, setMoveSearchQuery] = useState('')

  const speciesName = state.forme ? `${state.species}-${state.forme}` : state.species
  const speciesData = state.species ? gen.species.get(toID(speciesName)) : null

  // Load learnset for the selected species (async, cached)
  const { learnset, isLoading: isLearnsetLoading } = useLearnset(state.species)

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

  const stats = baseStats
    ? computeStats(baseStats, state.sps, state.nature)
    : null

  const types: TypeName[] = speciesData?.types
    ? (speciesData.types as unknown as TypeName[])
    : []

  const spriteUrl = speciesName ? getSpriteUrl(speciesName) : null

  // Reset loading state when species changes.
  // Also handles the case where the image is already cached
  // (e.g. loaded by SpeciesSelect's small sprite) — onLoad
  // would fire before React attaches the handler, so we
  // check img.complete.
  useEffect(() => {
    setIsImageLoading(true)
    if (imgRef.current?.complete) {
      setIsImageLoading(false)
    }
  }, [spriteUrl])

  // Auto-equip mega stone when Mega forme is selected (except Mega Rayquaza)
  useEffect(() => {
    if (!state.species || !state.forme?.includes('Mega')) {
      return
    }

    const stone = getMegaStone(state.species, state.forme)
    if (stone && state.item !== stone) {
      onStateChange({ ...state, item: stone })
    }
  }, [state.species, state.forme])

  const spTotal = totalSPs(state.sps)

  // Compute available Mega formes for the selected species
  const availableMegaFormes = useMemo(() => {
    if (!state.species) return []
    const sp = gen.species.get(toID(state.species))
    if (!sp) return []
    return getFormes(sp)
  }, [state.species, gen])

  // Determine if item is locked due to Mega forme being selected
  // (Mega Rayquaza is excluded — it mega evolves via Dragon Ascent, not a stone)
  const isMegaLocked = state.forme?.includes('Mega') && state.species !== 'Rayquaza'

  const handleSpeciesChange = (species: string | null, forme: string | null) => {
    const newState: CalcCardState = {
      ...state,
      species,
      forme,
      ability: undefined,
      moves: ['', '', '', ''],
      activeMoveIndex: 0,
    }

    if (species) {
      const sp = gen.species.get(toID(species))
      if (sp?.abilities?.['0']) {
        newState.ability = sp.abilities['0']
      }
    }

    onStateChange(newState)
  }

  const handleSPChange = (stat: StatName, value: number) => {
    const newSPs = { ...state.sps, [stat]: value }
    const newTotal = totalSPs(newSPs)

    if (newTotal > CHAMPIONS_SP_TOTAL_MAX) {
      return
    }

    if (value > CHAMPIONS_SP_MAX_PER_STAT) {
      return
    }

    onStateChange({ ...state, sps: newSPs })
  }

  // Move list overlay handlers
  const handleSlotFocus = useCallback((slotIndex: number) => {
    setActiveMoveSlot(slotIndex)
    setMoveSearchQuery(state.moves[slotIndex] || '')
  }, [state.moves])

  const handleMoveSelect = useCallback((slotIndex: number, moveName: string) => {
    const newMoves = [...state.moves]
    newMoves[slotIndex] = moveName
    onStateChange({ ...state, moves: newMoves })
    setActiveMoveSlot(null)
    setMoveSearchQuery('')
  }, [state, onStateChange])

  const handleMoveListClose = useCallback(() => {
    setActiveMoveSlot(null)
    setMoveSearchQuery('')
  }, [])

  return (
    <article className={`calc-card calc-card--${role}`}>
      <header className="calc-card__header">
        <h2 className="calc-card__title">{isAttacker ? 'Attacker' : 'Defender'}</h2>
        <span className={`calc-card__badge calc-card__badge--${role}`}>
          {isAttacker ? 'ATK' : 'DEF'}
        </span>
      </header>

      <div className="calc-card__section">
        <SpeciesSelect
          value={state.species}
          onChange={handleSpeciesChange}
          gen={gen}
        />
      </div>

      {speciesData && (
        <>
          {/* Sprite + Move Slots — side by side */}
          <div className="calc-card__sprite-moves-row">
            <div className="calc-card__sprite-section">
              <div className="calc-card__sprite-wrapper">
                {spriteUrl ? (
                  <>
                    {isImageLoading && <Spinner size="small" />}
                    <img
                      ref={imgRef}
                      className="calc-card__sprite"
                      src={spriteUrl}
                      alt={speciesName || ''}
                      onLoad={() => setIsImageLoading(false)}
                      onError={() => setIsImageLoading(false)}
                      style={{ visibility: isImageLoading ? 'hidden' : 'visible' }}
                    />
                  </>
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
                  {availableMegaFormes.length > 0 && (
                    <button
                      className={`calc-card__mega-toggle ${state.forme ? 'calc-card__mega-toggle--active' : ''}`}
                      type="button"
                      onClick={() => {
                        if (state.forme) {
                          onStateChange({ ...state, forme: null, item: undefined })
                        } else {
                          onStateChange({ ...state, forme: availableMegaFormes[0] })
                        }
                      }}
                      title={state.forme ? 'Switch to base form' : `Switch to ${availableMegaFormes[0]} form`}
                    >
                      <img
                        src={megaButtonImg}
                        alt="Mega Evolution"
                        className="calc-card__mega-sprite"
                      />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="calc-card__move-slots">
              {[0, 1, 2, 3].map((i) => (
                <MoveSlot
                  key={i}
                  index={i}
                  value={state.moves[i] || ''}
                  isActive={state.activeMoveIndex === i}
                  onMoveChange={(index: number, moveName: string) => {
                    const newMoves = [...state.moves]
                    newMoves[index] = moveName
                    onStateChange({ ...state, moves: newMoves })
                    // Update search query when typing while MoveList is open
                    if (activeMoveSlot === index) {
                      setMoveSearchQuery(moveName)
                    }
                  }}
                  onInputChange={(index: number, moveName: string) => {
                    if (activeMoveSlot === index) {
                      setMoveSearchQuery(moveName)
                    }
                  }}
                  onActivate={(index: number) => {
                    onStateChange({ ...state, activeMoveIndex: index })
                  }}
                  onSlotFocus={handleSlotFocus}
                  suppressDropdown={activeMoveSlot !== null}
                  learnset={learnset}
                  gen={gen}
                />
              ))}
            </div>
          </div>

          {/* Controls — Nature, Ability, Item in a horizontal row */}
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
              disabled={isMegaLocked}
            />
          </div>

          {/* Stats or Move List overlay */}
          {activeMoveSlot !== null ? (
            <MoveList
              slotIndex={activeMoveSlot}
              query={moveSearchQuery}
              learnset={learnset}
              isLoading={isLearnsetLoading}
              onSelect={handleMoveSelect}
              onClose={handleMoveListClose}
            />
          ) : (
            stats && (
              <div className="calc-card__stats">
                {STAT_CONFIG.map(({ key, label, colorClass }) => {
                  const maxValue = getStatBarMax(key)
                  return (
                    <StatBar
                      key={key}
                      statKey={key}
                      label={label}
                      value={stats[key]}
                      maxValue={maxValue}
                      colorClass={colorClass}
                      spValue={state.sps[key]}
                      spMax={CHAMPIONS_SP_MAX_PER_STAT}
                      spTotal={spTotal}
                      baseValue={baseStats?.[key]}
                      onSPChange={(value: number) => handleSPChange(key, value)}
                      natureEffect={getNatureEffect(key, state.nature)}
                    />
                  )
                })}
              </div>
            )
          )}
        </>
      )}
    </article>
  )
}
