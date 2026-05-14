/**
 * PokeCalc — App
 * Main application component assembling the damage calculator layout.
 */

import { useState, useMemo } from 'react'
import { Generations } from '@smogon/calc'
import type { CalcCardState, StatPoints, FieldState, SideConditions } from './types/calc'
import { CalcCard } from './components/CalcCard/CalcCard'
import { FieldConditions } from './components/FieldConditions/FieldConditions'
import { AppHeader } from './components/AppHeader/AppHeader'
import { useDarkMode } from './hooks/useDarkMode'
import { useCalculation } from './hooks/useCalculation'
import './App.css'

const DEFAULT_SPS: StatPoints = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }

const DEFAULT_CARD_STATE: CalcCardState = {
  species: null,
  forme: null,
  item: undefined,
  ability: undefined,
  nature: 'Hardy',
  sps: DEFAULT_SPS,
  moves: ['', '', '', ''],
  activeMoveIndex: 0,
}

/** Default matchup on first load — non-empty cards + a valid calc */
const DEFAULT_LEFT: CalcCardState = {
  ...DEFAULT_CARD_STATE,
  species: 'Venusaur',
  ability: 'Overgrow',
}

const DEFAULT_RIGHT: CalcCardState = {
  ...DEFAULT_CARD_STATE,
  species: 'Charizard',
  ability: 'Blaze',
}

const DEFAULT_SIDE: SideConditions = {
  stealthRock: false,
  spikes: 0,
  reflect: false,
  lightScreen: false,
  auroraVeil: false,
  tailwind: false,
  helpingHand: false,
}

const DEFAULT_FIELD: FieldState = {
  weather: null,
  terrain: null,
  leftSide: DEFAULT_SIDE,
  rightSide: DEFAULT_SIDE,
}

function App() {
  const gen = useMemo(() => Generations.get(9), [])
  const [isDark, toggleTheme] = useDarkMode()

  const [leftCard, setLeftCard] = useState<CalcCardState>(DEFAULT_LEFT)
  const [rightCard, setRightCard] = useState<CalcCardState>(DEFAULT_RIGHT)
  const [field, setField] = useState<FieldState>(DEFAULT_FIELD)

  const { leftResult, rightResult } = useCalculation(gen, leftCard, rightCard, field)

  return (
    <>
      <AppHeader isDark={isDark} onToggleTheme={toggleTheme} />
      <main className="calc-layout">
        {/* Cards — left + right side by side */}
        <div className="calc-layout__cards">
          <CalcCard
            slotId="left"
            state={leftCard}
            result={leftResult}
            incomingResult={rightResult}
            onStateChange={setLeftCard}
            gen={gen}
          />
          <CalcCard
            slotId="right"
            state={rightCard}
            result={rightResult}
            incomingResult={leftResult}
            onStateChange={setRightCard}
            gen={gen}
          />
        </div>

        {/* Field Conditions — full width below */}
        <div className="calc-layout__field">
          <FieldConditions field={field} onFieldChange={setField} />
        </div>
      </main>
    </>
  )
}

export default App
