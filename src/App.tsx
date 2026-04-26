/**
 * PokeCalc — App
 * Main application component assembling the damage calculator layout.
 */

import { useState, useMemo } from 'react'
import { Generations } from '@smogon/calc'
import type { CalcCardState, EVs, FieldState, SideConditions } from './types/calc'
import { CalcCard } from './components/CalcCard/CalcCard'
import { FieldConditions } from './components/FieldConditions/FieldConditions'
import { ResultsPanel } from './components/ResultsPanel/ResultsPanel'
import { AppHeader } from './components/AppHeader/AppHeader'
import { useDarkMode } from './hooks/useDarkMode'
import { useCalculation } from './hooks/useCalculation'
import './App.css'

const DEFAULT_EVS: EVs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }

const DEFAULT_CARD_STATE: CalcCardState = {
  species: null,
  forme: null,
  item: undefined,
  ability: undefined,
  nature: 'Hardy',
  evs: DEFAULT_EVS,
  move: null,
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
  attackerSide: DEFAULT_SIDE,
  defenderSide: DEFAULT_SIDE,
}

function App() {
  const gen = useMemo(() => Generations.get(9), [])
  const [isDark, toggleTheme] = useDarkMode()

  const [attacker, setAttacker] = useState<CalcCardState>(DEFAULT_CARD_STATE)
  const [defender, setDefender] = useState<CalcCardState>(DEFAULT_CARD_STATE)
  const [field, setField] = useState<FieldState>(DEFAULT_FIELD)

  const result = useCalculation(gen, attacker, defender, field)

  const handleSwap = () => {
    const temp = attacker
    setAttacker(defender)
    setDefender(temp)

    // Swap field side conditions too
    setField((prev) => ({
      ...prev,
      attackerSide: prev.defenderSide,
      defenderSide: prev.attackerSide,
    }))
  }

  return (
    <>
      <AppHeader isDark={isDark} onToggleTheme={toggleTheme} />
      <main className="calc-layout">
        <div className="calc-layout__attacker">
          <CalcCard
            role="attacker"
            state={attacker}
            onStateChange={setAttacker}
            gen={gen}
          />
        </div>

        <div className="calc-layout__results">
          <ResultsPanel result={result} onSwap={handleSwap} />
          <FieldConditions field={field} onFieldChange={setField} />
        </div>

        <div className="calc-layout__defender">
          <CalcCard
            role="defender"
            state={defender}
            onStateChange={setDefender}
            gen={gen}
          />
        </div>
      </main>
    </>
  )
}

export default App
