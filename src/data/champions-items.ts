/**
 * PokeCalc — Champions Items
 * Curated list of items allowed in Pokémon Champions mode.
 * Item names match exactly the format used by @smogon/calc.
 */

/**
 * Items allowed in Pokémon Champions mode.
 * Includes held items, berries, and mega stones relevant to Champions.
 */
export const CHAMPIONS_ITEMS: string[] = [
  // Choice items
  'Choice Band',
  'Choice Specs',
  'Choice Scarf',

  // Offensive items
  'Life Orb',
  'Expert Belt',
  'Muscle Band',
  'Wise Glasses',
  'Metronome',
  'Black Glasses',
  'Charcoal',
  'Dragon Fang',
  'Hard Stone',
  'Magnet',
  'Miracle Seed',
  'Mystic Water',
  'Never-Melt Ice',
  'Poison Barb',
  'Sharp Beak',
  'Silk Scarf',
  'Silver Powder',
  'Soft Sand',
  'Spell Tag',
  'Twisted Spoon',

  // Defensive / recovery items
  'Leftovers',
  'Assault Vest',
  'Focus Sash',
  'Rocky Helmet',
  'Black Sludge',
  'Heavy-Duty Boots',
  'Eviolite',
  'Air Balloon',
  'Covert Cloak',
  'Clear Amulet',

  // Stat-boosting berries
  'Lum Berry',
  'Sitrus Berry',
  'Salac Berry',
  'Petaya Berry',
  'Apicot Berry',
  'Ganlon Berry',
  'Liechi Berry',
  'Kebia Berry',
  'Shuca Berry',
  'Coba Berry',
  'Passho Berry',
  'Wacan Berry',
  'Rindo Berry',
  'Yache Berry',
  'Chople Berry',
  'Babiri Berry',
  'Charti Berry',
  'Kasib Berry',
  'Haban Berry',
  'Colbur Berry',
  'Roseli Berry',

  // Battle effect items
  'Shell Bell',
  'Big Root',
  'Scope Lens',
  "King's Rock",
  'Razor Claw',
  'Razor Fang',
  'White Herb',
  'Absorb Bulb',
  'Cell Battery',
  'Adrenaline Orb',
  'Protective Pads',
  'Blunder Policy',
  'Throat Spray',
  'Eject Button',
  'Eject Pack',
  'Red Card',
  'Weakness Policy',
  'Loaded Dice',
  'Mirror Herb',
  'Punching Glove',
  'Booster Energy',

  // Mega Stones (Champions allows Megas)
  'Abomasite',
  'Absolite',
  'Aerodactylite',
  'Aggronite',
  'Alakazite',
  'Altarianite',
  'Ampharosite',
  'Audinite',
  'Banettite',
  'Beedrillite',
  'Blastoisinite',
  'Blazikenite',
  'Cameruptite',
  'Charizardite X',
  'Charizardite Y',
  'Diancite',
  'Galladite',
  'Garchompite',
  'Gardevoirite',
  'Gengarite',
  'Glalitite',
  'Gyaradosite',
  'Heracronite',
  'Houndoominite',
  'Kangaskhanite',
  'Latiasite',
  'Latiosite',
  'Lopunnite',
  'Lucarionite',
  'Manectite',
  'Mawilite',
  'Medichamite',
  'Metagrossite',
  'Mewtwonite X',
  'Mewtwonite Y',
  'Pidgeotite',
  'Pinsirite',
  'Sablenite',
  'Salamencite',
  'Sceptilite',
  'Scizorite',
  'Sharpedonite',
  'Slowbronite',
  'Steelixite',
  'Swampertite',
  'Tyranitarite',
  'Venusaurite',
]

/**
 * Check if an item is allowed in Champions mode.
 */
export function isChampionsItem(itemName: string): boolean {
  return CHAMPIONS_ITEMS.includes(itemName)
}
