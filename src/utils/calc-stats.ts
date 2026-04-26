/**
 * PokeCalc — Stat Calculation Utilities
 * Computes final stats from base stats, EVs, IVs, nature, and level.
 * Champions mode: Level 50, IVs always 31.
 */

import type { StatName, EVs } from '../types/calc'
import { CHAMPIONS_IV, CHAMPIONS_LEVEL } from '../types/calc'
import type { BaseStats, Stats } from '../types/pokemon'
import { getNature } from '../data/natures'

/**
 * Calculate a single stat value.
 * HP uses a different formula than other stats.
 */
function calcStat(
  base: number,
  ev: number,
  iv: number,
  level: number,
  natureModifier: number,
  isHP: boolean
): number {
  if (isHP) {
    // HP = floor((2 * Base + IV + floor(EV/4) + 100) * Level / 100) + 10
    return Math.floor((2 * base + iv + Math.floor(ev / 4) + 100) * level / 100) + 10
  }

  // Other = (floor((2 * Base + IV + floor(EV/4)) * Level / 100 + 5)) * NatureModifier
  const raw = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + 5
  return Math.floor(raw * natureModifier)
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
 * Compute all six stats from base stats, EVs, nature, and level.
 */
export function computeStats(
  baseStats: BaseStats,
  evs: EVs,
  nature: string,
  level: number = CHAMPIONS_LEVEL,
  ivs: number = CHAMPIONS_IV
): Stats {
  const stats: StatName[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']
  const result = {} as Stats

  for (const stat of stats) {
    const modifier = stat === 'hp' ? 1.0 : getNatureModifier(stat, nature)
    result[stat] = calcStat(baseStats[stat], evs[stat], ivs, level, modifier, stat === 'hp')
  }

  return result
}

/**
 * Compute the theoretical maximum stat value for a stat bar's maxValue.
 * Uses max EVs (252), max IVs (31), beneficial nature, level 100.
 * For Champions, we use a reasonable max based on the highest base stat possible.
 */
export function getMaxStatValue(stat: StatName, baseStat: number): number {
  // Calculate with max competitive values for scaling
  const maxEV = 252
  const maxIV = 31
  const level = 100
  const natureMod = stat === 'hp' ? 1.0 : 1.1

  return calcStat(baseStat, maxEV, maxIV, level, natureMod, stat === 'hp')
}

/**
 * Get a reasonable max value for stat bar scaling.
 * Uses the highest known base stat for each stat category as reference.
 */
const MAX_BASE_STATS: Record<StatName, number> = {
  hp: 255,    // Blissey
  atk: 190,   // Kartana
  def: 230,   // Shuckle
  spa: 194,   // Calyrex-Shadow (but using ~180 as reasonable max)
  spd: 230,   // Shuckle
  spe: 200,   // Regieleki
}

/**
 * Get the maximum possible stat value for a given stat category.
 * Used as the maxValue for stat bar scaling.
 */
export function getStatBarMax(stat: StatName): number {
  const maxBase = MAX_BASE_STATS[stat]
  return calcStat(maxBase, 252, 31, 100, stat === 'hp' ? 1.0 : 1.1, stat === 'hp')
}
