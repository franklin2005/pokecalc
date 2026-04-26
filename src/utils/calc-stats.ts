/**
 * PokeCalc — Stat Calculation Utilities
 * Computes final stats using Champions Stat Points (SPs).
 * Champions mode: Level 50, IVs always 31.
 *
 * In Champions, SPs are added BEFORE the nature modifier:
 * - Non-HP: floor(floor((2 * Base + IV) * Level / 100 + 5 + SPs) * Nature)
 * - HP:      floor((2 * Base + IV + 100) * Level / 100) + 10 + SPs
 */

import type { StatName, StatPoints } from '../types/calc'
import { CHAMPIONS_IV, CHAMPIONS_LEVEL } from '../types/calc'
import type { BaseStats, Stats } from '../types/pokemon'
import { getNature } from '../data/natures'

/**
 * Calculate a single stat value for Champions mode.
 * SPs are added BEFORE the nature modifier, so nature also scales the SP contribution.
 *
 * - Non-HP: floor(floor((2 * Base + IV) * Level / 100 + 5 + SPs) * Nature)
 * - HP:      floor((2 * Base + IV + 100) * Level / 100) + 10 + SPs
 */
export function calcStatChampions(
  base: number,
  sp: number,
  iv: number,
  level: number,
  natureModifier: number,
  isHP: boolean
): number {
  if (isHP) {
    // HP = floor((2 * Base + IV + 100) * Level / 100) + 10 + SPs
    return Math.floor((2 * base + iv + 100) * level / 100) + 10 + sp
  }

  // Non-HP = floor(floor((2 * Base + IV) * Level / 100 + 5 + SPs) * Nature)
  const rawWithSPs = Math.floor((2 * base + iv) * level / 100) + 5 + sp
  return Math.floor(rawWithSPs * natureModifier)
}

/**
 * Convert Champions Stat Points to equivalent EVs for @smogon/calc.
 *
 * Why this is needed: SPs are added AFTER the level multiplier but BEFORE nature
 * in the Champions formula, while EVs are added INSIDE the level multiplier in
 * @smogon/calc. A naive SPs×4 conversion produces wrong stats for non-neutral
 * natures (and even for neutral at high base stats).
 *
 * Algorithm: For each stat, compute the Champions target T, then brute-force
 * search EVs from 0 to 252 (step 4) to find which EV produces the same T
 * when passed through @smogon/calc's standard stat formula.
 */
export function spToEV(
  sps: StatPoints,
  baseStats: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number },
  nature: string
): { hp: number; atk: number; def: number; spa: number; spd: number; spe: number } {
  const stats: (keyof StatPoints)[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']
  const result = {} as { hp: number; atk: number; def: number; spa: number; spd: number; spe: number }

  for (const stat of stats) {
    const sp = sps[stat]
    const base = baseStats[stat]

    // Step 1: Compute Champions target stat T
    const natureMod = stat === 'hp' ? 1.0 : getNatureModifier(stat, nature)
    const target = calcStatChampions(base, sp, CHAMPIONS_IV, CHAMPIONS_LEVEL, natureMod, stat === 'hp')

    // Step 2: Brute-force search EVs 0..252 (step 4) for matching stat
    let foundEV = sp * 4 // fallback
    for (let ev = 0; ev <= 252; ev += 4) {
      const n = ev / 4 // floor(EV/4) since EV is always multiple of 4
      let computed: number
      if (stat === 'hp') {
        // @smogon/calc HP: floor((2*base + IV + n + 100) * level/100) + 10
        computed = Math.floor((2 * base + CHAMPIONS_IV + n + 100) * CHAMPIONS_LEVEL / 100) + 10
      } else {
        // @smogon/calc non-HP: floor(floor((2*base + IV + n) * level/100 + 5) * natureMod)
        const raw = Math.floor((2 * base + CHAMPIONS_IV + n) * CHAMPIONS_LEVEL / 100) + 5
        computed = Math.floor(raw * natureMod)
      }
      if (computed === target) {
        foundEV = ev
        break
      }
    }

    result[stat] = foundEV
  }

  return result
}

/**
 * Get the nature modifier for a given stat.
 */
function getNatureModifier(stat: StatName, natureName: string): number {
  const nature = getNature(natureName)
  if (!nature) return 1.0
  if (nature.plus === nature.minus) return 1.0 // Neutral
  if (nature.plus === stat) return 1.1
  if (nature.minus === stat) return 0.9
  return 1.0
}

/**
 * Get the nature effect label for a stat: 'boosted', 'hindered', or 'neutral'.
 */
export function getNatureEffect(
  stat: StatName,
  natureName: string
): 'boosted' | 'hindered' | 'neutral' {
  if (stat === 'hp') return 'neutral'
  const nature = getNature(natureName)
  if (!nature) return 'neutral'
  if (nature.plus === nature.minus) return 'neutral'
  if (nature.plus === stat) return 'boosted'
  if (nature.minus === stat) return 'hindered'
  return 'neutral'
}

/**
 * Compute all six stats from base stats, SPs, nature, and level.
 * Champions formula: SPs are added before nature modifier.
 */
export function computeStats(
  baseStats: BaseStats,
  sps: StatPoints,
  nature: string,
  level: number = CHAMPIONS_LEVEL,
  ivs: number = CHAMPIONS_IV
): Stats {
  const stats: StatName[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']
  const result = {} as Stats

  for (const stat of stats) {
    const modifier = stat === 'hp' ? 1.0 : getNatureModifier(stat, nature)
    result[stat] = calcStatChampions(baseStats[stat], sps[stat], ivs, level, modifier, stat === 'hp')
  }

  return result
}

/**
 * Maximum known base stats per category for stat bar scaling.
 */
const MAX_BASE_STATS: Record<StatName, number> = {
  hp: 255,    // Blissey
  atk: 190,   // Kartana
  def: 230,   // Shuckle
  spa: 194,   // Calyrex-Shadow
  spd: 230,   // Shuckle
  spe: 200,   // Regieleki
}

/**
 * Get the maximum possible stat value for a given stat category.
 * Used as the maxValue for stat bar scaling.
 */
export function getStatBarMax(stat: StatName): number {
  const maxBase = MAX_BASE_STATS[stat]
  const maxSP = 32
  const natureMod = stat === 'hp' ? 1.0 : 1.1
  return calcStatChampions(maxBase, maxSP, 31, 50, natureMod, stat === 'hp')
}