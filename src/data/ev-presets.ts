/**
 * PokeCalc — EV Presets
 * Common EV spreads for Pokémon Champions mode.
 * Champions constraints: max 32 per stat, total ≤ 66.
 */

import type { EVs } from '../types/calc'
import { CHAMPIONS_EV_MAX_PER_STAT, CHAMPIONS_EV_TOTAL_MAX } from '../types/calc'

export interface EVPreset {
  name: string
  evs: EVs
}

/**
 * Common EV spreads used in Champions mode.
 * All presets respect Champions constraints (≤32/stat, total ≤66).
 */
export const EV_PRESETS: EVPreset[] = [
  // --- Physical Attackers ---
  {
    name: 'Max Speed + Max Attack',
    evs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },
  {
    name: 'Max Attack + Bulk',
    evs: { hp: 16, atk: 32, def: 0, spa: 0, spd: 2, spe: 16 },
  },
  {
    name: 'Bulky Physical Attacker',
    evs: { hp: 32, atk: 32, def: 0, spa: 0, spd: 2, spe: 0 },
  },

  // --- Special Attackers ---
  {
    name: 'Max Speed + Max SpA',
    evs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
  },
  {
    name: 'Max SpA + Bulk',
    evs: { hp: 16, atk: 0, def: 0, spa: 32, spd: 2, spe: 16 },
  },
  {
    name: 'Bulky Special Attacker',
    evs: { hp: 32, atk: 0, def: 0, spa: 32, spd: 2, spe: 0 },
  },

  // --- Mixed Attackers ---
  {
    name: 'Mixed Attacker',
    evs: { hp: 2, atk: 16, def: 0, spa: 16, spd: 0, spe: 32 },
  },
  {
    name: 'Mixed + Speed Control',
    evs: { hp: 2, atk: 16, def: 0, spa: 16, spd: 0, spe: 16 },
  },

  // --- Defensive / Utility ---
  {
    name: 'Physical Wall',
    evs: { hp: 32, atk: 0, def: 32, spa: 0, spd: 2, spe: 0 },
  },
  {
    name: 'Special Wall',
    evs: { hp: 32, atk: 0, def: 2, spa: 0, spd: 32, spe: 0 },
  },
  {
    name: 'Mixed Wall',
    evs: { hp: 32, atk: 0, def: 16, spa: 0, spd: 16, spe: 2 },
  },
  {
    name: 'Fast Utility',
    evs: { hp: 16, atk: 0, def: 16, spa: 0, spd: 2, spe: 32 },
  },

  // --- Speed-focused ---
  {
    name: 'Max Speed + HP',
    evs: { hp: 32, atk: 0, def: 0, spa: 0, spd: 2, spe: 32 },
  },
  {
    name: 'Speed + SpD',
    evs: { hp: 2, atk: 0, def: 0, spa: 0, spd: 32, spe: 32 },
  },
  {
    name: 'Speed + Def',
    evs: { hp: 2, atk: 0, def: 32, spa: 0, spd: 0, spe: 32 },
  },

  // --- HP-focused ---
  {
    name: 'Max HP + Def',
    evs: { hp: 32, atk: 0, def: 32, spa: 0, spd: 2, spe: 0 },
  },
  {
    name: 'Max HP + SpD',
    evs: { hp: 32, atk: 0, def: 2, spa: 0, spd: 32, spe: 0 },
  },

  // --- Tricky / Niche ---
  {
    name: 'Trick Room',
    evs: { hp: 32, atk: 32, def: 0, spa: 0, spd: 2, spe: 0 },
  },
  {
    name: 'Special Trick Room',
    evs: { hp: 32, atk: 0, def: 0, spa: 32, spd: 2, spe: 0 },
  },
  {
    name: 'Balanced',
    evs: { hp: 10, atk: 10, def: 10, spa: 10, spd: 10, spe: 16 },
  },
]

/**
 * Validate that an EV distribution respects Champions constraints.
 */
export function isValidChampionsEVs(evs: EVs): boolean {
  const stats: (keyof EVs)[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']
  let total = 0
  for (const stat of stats) {
    if (evs[stat] < 0 || evs[stat] > CHAMPIONS_EV_MAX_PER_STAT) return false
    total += evs[stat]
  }
  return total <= CHAMPIONS_EV_TOTAL_MAX
}

/**
 * Get the total EVs in a distribution.
 */
export function totalEVs(evs: EVs): number {
  return evs.hp + evs.atk + evs.def + evs.spa + evs.spd + evs.spe
}
