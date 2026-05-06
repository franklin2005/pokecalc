/**
 * PokeCalc — TypeBadge Component
 * Renders a type badge image from bundled assets.
 */

import type { TypeName } from '../../types/pokemon'
import { getTypeBadgeSrc } from '../../data/type-badge-urls'
import './TypeBadge.css'

interface TypeBadgeProps {
  type: TypeName
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <img
      className="type-badge"
      src={getTypeBadgeSrc(type)}
      alt={type}
      title={type}
    />
  )
}
