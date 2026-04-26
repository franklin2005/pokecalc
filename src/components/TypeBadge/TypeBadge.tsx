/**
 * PokeCalc — TypeBadge Component
 * Renders a pill-shaped badge for a Pokémon type.
 */

import type { TypeName } from '../../types/pokemon'
import { TYPE_COLORS } from '../../data/type-colors'
import './TypeBadge.css'

interface TypeBadgeProps {
  type: TypeName
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const colors = TYPE_COLORS[type] ?? TYPE_COLORS.Normal

  return (
    <span
      className="type-badge"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {type}
    </span>
  )
}
