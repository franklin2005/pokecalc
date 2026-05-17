/**
 * PokeCalc — SpeciesList Component
 * Table-style overlay showing filtered Pokémon species with sprites,
 * abilities, and full base stat spread with BST total.
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import { Generations, toID } from '@smogon/calc'
import { getSpriteUrl, getDexSpriteUrl } from '../../data/species-to-id'
import { getSpeciesAbilities } from '../../data/species-abilities'
import './SpeciesList.css'

type Generation = ReturnType<typeof Generations.get>
type Specie = NonNullable<ReturnType<Generation['species']['get']>>

interface SpeciesListProps {
  speciesList: Specie[]
  selectedValue: string | null
  onSelect: (name: string) => void
  onClose: () => void
}

const STAT_LABELS = ['HP', 'ATK', 'DEF', 'SpA', 'SpD', 'Spe'] as const

export function SpeciesList({
  speciesList,
  selectedValue,
  onSelect,
  onClose,
}: SpeciesListProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [brokenSprites, setBrokenSprites] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const items = useMemo(() => {
    return speciesList.map((sp) => {
      const bs = sp.baseStats
      const stats = bs ? [bs.hp, bs.atk, bs.def, bs.spa, bs.spd, bs.spe] : []
      const bst = stats.length === 6 ? stats.reduce((a, b) => a + b, 0) : 0
      const allAbilities = getSpeciesAbilities(toID(sp.name))
      // Last entry is always hidden when there are 2+ abilities
      const commonAbilities = allAbilities.length > 1 ? allAbilities.slice(0, -1) : allAbilities
      const hiddenAbility = allAbilities.length > 1 ? allAbilities[allAbilities.length - 1] : ''
      const spriteUrl = getSpriteUrl(sp.name)
      const dexSpriteUrl = getDexSpriteUrl(sp.name)
      return { name: sp.name, stats, bst, commonAbilities, hiddenAbility, spriteUrl, dexSpriteUrl }
    })
  }, [speciesList])

  // Handle Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((prev) => {
        const next = prev + 1
        return next >= items.length ? 0 : next
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((prev) => {
        const next = prev - 1
        return next < 0 ? items.length - 1 : next
      })
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault()
      const item = items[focusedIndex]
      if (item) {
        onSelect(item.name)
      }
    }
  }

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.scrollIntoView?.({ block: 'nearest' })
    }
  }, [focusedIndex])

  // Auto-focus first item when list opens
  useEffect(() => {
    if (items.length > 0) {
      setFocusedIndex(0)
    }
  }, [items.length])

  const handleItemMouseDown = (name: string) => {
    onSelect(name)
  }

  const handleItemMouseEnter = (index: number) => {
    setFocusedIndex(index)
  }

  const handleSpriteError = (spriteUrl: string) => {
    setBrokenSprites((prev) => {
      const next = new Set(prev)
      next.add(spriteUrl)
      return next
    })
  }

  return (
    <div
      className="species-list"
      role="dialog"
      aria-label="Pokémon selection"
      onKeyDown={handleKeyDown}
      ref={containerRef}
    >
      <div className="species-list__header">
        <h3 className="species-list__title">Select Pokémon</h3>
        <button
          className="species-list__close"
          type="button"
          onClick={onClose}
          aria-label="Close species list"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="species-list__table-header" aria-hidden="true">
        <span className="species-list__col--sprite"></span>
        <span className="species-list__col--name">Name</span>
        <span className="species-list__col--abilities">Abilities</span>
        <span className="species-list__col--hidden">Hidden</span>
        {STAT_LABELS.map((label) => (
          <span key={label} className="species-list__col--stat">{label}</span>
        ))}
        <span className="species-list__col--bst">BST</span>
      </div>

      <div className="species-list__scroll" role="listbox" aria-label="Species list">
        {items.length === 0 ? (
          <p className="species-list__empty">No Pokémon found</p>
        ) : (
          items.map((item, index) => (
            <li
              key={item.name}
              ref={(el) => { itemRefs.current[index] = el }}
              className={`species-list__item${item.name === selectedValue ? ' species-list__item--selected' : ''}${index === focusedIndex ? ' species-list__item--focused' : ''}`}
              role="option"
              aria-selected={item.name === selectedValue}
              tabIndex={index === focusedIndex ? 0 : -1}
              onMouseDown={(e) => {
                e.preventDefault()
                handleItemMouseDown(item.name)
              }}
              onMouseEnter={() => handleItemMouseEnter(index)}
            >
              <div className="species-list__col--sprite">
                {item.spriteUrl && !brokenSprites.has(item.spriteUrl) && (
                  <img
                    className="species-list__sprite"
                    src={item.spriteUrl}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    onError={() => handleSpriteError(item.spriteUrl!)}
                  />
                )}
                {brokenSprites.has(item.spriteUrl!) && item.dexSpriteUrl && !brokenSprites.has(item.dexSpriteUrl) && (
                  <img
                    className="species-list__sprite"
                    src={item.dexSpriteUrl}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    onError={() => handleSpriteError(item.dexSpriteUrl!)}
                  />
                )}
                {((brokenSprites.has(item.spriteUrl!) && brokenSprites.has(item.dexSpriteUrl!)) ||
                  (!item.spriteUrl)) && (
                  <span className="species-list__sprite-placeholder" aria-hidden="true">?</span>
                )}
              </div>
              <span className="species-list__col--name">{item.name}</span>
              <div className="species-list__col--abilities">
                {item.commonAbilities.map((a) => (
                  <span key={a}>{a}</span>
                ))}
              </div>
              <span className="species-list__col--hidden">
                {item.hiddenAbility || '\u2014'}
              </span>
              {item.stats.length === 6 ? (
                item.stats.map((s, i) => (
                  <span key={i} className="species-list__col--stat">{s}</span>
                ))
              ) : (
                STAT_LABELS.map((_, i) => (
                  <span key={i} className="species-list__col--stat">{'\u2014'}</span>
                ))
              )}
              <span className="species-list__col--bst">{item.bst}</span>
            </li>
          ))
        )}
      </div>
    </div>
  )
}
