import { describe, it, expect } from 'vitest'
import { getMegaStone, MEGA_STONE_MAP } from '../mega-stones'

describe('mega-stones', () => {
  it('should export a map with 59 entries', () => {
    expect(Object.keys(MEGA_STONE_MAP).length).toBe(59)
  })

  it('should return correct stone for Charizard-Mega-X', () => {
    expect(getMegaStone('Charizard', 'Mega-X')).toBe('Charizardite X')
  })

  it('should return correct stone for Charizard-Mega-Y', () => {
    expect(getMegaStone('Charizard', 'Mega-Y')).toBe('Charizardite Y')
  })

  it('should return correct stone for Gengar-Mega', () => {
    expect(getMegaStone('Gengar', 'Mega')).toBe('Gengarite')
  })

  it('should return undefined for Rayquaza (no mega stone)', () => {
    expect(getMegaStone('Rayquaza', 'Mega')).toBeUndefined()
  })

  it('should return undefined for non-mega species', () => {
    expect(getMegaStone('Pikachu', 'Mega')).toBeUndefined()
  })

  it('should include Gen 1 mega stones', () => {
    expect(MEGA_STONE_MAP['Venusaur-Mega']).toBe('Venusaurite')
    expect(MEGA_STONE_MAP['Blastoise-Mega']).toBe('Blastoisinite')
    expect(MEGA_STONE_MAP['Beedrill-Mega']).toBe('Beedrillite')
    expect(MEGA_STONE_MAP['Pidgeot-Mega']).toBe('Pidgeotite')
    expect(MEGA_STONE_MAP['Kangaskhan-Mega']).toBe('Kangaskhanite')
    expect(MEGA_STONE_MAP['Pinsir-Mega']).toBe('Pinsirite')
    expect(MEGA_STONE_MAP['Gyarados-Mega']).toBe('Gyaradosite')
    expect(MEGA_STONE_MAP['Aerodactyl-Mega']).toBe('Aerodactylite')
  })

  it('should include Gen 2 mega stones', () => {
    expect(MEGA_STONE_MAP['Ampharos-Mega']).toBe('Ampharosite')
    expect(MEGA_STONE_MAP['Steelix-Mega']).toBe('Steelixite')
    expect(MEGA_STONE_MAP['Scizor-Mega']).toBe('Scizorite')
    expect(MEGA_STONE_MAP['Heracross-Mega']).toBe('Heracronite')
    expect(MEGA_STONE_MAP['Houndoom-Mega']).toBe('Houndoominite')
    expect(MEGA_STONE_MAP['Tyranitar-Mega']).toBe('Tyranitarite')
  })

  it('should include Gen 3 mega stones', () => {
    expect(MEGA_STONE_MAP['Gardevoir-Mega']).toBe('Gardevoirite')
    expect(MEGA_STONE_MAP['Sableye-Mega']).toBe('Sablenite')
    expect(MEGA_STONE_MAP['Aggron-Mega']).toBe('Aggronite')
    expect(MEGA_STONE_MAP['Medicham-Mega']).toBe('Medichamite')
    expect(MEGA_STONE_MAP['Manectric-Mega']).toBe('Manectite')
    expect(MEGA_STONE_MAP['Sharpedo-Mega']).toBe('Sharpedonite')
    expect(MEGA_STONE_MAP['Camerupt-Mega']).toBe('Cameruptite')
    expect(MEGA_STONE_MAP['Altaria-Mega']).toBe('Altarianite')
    expect(MEGA_STONE_MAP['Banette-Mega']).toBe('Banettite')
    expect(MEGA_STONE_MAP['Absol-Mega']).toBe('Absolite')
    expect(MEGA_STONE_MAP['Glalie-Mega']).toBe('Glalitite')
  })

  it('should include Gen 4 mega stones', () => {
    expect(MEGA_STONE_MAP['Lopunny-Mega']).toBe('Lopunnite')
    expect(MEGA_STONE_MAP['Garchomp-Mega']).toBe('Garchompite')
    expect(MEGA_STONE_MAP['Lucario-Mega']).toBe('Lucarionite')
    expect(MEGA_STONE_MAP['Abomasnow-Mega']).toBe('Abomasite')
    expect(MEGA_STONE_MAP['Gallade-Mega']).toBe('Galladite')
  })

  it('should include Champions-introduced mega stones', () => {
    expect(MEGA_STONE_MAP['Clefable-Mega']).toBe('Clefablite')
    expect(MEGA_STONE_MAP['Dragonite-Mega']).toBe('Dragoninite')
    expect(MEGA_STONE_MAP['Meganium-Mega']).toBe('Meganiumite')
    expect(MEGA_STONE_MAP['Starmie-Mega']).toBe('Starminite')
    expect(MEGA_STONE_MAP['Victreebel-Mega']).toBe('Victreebelite')
    expect(MEGA_STONE_MAP['Feraligatr-Mega']).toBe('Feraligite')
    expect(MEGA_STONE_MAP['Skarmory-Mega']).toBe('Skarmorite')
    expect(MEGA_STONE_MAP['Chimecho-Mega']).toBe('Chimechite')
    expect(MEGA_STONE_MAP['Froslass-Mega']).toBe('Froslassite')
    expect(MEGA_STONE_MAP['Emboar-Mega']).toBe('Emboarite')
    expect(MEGA_STONE_MAP['Excadrill-Mega']).toBe('Excadrite')
    expect(MEGA_STONE_MAP['Audino-Mega']).toBe('Audinite')
    expect(MEGA_STONE_MAP['Chandelure-Mega']).toBe('Chandelurite')
    expect(MEGA_STONE_MAP['Golurk-Mega']).toBe('Golurkite')
    expect(MEGA_STONE_MAP['Chesnaught-Mega']).toBe('Chesnaughtite')
    expect(MEGA_STONE_MAP['Delphox-Mega']).toBe('Delphoxite')
    expect(MEGA_STONE_MAP['Greninja-Mega']).toBe('Greninjite')
    expect(MEGA_STONE_MAP['Floette-Mega']).toBe('Floettite')
    expect(MEGA_STONE_MAP['Meowstic-Mega']).toBe('Meowsticite')
    expect(MEGA_STONE_MAP['Hawlucha-Mega']).toBe('Hawluchanite')
    expect(MEGA_STONE_MAP['Crabominable-Mega']).toBe('Crabominite')
    expect(MEGA_STONE_MAP['Drampa-Mega']).toBe('Drampanite')
    expect(MEGA_STONE_MAP['Scovillain-Mega']).toBe('Scovillainite')
    expect(MEGA_STONE_MAP['Glimmora-Mega']).toBe('Glimmoranite')
  })

  it('should not include mega stones not in Champions', () => {
    expect(MEGA_STONE_MAP['Mewtwo-Mega-X']).toBeUndefined()
    expect(MEGA_STONE_MAP['Rayquaza-Mega']).toBeUndefined()
  })
})
