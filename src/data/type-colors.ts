/**
 * PokeCalc — Type Colors
 * Maps each of the 18 Pokémon types to background and text colors.
 * Values match the CSS custom properties in tokens.css.
 */

import type { TypeName } from '../types/pokemon'

export interface TypeColor {
  bg: string
  text: string
}

export const TYPE_COLORS: Record<TypeName, TypeColor> = {
  Normal: { bg: 'rgba(163, 163, 163, 0.1)', text: '#737373' },
  Fire: { bg: 'rgba(249, 115, 22, 0.1)', text: '#ea580c' },
  Water: { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb' },
  Grass: { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a' },
  Electric: { bg: 'rgba(250, 204, 21, 0.1)', text: '#ca8a04' },
  Ice: { bg: 'rgba(34, 211, 238, 0.1)', text: '#0891b2' },
  Fighting: { bg: 'rgba(220, 38, 38, 0.1)', text: '#b91c1c' },
  Poison: { bg: 'rgba(168, 85, 247, 0.1)', text: '#9333ea' },
  Ground: { bg: 'rgba(217, 119, 6, 0.1)', text: '#92400e' },
  Flying: { bg: 'rgba(147, 197, 253, 0.1)', text: '#2563eb' },
  Psychic: { bg: 'rgba(168, 85, 247, 0.1)', text: '#9333ea' },
  Bug: { bg: 'rgba(101, 163, 13, 0.1)', text: '#4d7c0f' },
  Rock: { bg: 'rgba(120, 113, 108, 0.1)', text: '#57534e' },
  Ghost: { bg: 'rgba(126, 34, 206, 0.1)', text: '#6b21a8' },
  Dragon: { bg: 'rgba(99, 102, 241, 0.1)', text: '#4f46e5' },
  Dark: { bg: 'rgba(68, 64, 60, 0.1)', text: '#292524' },
  Steel: { bg: 'rgba(148, 163, 184, 0.1)', text: '#64748b' },
  Fairy: { bg: 'rgba(236, 72, 153, 0.1)', text: '#db2777' },
}

/** All 18 type names as a constant array */
export const ALL_TYPES: TypeName[] = Object.keys(TYPE_COLORS) as TypeName[]

/**
 * Get the color for a type. Returns Normal as fallback for unknown types.
 */
export function getTypeColor(type: string): TypeColor {
  return TYPE_COLORS[type as TypeName] ?? TYPE_COLORS.Normal
}
