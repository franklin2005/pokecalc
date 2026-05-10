/**
 * PokeCalc — Champions Items
 * Official item list for Pokémon Champions competitive format.
 *
 * Source: Pokémon Champions ruleset.
 * Names match exactly the format used by @smogon/calc for damage calculation.
 * All items verified against @smogon/calc ITEMS['9'] (Gen 9).
 */

/**
 * Categories mirror the official Champions item classification.
 */
export const CHAMPIONS_ITEM_CATEGORIES = {
  berries: [
    'Aspear Berry',
    'Cheri Berry',
    'Chesto Berry',
    'Chilan Berry',
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
    'Persim Berry',
    'Leppa Berry',
    'Oran Berry',
    'Sitrus Berry',
  ],

  typeBoost: [
    'Silk Scarf',
    'Miracle Seed',
    'Charcoal',
    'Mystic Water',
    'Magnet',
    'Silver Powder',
    'Sharp Beak',
    'Hard Stone',
    'Poison Barb',
    'Soft Sand',
    'Never-Melt Ice',
    'Black Belt',
    'Twisted Spoon',
    'Spell Tag',
    'Dragon Fang',
    'Black Glasses',
    'Metal Coat',
    'Fairy Feather',
  ],

  utility: [
    'Focus Sash',
    'Leftovers',
    'White Herb',
    'Scope Lens',
    'Light Ball',
    'Shell Bell',
    'Mental Herb',
  ],

  megaStones: [
    // Gen 1
    'Venusaurite',
    'Charizardite X',
    'Charizardite Y',
    'Blastoisinite',
    'Beedrillite',
    'Pidgeotite',
    'Clefablite',
    'Alakazite',
    'Victreebelite',
    'Slowbronite',
    'Gengarite',
    'Kangaskhanite',
    'Starminite',
    'Pinsirite',
    'Gyaradosite',
    'Aerodactylite',
    'Dragoninite',
    // Gen 2
    'Meganiumite',
    'Feraligite',
    'Ampharosite',
    'Steelixite',
    'Scizorite',
    'Heracronite',
    'Skarmorite',
    'Houndoominite',
    'Tyranitarite',
    // Gen 3
    'Gardevoirite',
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
    // Gen 4
    'Lopunnite',
    'Garchompite',
    'Lucarionite',
    'Abomasite',
    'Galladite',
    'Froslassite',
    // Gen 5
    'Emboarite',
    'Excadrite',
    'Audinite',
    'Chandelurite',
    'Golurkite',
    // Gen 6
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
  ],
} as const

/**
 * Flat array of all Champions-allowed item names.
 * Derived from the categorized lists above.
 */
export const CHAMPIONS_ITEMS: readonly string[] = [
  ...CHAMPIONS_ITEM_CATEGORIES.berries,
  ...CHAMPIONS_ITEM_CATEGORIES.typeBoost,
  ...CHAMPIONS_ITEM_CATEGORIES.utility,
  ...CHAMPIONS_ITEM_CATEGORIES.megaStones,
]

/**
 * Map from item name to its Champions category label (for UI display).
 */
export function getItemCategory(itemName: string): string {
  if (CHAMPIONS_ITEM_CATEGORIES.berries.includes(itemName as never)) return 'Berries'
  if (CHAMPIONS_ITEM_CATEGORIES.typeBoost.includes(itemName as never)) return 'Type Boost'
  if (CHAMPIONS_ITEM_CATEGORIES.utility.includes(itemName as never)) return 'Utility'
  if (CHAMPIONS_ITEM_CATEGORIES.megaStones.includes(itemName as never)) return 'Mega Stones'
  return 'Other'
}

/**
 * Check if an item is allowed in Champions mode.
 */
export function isChampionsItem(itemName: string): boolean {
  return (CHAMPIONS_ITEMS as readonly string[]).includes(itemName)
}
