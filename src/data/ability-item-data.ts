/**
 * PokeCalc — Ability & Item Data Access Layer
 * Uses @pkmn/dex to provide ability and item descriptions.
 */

import { ModdedDex } from '@pkmn/dex'

const dex = new ModdedDex('gen9')

/**
 * Get short description for an ability.
 * Returns empty string if not found.
 */
export function getAbilityDesc(abilityName: string): string {
  const ability = dex.abilities.get(abilityName)
  return ability?.shortDesc || ability?.desc || ''
}

/**
 * Get short description for an item.
 * Returns empty string if not found.
 */
export function getItemDesc(itemName: string): string {
  const item = dex.items.get(itemName)
  return item?.shortDesc || item?.desc || ''
}
