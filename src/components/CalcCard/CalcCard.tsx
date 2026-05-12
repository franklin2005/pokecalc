/**
 * PokeCalc — CalcCard Component
 * Main card component that assembles species selection, stats, Stat Points, nature,
 * ability, item, and move selection for attacker or defender.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { toID, Generations } from '@smogon/calc'
import type { CalcCardState, StatName, CalcResult } from '../../types/calc'
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
import { AbilityList } from '../AbilityList/AbilityList'
import { ItemList } from '../ItemList/ItemList'
import { Spinner } from '../Spinner/Spinner'
import { getMegaStone } from '../../data/mega-stones'
import { computeStats, getStatBarMax, getNatureEffect } from '../../utils/calc-stats'
import { totalSPs } from '../../data/sp-presets'
import { getSpriteUrl } from '../../data/species-to-id'
import { getSpeciesAbilities } from '../../data/species-abilities'
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
  slotId: 'left' | 'right'
  state: CalcCardState
  onStateChange: (state: CalcCardState) => void
  gen: Generation
  result: CalcResult | null
}

export function CalcCard({ slotId, state, onStateChange, gen, result }: CalcCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [hasImageError, setHasImageError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Move list overlay state
  const [activeMoveSlot, setActiveMoveSlot] = useState<number | null>(null)
  const [moveSearchQuery, setMoveSearchQuery] = useState('')

  // Ability and item overlay state
  type OverlayType = 'ability' | 'item' | null
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null)
  const [abilitySearchQuery, setAbilitySearchQuery] = useState('')
  const [itemSearchQuery, setItemSearchQuery] = useState('')

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
    setHasImageError(false)
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
    let sp = gen.species.get(toID(state.species))
    if (!sp) return []
    // If current species is itself a mega, use its base species to find other formes
    if (sp.baseSpecies) {
      const baseSp = gen.species.get(toID(sp.baseSpecies))
      if (baseSp) sp = baseSp
    }
    return getFormes(sp)
  }, [state.species, gen])

  // Determine if a Mega forme is currently active.
  // Works for both paths: toggle (state.forme set) and direct search
  // (e.g. species="Venusaur-Mega" where state.forme is null).
  const isMegaActive = !!state.forme || !!gen.species.get(toID(state.species))?.baseSpecies

  // Determine if item is locked due to Mega forme being selected
  // (Mega Rayquaza is excluded — it mega evolves via Dragon Ascent, not a stone)
  const isMegaLocked = isMegaActive && state.species !== 'Rayquaza'

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
    setActiveOverlay(null)
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

  // Ability overlay handlers
  const handleAbilityFocus = useCallback(() => {
    setActiveMoveSlot(null)
    setActiveOverlay('ability')
    setAbilitySearchQuery(state.ability || '')
  }, [state.ability])

  const handleAbilitySelect = useCallback((ability: string) => {
    onStateChange({ ...state, ability })
    setActiveOverlay(null)
    setAbilitySearchQuery('')
  }, [state, onStateChange])

  const handleAbilityClose = useCallback(() => {
    setActiveOverlay(null)
    setAbilitySearchQuery('')
  }, [])

  // Item overlay handlers
  const handleItemFocus = useCallback(() => {
    setActiveMoveSlot(null)
    setActiveOverlay('item')
    setItemSearchQuery(state.item || '')
  }, [state.item])

  const handleItemSelect = useCallback((item: string | undefined) => {
    onStateChange({ ...state, item })
    setActiveOverlay(null)
    setItemSearchQuery('')
  }, [state, onStateChange])

  const handleAbilityToggle = useCallback(() => {
    if (activeOverlay === 'ability') {
      setActiveOverlay(null)
      setAbilitySearchQuery('')
    } else {
      setActiveMoveSlot(null)
      setActiveOverlay('ability')
      setAbilitySearchQuery(state.ability || '')
    }
  }, [activeOverlay, state.ability])

  const handleItemClose = useCallback(() => {
    setActiveOverlay(null)
    setItemSearchQuery('')
  }, [])

  const handleItemToggle = useCallback(() => {
    if (activeOverlay === 'item') {
      setActiveOverlay(null)
      setItemSearchQuery('')
    } else {
      setActiveMoveSlot(null)
      setActiveOverlay('item')
      setItemSearchQuery(state.item || '')
    }
  }, [activeOverlay, state.item])

  // Compute abilities for the selected species (for AbilityList overlay)
  const abilitiesForSpecies = useMemo(() => {
    if (!state.species) return []
    const lookupName = state.forme ? `${state.species}-${state.forme}` : state.species
    const speciesId = toID(lookupName)

    // For forme species (Megas, etc.), trust @smogon/calc's primary ability.
    // Our static SPECIES_ABILITIES mapping has unreliable data for formes.
    // Check baseSpecies: all formes have it, base species don't.
    // This covers both toggle path (state.forme set) and direct-search path
    // (e.g. "Venusaur-Mega" where state.forme is null but species is a forme).
    const sp = gen.species.get(speciesId)
    if (sp?.baseSpecies) {
      if (sp.abilities?.['0']) {
        return [sp.abilities['0']]
      }
      return []
    }

    // For base species, use our comprehensive mapping (primary + secondary + hidden)
    const mapped = getSpeciesAbilities(speciesId)
    if (mapped.length > 0) return mapped
    if (sp?.abilities?.['0']) {
      return [sp.abilities['0']]
    }
    return []
  }, [state.species, state.forme, gen])

  return (
    <article className={`calc-card calc-card--${slotId}`}>
      <header className="calc-card__header">
        <span className={`calc-card__badge calc-card__badge--${slotId}`}>
          {slotId === 'left' ? 'L' : 'R'}
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
                {spriteUrl && !hasImageError ? (
                  <>
                    {isImageLoading && <Spinner size="small" />}
                    <img
                      ref={imgRef}
                      className="calc-card__sprite"
                      src={spriteUrl}
                      alt={speciesName || ''}
                      onLoad={() => setIsImageLoading(false)}
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement
                        if (img.src.includes('/sprites/home/')) {
                          // Champions megas don't have HOME sprites — fall back to DEX
                          img.src = img.src.replace('/sprites/home/', '/sprites/dex/')
                          return
                        }
                        // Both HOME and DEX failed
                        setHasImageError(true)
                        setIsImageLoading(false)
                      }}
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
                      className={`calc-card__mega-toggle ${isMegaActive ? 'calc-card__mega-toggle--active' : ''}`}
                      type="button"
                      onClick={() => {
                        if (isMegaActive) {
                          // Switching BACK to base
                          const currentSp = gen.species.get(toID(speciesName))
                          if (currentSp?.baseSpecies) {
                            // Direct-search path: species itself is the mega (e.g. "Venusaur-Mega")
                            const baseSp = gen.species.get(toID(currentSp.baseSpecies))
                            onStateChange({ ...state, species: currentSp.baseSpecies, forme: null, item: undefined, ability: baseSp?.abilities?.['0'] || undefined })
                          } else {
                            // Toggle path: forme is set on base species
                            const baseSp = gen.species.get(toID(state.species))
                            onStateChange({ ...state, forme: null, item: undefined, ability: baseSp?.abilities?.['0'] || undefined })
                          }
                        } else {
                          // Switching TO mega — set ability to mega species default
                          const megaForme = availableMegaFormes[0]
                          const megaName = `${state.species}-${megaForme}`
                          const megaSp = gen.species.get(toID(megaName))
                          onStateChange({ ...state, forme: megaForme, ability: megaSp?.abilities?.['0'] || undefined })
                        }
                      }}
                      title={isMegaActive ? 'Switch to base form' : `Switch to ${availableMegaFormes[0]} form`}
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
                    slotId={slotId}
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
              inputId={`calc-nature-${slotId}`}
              value={state.nature}
              onChange={(nature: string) => onStateChange({ ...state, nature })}
            />
            <AbilitySelect
              species={state.species}
              value={state.ability}
              onChange={(ability: string | undefined) => onStateChange({ ...state, ability })}
              gen={gen}
              onFocus={handleAbilityFocus}
              onToggle={handleAbilityToggle}
              isOpen={activeOverlay === 'ability'}
              query={abilitySearchQuery}
              onQueryChange={setAbilitySearchQuery}
            />
            <ItemSelect
              value={state.item}
              onChange={(item: string | undefined) => onStateChange({ ...state, item })}
              disabled={isMegaLocked}
              onFocus={handleItemFocus}
              onToggle={handleItemToggle}
              isOpen={activeOverlay === 'item'}
              query={itemSearchQuery}
              onQueryChange={setItemSearchQuery}
            />
          </div>

          {/* Stats or overlay (MoveList / AbilityList / ItemList) */}
          {activeMoveSlot !== null ? (
            <MoveList
              slotIndex={activeMoveSlot}
              query={moveSearchQuery}
              learnset={learnset}
              isLoading={isLearnsetLoading}
              onSelect={handleMoveSelect}
              onClose={handleMoveListClose}
            />
          ) : activeOverlay === 'ability' ? (
            <AbilityList
              abilities={abilitiesForSpecies}
              selectedAbility={state.ability}
              onSelect={handleAbilitySelect}
              onClose={handleAbilityClose}
            />
          ) : activeOverlay === 'item' ? (
            <ItemList
              query={itemSearchQuery}
              selectedItem={state.item}
              disabled={isMegaLocked}
              onSelect={handleItemSelect}
              onClose={handleItemClose}
            />
          ) : (
            <>
              {/* Inline result display */}
              {result && (
                <div className="calc-card__result">
                  <span className="calc-card__result-range">
                    {result.damageRange[0].toFixed(1)} — {result.damageRange[1].toFixed(1)}%
                  </span>
                  <div className="calc-card__result-bar">
                    <div
                      className="calc-card__result-bar-fill"
                      style={{ width: `${Math.min(result.damageRange[1], 100)}%` }}
                    />
                  </div>
                  <span className="calc-card__result-ko">{result.koText}</span>
                </div>
              )}

              {stats && (
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
              )}
            </>
          )}
        </>
      )}
    </article>
  )
}
