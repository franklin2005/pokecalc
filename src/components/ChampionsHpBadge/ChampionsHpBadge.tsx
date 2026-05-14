/**
 * PokeCalc — ChampionsHpBadge Component
 * Inline SVG component that renders a Champions-style HP badge
 * with dynamic HP bar, Pokemon name, sprite, and item icon.
 */

import { useId } from 'react'
import { getItemSpriteUrl, handleItemSpriteError } from '../../data/item-sprite-urls'
import './ChampionsHpBadge.css'

interface ChampionsHpBadgeProps {
  slotId: 'left' | 'right'
  pokemonName: string | null
  spriteUrl: string | null
  itemName?: string
  maxHp: number
  damageRange: [number, number] | null
}

export function ChampionsHpBadge({
  slotId,
  pokemonName,
  spriteUrl,
  itemName,
  maxHp,
  damageRange,
}: ChampionsHpBadgeProps) {
  // Return null if no Pokemon or no HP
  if (pokemonName === null || maxHp === 0) {
    return null
  }

  const id = useId()
  const prefix = `champions-hp-badge-${id}`

  // Compute remaining HP based on average damage
  const damageAvg = damageRange ? (damageRange[0] + damageRange[1]) / 2 : 0
  const remainingHp = Math.max(0, maxHp - Math.round(damageAvg))
  const hpPercentage = Math.max(0, Math.min(100, (remainingHp / maxHp) * 100))

  // Compute HP bar fill X coordinate based on percentage
  const fillX = 154 + (273 * hpPercentage) / 100
  const hpBarPath = `M 166,105 L ${fillX + 12},105 L ${fillX},141 L 154,141 Z`

  return (
    <div className="champions-hp-badge">
      <svg
        className="champions-hp-badge__svg"
        viewBox="-22 0 500 161"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Left blue radial gradient */}
          <radialGradient
            id={`${prefix}-bg-left`}
            gradientUnits="userSpaceOnUse"
            cx="450"
            cy="150"
            r="500"
          >
            <stop offset="0%" stopColor="#1b25a3" />
            <stop offset="100%" stopColor="#9b8dfc" />
          </radialGradient>

          {/* Right pink radial gradient */}
          <radialGradient
            id={`${prefix}-bg-right`}
            gradientUnits="userSpaceOnUse"
            cx="450"
            cy="150"
            r="500"
          >
            <stop offset="0%" stopColor="#960532" />
            <stop offset="100%" stopColor="#ff3b8a" />
          </radialGradient>

          {/* HP bar clip path */}
          <clipPath id={`${prefix}-hpBarClip`}>
            <path d="M 166,105 L 438,105 L 427,141 L 154,141 Z" />
          </clipPath>

          {/* HUD clip path (for inner border and item icon clipping) */}
          <clipPath id={`${prefix}-hudClip`}>
            <path d="M 85,25 L 460,25 C 472,25 478,28 475,38 L 460,84 C 458,90 450,92 445,92 L 152,92 L 143,125 C 139,135 123,150 110,150 C 105,150 55,150 22,150 C 14,150 10,146 10,138 L 43.9,44.75 C 50,30 65,25 85,25 Z" />
          </clipPath>

          {/* Green gradient for HP > 50% */}
          <linearGradient
            id={`${prefix}-hpGreen`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="105"
            x2="0"
            y2="141"
          >
            <stop offset="0%" stopColor="#00FB44" />
            <stop offset="100%" stopColor="#FDFD5C" />
          </linearGradient>

          {/* Yellow gradient for HP 20-50% */}
          <linearGradient
            id={`${prefix}-hpYellow`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="105"
            x2="0"
            y2="141"
          >
            <stop offset="0%" stopColor="#FFC229" />
            <stop offset="100%" stopColor="#FFF33E" />
          </linearGradient>

          {/* Red gradient for HP < 20% */}
          <linearGradient
            id={`${prefix}-hpRed`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="105"
            x2="0"
            y2="141"
          >
            <stop offset="0%" stopColor="#FF2C4D" />
            <stop offset="100%" stopColor="#CE665C" />
          </linearGradient>

          {/* Drop shadow filter */}
          <filter id={`${prefix}-shadow`} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
            <feOffset dx="0" dy="1.5" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* HUD background path */}
        <path
          d="M 85,25 L 460,25 C 472,25 478,28 475,38 L 460,84 C 458,90 450,92 445,92 L 152,92 L 143,125 C 139,135 123,150 110,150 C 105,150 55,150 22,150 C 14,150 10,146 10,138 L 43.9,44.75 C 50,30 65,25 85,25 Z"
          fill={slotId === 'left' ? `url(#${prefix}-bg-left)` : `url(#${prefix}-bg-right)`}
          stroke="white"
          strokeWidth="7.8"
          strokeLinejoin="round"
          filter={`url(#${prefix}-shadow)`}
        />

        {/* Dark inner border */}
        <path
          d="M 85,25 L 460,25 C 472,25 478,28 475,38 L 460,84 C 458,90 450,92 445,92 L 152,92 L 143,125 C 139,135 123,150 110,150 C 105,150 55,150 22,150 C 14,150 10,146 10,138 L 43.9,44.75 C 50,30 65,25 85,25 Z"
          fill="none"
          stroke="#263130"
          strokeWidth="12.5"
          strokeLinejoin="round"
          clipPath={`url(#${prefix}-hudClip)`}
        />

        {/* Item icon area and image (conditional) — uses foreignObject
            so the HTML <img> onError fallback chain works properly */}
        {itemName && (
          <>
            <path
              d="M 425,20 L 485,20 L 465,105 L 394,105 Z"
              fill="#263130"
              clipPath={`url(#${prefix}-hudClip)`}
            />
            <foreignObject
              x="411"
              y="31"
              width="56"
              height="56"
              clipPath={`url(#${prefix}-hudClip)`}
            >
              <img
                src={getItemSpriteUrl(itemName)}
                onError={handleItemSpriteError(itemName)}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </foreignObject>
          </>
        )}

        {/* HP bar background */}
        <path
          d="M 166,105 L 438,105 L 427,141 L 154,141 Z"
          fill="rgba(0,0,0,0.35)"
        />

        {/* HP bar fill */}
        <path
          d={hpBarPath}
          fill={
            damageRange
              ? hpPercentage > 50
                ? `url(#${prefix}-hpGreen)`
                : hpPercentage > 20
                  ? `url(#${prefix}-hpYellow)`
                  : `url(#${prefix}-hpRed)`
              : `url(#${prefix}-hpGreen)`
          }
          clipPath={`url(#${prefix}-hpBarClip)`}
        />

        {/* Pokemon name */}
        <text
          x="141"
          y="70"
          fontFamily="Arial Black, sans-serif"
          fontWeight="900"
          fontSize="34"
          fontStyle="italic"
          fill="white"
          transform="translate(141, 70) skewX(-8) translate(-141, -70)"
        >
          {pokemonName}
        </text>

        {/* Remaining HP */}
        <text
          x="360"
          y="153"
          textAnchor="end"
          fontFamily="Arial Black, sans-serif"
          fontWeight="900"
          fontSize="45"
          fontStyle="italic"
          fill="white"
          stroke="#0e115e"
          strokeWidth="5"
          paintOrder="stroke"
          transform="translate(368, 153) skewX(-8) translate(-367, -153)"
        >
          {remainingHp}
        </text>

        {/* Max HP */}
        <text
          x="427"
          y="153"
          textAnchor="end"
          fontFamily="Arial Black, sans-serif"
          fontWeight="900"
          fontSize="30"
          fontStyle="italic"
          fill="white"
          stroke="#0e115e"
          strokeWidth="5"
          paintOrder="stroke"
          transform="translate(420, 153) skewX(-8) translate(-420, -153)"
        >
          /{maxHp}
        </text>

        {/* Pokemon sprite (conditional) */}
        {spriteUrl && (
          <image
            href={spriteUrl}
            x="10"
            y="22"
            width="132"
            height="132"
            preserveAspectRatio="xMidYMid meet"
          />
        )}
      </svg>
    </div>
  )
}
