import { describe, it, expect } from 'vitest'
import { calculate, Generations, Pokemon, Move } from '@smogon/calc'

describe('@smogon/calc import', () => {
  it('should import calculate, Generations, Pokemon, and Move', () => {
    expect(calculate).toBeDefined()
    expect(Generations).toBeDefined()
    expect(Pokemon).toBeDefined()
    expect(Move).toBeDefined()
  })

  it('should perform a basic damage calculation', () => {
    const gen = Generations.get(9)
    // Shadow Ball (Ghost) is super-effective vs Alakazam (Psychic)
    const result = calculate(
      gen,
      new Pokemon(gen, 'Gengar', {
        nature: 'Timid',
        evs: { spa: 32 },
      }),
      new Pokemon(gen, 'Alakazam', {
        nature: 'Timid',
        evs: { hp: 32 },
      }),
      new Move(gen, 'Shadow Ball')
    )

    expect(result).toBeDefined()
    const range = result.range()
    expect(range).toBeDefined()
    expect(Array.isArray(range)).toBe(true)
    expect(range[0]).toBeGreaterThan(0)
    expect(range[1]).toBeGreaterThanOrEqual(range[0])
    // Result should have description methods
    expect(typeof result.desc).toBe('function')
    expect(typeof result.fullDesc).toBe('function')
    expect(typeof result.kochance).toBe('function')
  })
})
