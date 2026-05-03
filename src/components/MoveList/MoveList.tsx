/**
 * PokeCalc — MoveList Component
 * Scrollable overlay panel showing moves a Pokémon can learn, filterable by query.
 * Replaces the stats section when a move slot input is focused.
 * Uses @pkmn/dex for accurate move data (accuracy, PP, description) and
 * learnset filtering.
 */

import { useMemo } from 'react'
import physicalImg from '../../assets/physical.png'
import specialImg from '../../assets/special.png'
import statusImg from '../../assets/status.png'
import type { TypeName } from '../../types/pokemon'
import { TypeBadge } from '../TypeBadge/TypeBadge'
import { getMoveData, type LearnsetMap, type MoveDisplayData } from '../../data/move-data'
import { Spinner } from '../Spinner/Spinner'
import './MoveList.css'

/** PNG sprite images for move categories */
const CATEGORY_IMGS: Record<string, string> = {
  Physical: physicalImg,
  Special: specialImg,
  Status: statusImg,
}

interface MoveListProps {
  slotIndex: number
  query: string
  learnset: LearnsetMap | null
  isLoading: boolean
  onSelect: (slotIndex: number, moveName: string) => void
  onClose: () => void
}

export function MoveList({
  slotIndex,
  query,
  learnset,
  isLoading,
  onSelect,
  onClose,
}: MoveListProps) {
  // Filter moves by learnset + query
  const filtered = useMemo(() => {
    if (!learnset) return []

    const lower = query.toLowerCase()
    const results: MoveDisplayData[] = []

    for (const moveId of Object.keys(learnset)) {
      const moveData = getMoveData(moveId)
      if (!moveData) continue
      if (lower.length > 0 && !moveData.name.toLowerCase().includes(lower)) continue
      results.push(moveData)
    }

    // Sort alphabetically for consistent ordering
    results.sort((a, b) => a.name.localeCompare(b.name))

    return results.slice(0, 50)
  }, [learnset, query])

  // Handle Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className="move-list"
        role="dialog"
        aria-label={`Move selection for slot ${slotIndex + 1}`}
      >
        <div className="move-list__header">
          <span className="move-list__title">Select Move</span>
          <button
            className="move-list__close"
            type="button"
            onClick={onClose}
            aria-label="Close move list"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="move-list__loading">
          <Spinner size="small" />
          <span>Loading moves…</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="move-list"
      role="dialog"
      aria-label={`Move selection for slot ${slotIndex + 1}`}
      onKeyDown={handleKeyDown}
    >
      <div className="move-list__header">
        <span className="move-list__title">Select Move</span>
        <button
          className="move-list__close"
          type="button"
          onClick={onClose}
          aria-label="Close move list"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="move-list__table-wrapper">
        <table className="move-list__table">
          <thead>
            <tr>
              <th className="move-list__th move-list__th--name">Name</th>
              <th className="move-list__th move-list__th--type">Type</th>
              <th className="move-list__th move-list__th--category">Cat.</th>
              <th className="move-list__th move-list__th--bp">BP</th>
              <th className="move-list__th move-list__th--accuracy">Acc</th>
              <th className="move-list__th move-list__th--pp">PP</th>
              <th className="move-list__th move-list__th--desc">Description</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((move) => (
              <tr
                key={move.name}
                className="move-list__row"
                onClick={() => onSelect(slotIndex, move.name)}
                title={move.desc}
              >
                <td className="move-list__td move-list__td--name">{move.name}</td>
                <td className="move-list__td move-list__td--type">
                  <TypeBadge type={move.type as TypeName} />
                </td>
                <td className="move-list__td move-list__td--category">
                  <img
                    src={CATEGORY_IMGS[move.category] ?? statusImg}
                    alt={move.category}
                    className="move-list__category-img"
                  />
                </td>
                <td className="move-list__td move-list__td--bp">
                  {move.basePower !== null ? move.basePower : '—'}
                </td>
                <td className="move-list__td move-list__td--accuracy">
                  {move.accuracy !== null ? `${move.accuracy}` : '—'}
                </td>
                <td className="move-list__td move-list__td--pp">
                  {move.pp}
                </td>
                <td className="move-list__td move-list__td--desc" title={move.desc}>
                  {move.desc || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="move-list__empty">
          {learnset ? 'No moves found' : 'No moves available'}
        </p>
      )}
    </div>
  )
}
