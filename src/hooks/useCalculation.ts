/**
 * PokeCalc — useCalculation Hook
 * Wraps @smogon/calc's calculate() function to produce damage results
 * from the current attacker, defender, move, and field state.
 */

import { useMemo } from 'react'
import { calculate, Pokemon, Move, Field } from '@smogon/calc'
import type { Generations, Result } from '@smogon/calc'
import type { CalcCardState, FieldState, CalcResult } from '../types/calc'
import { CHAMPIONS_IV, CHAMPIONS_LEVEL } from '../types/calc'

type Generation = ReturnType<typeof Generations.get>

/**
 * Determine effectiveness from the raw calc result.
 * Uses the type effectiveness multiplier from the result.
 */
function getEffectiveness(result: Result): CalcResult['effectiveness'] {
  // The calc result provides type effectiveness info through the description
  // or we can check the damage multiplier relative to neutral
  const desc = result.desc()

  if (desc.includes('super effective') || desc.includes('Super Effective')) {
    return 'super-effective'
  }
  if (desc.includes('not very effective') || desc.includes('Not Very Effective')) {
    return 'not-very-effective'
  }

  // Fallback: check the raw damage range relative to defender HP
  // If the range is very low, it might be resisted
  // This is a heuristic — the desc() method is more reliable
  return 'neutral'
}

/**
 * Build a Pokemon object for the calculator.
 */
function buildPokemon(
  gen: Generation,
  state: CalcCardState
): Pokemon {
  const speciesName = state.forme ? `${state.species}-${state.forme}` : state.species

  return new Pokemon(gen, speciesName!, {
    level: CHAMPIONS_LEVEL,
    ivs: {
      hp: CHAMPIONS_IV,
      atk: CHAMPIONS_IV,
      def: CHAMPIONS_IV,
      spa: CHAMPIONS_IV,
      spd: CHAMPIONS_IV,
      spe: CHAMPIONS_IV,
    },
    evs: {
      hp: state.evs.hp,
      atk: state.evs.atk,
      def: state.evs.def,
      spa: state.evs.spa,
      spd: state.evs.spd,
      spe: state.evs.spe,
    },
    nature: state.nature,
    item: state.item || undefined,
    ability: state.ability || undefined,
  })
}

/**
 * Build a Field object for the calculator.
 */
function buildField(field: FieldState): Field {
  return new Field({
    weather: field.weather || undefined,
    terrain: field.terrain || undefined,
    attackerSide: {
      isSR: field.attackerSide.stealthRock,
      spikes: field.attackerSide.spikes,
      isReflect: field.attackerSide.reflect,
      isLightScreen: field.attackerSide.lightScreen,
      isAuroraVeil: field.attackerSide.auroraVeil,
      isTailwind: field.attackerSide.tailwind,
      isHelpingHand: field.attackerSide.helpingHand,
    },
    defenderSide: {
      isSR: field.defenderSide.stealthRock,
      spikes: field.defenderSide.spikes,
      isReflect: field.defenderSide.reflect,
      isLightScreen: field.defenderSide.lightScreen,
      isAuroraVeil: field.defenderSide.auroraVeil,
      isTailwind: field.defenderSide.tailwind,
      isHelpingHand: field.defenderSide.helpingHand,
    },
  })
}

export function useCalculation(
  gen: Generation,
  attacker: CalcCardState,
  defender: CalcCardState,
  field: FieldState
): CalcResult | null {
  return useMemo<CalcResult | null>(() => {
    // Guard: return null if required data is missing
    if (!attacker.species || !defender.species || !attacker.move) {
      return null
    }

    try {
      const attackerPokemon = buildPokemon(gen, attacker)
      const defenderPokemon = buildPokemon(gen, defender)
      const move = new Move(gen, attacker.move)
      const fieldConfig = buildField(field)

      const result = calculate(gen, attackerPokemon, defenderPokemon, move, fieldConfig)

      // Get defender's max HP for percentage calculation
      const defenderMaxHP = defenderPokemon.stats.hp

      // Get damage range
      const damageRange = result.range()
      const minPct = defenderMaxHP > 0 ? (damageRange[0] / defenderMaxHP) * 100 : 0
      const maxPct = defenderMaxHP > 0 ? (damageRange[1] / defenderMaxHP) * 100 : 0

      // Get KO text
      const koText = result.desc()

      // Determine effectiveness
      const effectiveness = getEffectiveness(result)

      return {
        damageRange: [minPct, maxPct],
        koText,
        effectiveness,
        raw: result,
      }
    } catch {
      // Return null on any calculation error
      return null
    }
  }, [gen, attacker, defender, field])
}
