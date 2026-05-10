import { describe, it, expect } from 'vitest'
import { ITEMS } from '@smogon/calc'
import {
  CHAMPIONS_ITEMS,
  CHAMPIONS_ITEM_CATEGORIES,
  isChampionsItem,
  getItemCategory,
} from '../champions-items'

describe('champions-items', () => {
  it('should have exactly 109 items', () => {
    expect(CHAMPIONS_ITEMS.length).toBe(109)
  })

  it('should have no duplicate items', () => {
    const uniqueItems = new Set(CHAMPIONS_ITEMS)
    expect(uniqueItems.size).toBe(CHAMPIONS_ITEMS.length)
  })

  it('should have correct category counts', () => {
    expect(CHAMPIONS_ITEM_CATEGORIES.berries.length).toBe(25)
    expect(CHAMPIONS_ITEM_CATEGORIES.typeBoost.length).toBe(18)
    expect(CHAMPIONS_ITEM_CATEGORIES.utility.length).toBe(7)
    expect(CHAMPIONS_ITEM_CATEGORIES.megaStones.length).toBe(59)
  })

  it('all items should exist in @smogon/calc Gen 9', () => {
    const smogonSet = new Set(ITEMS['9'] as string[])
    for (const item of CHAMPIONS_ITEMS) {
      expect(
        smogonSet.has(item),
        `"${item}" not found in @smogon/calc ITEMS['9']`
      ).toBe(true)
    }
  })

  it('should include official Champions berries', () => {
    const expected = [
      'Sitrus Berry',
      'Oran Berry',
      'Leppa Berry',
      'Persim Berry',
      'Occa Berry',
      'Passho Berry',
      'Wacan Berry',
      'Rindo Berry',
      'Yache Berry',
      'Chople Berry',
      'Kebia Berry',
      'Shuca Berry',
      'Coba Berry',
      'Payapa Berry',
      'Tanga Berry',
      'Charti Berry',
      'Kasib Berry',
      'Haban Berry',
      'Colbur Berry',
      'Babiri Berry',
      'Roseli Berry',
      'Aspear Berry',
      'Cheri Berry',
      'Chesto Berry',
      'Chilan Berry',
    ]
    for (const berry of expected) {
      expect(CHAMPIONS_ITEM_CATEGORIES.berries).toContain(berry)
    }
  })

  it('should include official Champions type boost items', () => {
    const expected = ['Silk Scarf', 'Charcoal', 'Mystic Water', 'Black Glasses', 'Fairy Feather']
    for (const item of expected) {
      expect(CHAMPIONS_ITEM_CATEGORIES.typeBoost).toContain(item)
    }
  })

  it('should include official Champions utility items', () => {
    const expected = ['Focus Sash', 'Leftovers', 'White Herb', 'Scope Lens', 'Light Ball']
    for (const item of expected) {
      expect(CHAMPIONS_ITEM_CATEGORIES.utility).toContain(item)
    }
  })

  it('should include official Champions mega stones', () => {
    const expected = [
      'Charizardite X',
      'Charizardite Y',
      'Gengarite',
      'Kangaskhanite',
      'Gardevoirite',
      'Clefablite',
      'Dragoninite',
      'Starminite',
      'Victreebelite',
      'Venusaurite',
      'Blastoisinite',
      'Beedrillite',
      'Pidgeotite',
      'Alakazite',
      'Slowbronite',
      'Pinsirite',
      'Gyaradosite',
      'Aerodactylite',
      'Meganiumite',
      'Feraligite',
      'Ampharosite',
      'Steelixite',
      'Scizorite',
      'Heracronite',
      'Skarmorite',
      'Houndoominite',
      'Tyranitarite',
      'Sablenite',
      'Aggronite',
      'Medichamite',
      'Manectite',
      'Sharpedonite',
      'Cameruptite',
      'Altarianite',
      'Banettite',
      'Chimechite',
      'Absolite',
      'Glalitite',
      'Lopunnite',
      'Garchompite',
      'Lucarionite',
      'Abomasite',
      'Galladite',
      'Froslassite',
      'Emboarite',
      'Excadrite',
      'Audinite',
      'Chandelurite',
      'Golurkite',
      'Chesnaughtite',
      'Delphoxite',
      'Greninjite',
      'Floettite',
      'Meowsticite',
      'Hawluchanite',
      'Crabominite',
      'Drampanite',
      'Scovillainite',
      'Glimmoranite',
    ]
    for (const stone of expected) {
      expect(CHAMPIONS_ITEM_CATEGORIES.megaStones).toContain(stone)
    }
  })

  it('isChampionsItem should return true for allowed items', () => {
    expect(isChampionsItem('Focus Sash')).toBe(true)
    expect(isChampionsItem('Leftovers')).toBe(true)
    expect(isChampionsItem('Charizardite X')).toBe(true)
  })

  it('isChampionsItem should return false for disallowed items', () => {
    // Items NOT in Champions mode
    expect(isChampionsItem('Choice Band')).toBe(false)
    expect(isChampionsItem('Life Orb')).toBe(false)
    expect(isChampionsItem('Assault Vest')).toBe(false)
    expect(isChampionsItem('Eviolite')).toBe(false)
    expect(isChampionsItem('Booster Energy')).toBe(false)
  })

  it('getItemCategory should return correct categories', () => {
    expect(getItemCategory('Sitrus Berry')).toBe('Berries')
    expect(getItemCategory('Charcoal')).toBe('Type Boost')
    expect(getItemCategory('Focus Sash')).toBe('Utility')
    expect(getItemCategory('Gengarite')).toBe('Mega Stones')
    expect(getItemCategory('Nonexistent')).toBe('Other')
  })
})
