/**
 * PokeCalc — Calculation Types
 * Types for the @smogon/calc integration and UI state.
 */

import type { Result } from '@smogon/calc'

/** Stat names used throughout the application */
export type StatName = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe'

/**
 * Champions-specific Stat Point constraints:
 * - Max 32 per stat
 * - Total max 66
 */
export const CHAMPIONS_SP_MAX_PER_STAT = 32
export const CHAMPIONS_SP_TOTAL_MAX = 66
export const CHAMPIONS_IV = 31
export const CHAMPIONS_LEVEL = 50

/** @deprecated Use CHAMPIONS_SP_MAX_PER_STAT instead */
export const CHAMPIONS_EV_MAX_PER_STAT = CHAMPIONS_SP_MAX_PER_STAT
/** @deprecated Use CHAMPIONS_SP_TOTAL_MAX instead */
export const CHAMPIONS_EV_TOTAL_MAX = CHAMPIONS_SP_TOTAL_MAX

/** State for a single CalcCard (attacker or defender) */
export interface CalcCardState {
  species: string | null
  forme: string | null
  item: string | undefined
  ability: string | undefined
  nature: string
  sps: StatPoints
  moves: string[]
  activeMoveIndex: number
}

/** Stat Point distribution — Champions: max 32/stat, total ≤ 66 */
export interface StatPoints {
  hp: number
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
}

/** @deprecated Use StatPoints instead */
export type EVs = StatPoints

/** Move state for the attacker */
export interface MoveState {
  name: string
  type: string
  category: 'Physical' | 'Special' | 'Status'
}

/** Result from @smogon/calc wrapped for UI display */
export interface CalcResult {
  /** Damage range as percentages, e.g. [11.2, 13.3] */
  damageRange: [number, number]
  /** Smogon KO description, e.g. "guaranteed 2HKO" */
  koText: string
  /** Raw @smogon/calc result for advanced access */
  raw: Result
}

/** Field conditions state */
export interface FieldState {
  weather: Weather | null
  terrain: Terrain | null
  leftSide: SideConditions
  rightSide: SideConditions
}

/** Result from bidirectional damage calculation */
export interface BidirectionalResult {
  /** Damage dealt by left card to right card (null if left can't attack) */
  leftResult: CalcResult | null
  /** Damage dealt by right card to left card (null if right can't attack) */
  rightResult: CalcResult | null
}

export type Weather =
  | 'Sun'
  | 'Rain'
  | 'Sand'
  | 'Hail'
  | 'Harsh Sunshine'
  | 'Heavy Rain'
  | 'Strong Winds'

export type Terrain =
  | 'Electric'
  | 'Grassy'
  | 'Misty'
  | 'Psychic'

export interface SideConditions {
  stealthRock: boolean
  spikes: number // 0–3
  reflect: boolean
  lightScreen: boolean
  auroraVeil: boolean
  tailwind: boolean
  helpingHand: boolean
}
