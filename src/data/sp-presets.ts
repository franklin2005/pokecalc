/**
 * PokeCalc — Stat Point Presets
 * Common SP spreads for Pokémon Champions mode.
 * Champions constraints: max 32 per stat, total ≤ 66.
 */

import type { StatPoints } from '../types/calc'
import { CHAMPIONS_SP_MAX_PER_STAT, CHAMPIONS_SP_TOTAL_MAX } from '../types/calc'

export interface SPPreset {
  name: string
  sps: StatPoints
}

/**
 * Common Stat Point spreads used in Champions mode.
 * All presets respect Champions constraints (≤32/stat, total ≤66).
 */
export const SP_PRESETS: SPPreset[] = [
  // --- Physical Attackers ---
  { name: 'Max Speed + Max Attack', sps: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 } },
  { name: 'Max Attack + Bulk', sps: { hp: 16, atk: 32, def: 0, spa: 0, spd: 2, spe: 16 } },
  { name: 'Bulky Physical Attacker', sps: { hp: 32, atk: 32, def: 0, spa: 0, spd: 2, spe: 0 } },

  // --- Special Attackers ---
  { name: 'Max Speed + Max SpA', sps: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 } },
  { name: 'Max SpA + Bulk', sps: { hp: 16, atk: 0, def: 0, spa: 32, spd: 2, spe: 16 } },
  { name: 'Bulky Special Attacker', sps: { hp: 32, atk: 0, def: 0, spa: 32, spd: 2, spe: 0 } },

  // --- Mixed Attackers ---
  { name: 'Mixed Attacker', sps: { hp: 2, atk: 16, def: 0, spa: 16, spd: 0, spe: 32 } },
  { name: 'Mixed + Speed Control', sps: { hp: 2, atk: 16, def: 0, spa: 16, spd: 0, spe: 16 } },

  // --- Defensive / Utility ---
  { name: 'Physical Wall', sps: { hp: 32, atk: 0, def: 32, spa: 0, spd: 2, spe: 0 } },
  { name: 'Special Wall', sps: { hp: 32, atk: 0, def: 2, spa: 0, spd: 32, spe: 0 } },
  { name: 'Mixed Wall', sps: { hp: 32, atk: 0, def: 16, spa: 0, spd: 16, spe: 2 } },
  { name: 'Fast Utility', sps: { hp: 16, atk: 0, def: 16, spa: 0, spd: 2, spe: 32 } },

  // --- Speed-focused ---
  { name: 'Max Speed + HP', sps: { hp: 32, atk: 0, def: 0, spa: 0, spd: 2, spe: 32 } },
  { name: 'Speed + SpD', sps: { hp: 2, atk: 0, def: 0, spa: 0, spd: 32, spe: 32 } },
  { name: 'Speed + Def', sps: { hp: 2, atk: 0, def: 32, spa: 0, spd: 0, spe: 32 } },

  // --- HP-focused ---
  { name: 'Max HP + Def', sps: { hp: 32, atk: 0, def: 32, spa: 0, spd: 2, spe: 0 } },
  { name: 'Max HP + SpD', sps: { hp: 32, atk: 0, def: 2, spa: 0, spd: 32, spe: 0 } },

  // --- Tricky / Niche ---
  { name: 'Trick Room', sps: { hp: 32, atk: 32, def: 0, spa: 0, spd: 2, spe: 0 } },
  { name: 'Special Trick Room', sps: { hp: 32, atk: 0, def: 0, spa: 32, spd: 2, spe: 0 } },
  { name: 'Balanced', sps: { hp: 10, atk: 10, def: 10, spa: 10, spd: 10, spe: 16 } },
]

/**
 * Validate that a Stat Point distribution respects Champions constraints.
 */
export function isValidChampionsSPs(sps: StatPoints): boolean {
  const stats: (keyof StatPoints)[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']
  let total = 0
  for (const stat of stats) {
    if (sps[stat] < 0 || sps[stat] > CHAMPIONS_SP_MAX_PER_STAT) return false
    total += sps[stat]
  }
  return total <= CHAMPIONS_SP_TOTAL_MAX
}

/**
 * Get the total Stat Points in a distribution.
 */
export function totalSPs(sps: StatPoints): number {
  return sps.hp + sps.atk + sps.def + sps.spa + sps.spd + sps.spe
}