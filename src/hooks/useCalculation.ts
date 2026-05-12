/**
 * PokeCalc — useCalculation Hook
 * Wraps @smogon/calc's calculate() function to produce damage results
 * from the current left card, right card, move, and field state.
 * Computes both directions simultaneously.
 */

import { useMemo } from 'react'
import { calculate, Pokemon, Move, Field, toID } from '@smogon/calc'
import type { Generations, Result } from '@smogon/calc'
import type { CalcCardState, FieldState, CalcResult, StatPoints, BidirectionalResult } from '../types/calc'
import { CHAMPIONS_IV, CHAMPIONS_LEVEL } from '../types/calc'
import { spToEV } from '../utils/calc-stats'

type Generation = ReturnType<typeof Generations.get>

/**
 * Determine effectiveness from the raw calc result.
 * Uses the type effectiveness multiplier from the result.
 */
function getEffectiveness(result: Result): CalcResult['effectiveness'] {
  const desc = result.desc()

  if (desc.includes('super effective') || desc.includes('Super Effective')) {
    return 'super-effective'
  }
  if (desc.includes('not very effective') || desc.includes('Not Very Effective')) {
    return 'not-very-effective'
  }

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
  const speciesData = state.species ? gen.species.get(toID(speciesName!)) : null

  let evs: StatPoints
  if (speciesData?.baseStats) {
    evs = spToEV(state.sps, speciesData.baseStats, state.nature)
  } else {
    // Fallback: no species data available, use naive conversion (SPs × 4)
    evs = {
      hp: state.sps.hp * 4,
      atk: state.sps.atk * 4,
      def: state.sps.def * 4,
      spa: state.sps.spa * 4,
      spd: state.sps.spd * 4,
      spe: state.sps.spe * 4,
    }
  }

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
    evs,
    nature: state.nature,
    item: state.item || undefined,
    ability: state.ability || undefined,
  })
}

/**
 * Build a Field object for the calculator given which side is attacking.
 */
function buildField(field: FieldState, attackerSide: 'left' | 'right'): Field {
  const attackerConditions = attackerSide === 'left' ? field.leftSide : field.rightSide
  const defenderConditions = attackerSide === 'left' ? field.rightSide : field.leftSide

  return new Field({
    weather: field.weather || undefined,
    terrain: field.terrain || undefined,
    attackerSide: {
      isSR: attackerConditions.stealthRock,
      spikes: attackerConditions.spikes,
      isReflect: attackerConditions.reflect,
      isLightScreen: attackerConditions.lightScreen,
      isAuroraVeil: attackerConditions.auroraVeil,
      isTailwind: attackerConditions.tailwind,
      isHelpingHand: attackerConditions.helpingHand,
    },
    defenderSide: {
      isSR: defenderConditions.stealthRock,
      spikes: defenderConditions.spikes,
      isReflect: defenderConditions.reflect,
      isLightScreen: defenderConditions.lightScreen,
      isAuroraVeil: defenderConditions.auroraVeil,
      isTailwind: defenderConditions.tailwind,
      isHelpingHand: defenderConditions.helpingHand,
    },
  })
}

/**
 * Compute damage for one direction.
 */
function computeDirection(
  gen: Generation,
  attacker: CalcCardState,
  defender: CalcCardState,
  field: FieldState,
  side: 'left' | 'right'
): CalcResult | null {
  if (!attacker.species || !defender.species || !attacker.moves[attacker.activeMoveIndex]) {
    return null
  }

  try {
    const attackerPokemon = buildPokemon(gen, attacker)
    const defenderPokemon = buildPokemon(gen, defender)
    const move = new Move(gen, attacker.moves[attacker.activeMoveIndex])
    const fieldConfig = buildField(field, side)

    const result = calculate(gen, attackerPokemon, defenderPokemon, move, fieldConfig)

    const defenderMaxHP = defenderPokemon.stats.hp

    const damageRange = result.range()
    const minPct = defenderMaxHP > 0 ? (damageRange[0] / defenderMaxHP) * 100 : 0
    const maxPct = defenderMaxHP > 0 ? (damageRange[1] / defenderMaxHP) * 100 : 0

    const koText = result.desc()
    const effectiveness = getEffectiveness(result)

    return {
      damageRange: [minPct, maxPct],
      koText,
      effectiveness,
      raw: result,
    }
  } catch {
    return null
  }
}

export function useCalculation(
  gen: Generation,
  leftCard: CalcCardState,
  rightCard: CalcCardState,
  field: FieldState
): BidirectionalResult {
  return useMemo<BidirectionalResult>(() => {
    // Compute left→right
    const leftResult = computeDirection(gen, leftCard, rightCard, field, 'left')
    // Compute right→left
    const rightResult = computeDirection(gen, rightCard, leftCard, field, 'right')

    return { leftResult, rightResult }
  }, [gen, leftCard, rightCard, field])
}
