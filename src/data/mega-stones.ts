/**
 * PokeCalc — Mega Stone Mapping
 * Maps species+forme keys to their corresponding mega stone item names.
 *
 * Key format: "SpeciesName-Mega" or "SpeciesName-Mega-X" / "SpeciesName-Mega-Y"
 * Value: exact item name from CHAMPIONS_ITEMS.
 *
 * Mega Rayquaza is excluded — it mega evolves via Dragon Ascent, not a stone.
 */

export const MEGA_STONE_MAP: Record<string, string> = {
  // Gen 1
  'Venusaur-Mega': 'Venusaurite',
  'Charizard-Mega-X': 'Charizardite X',
  'Charizard-Mega-Y': 'Charizardite Y',
  'Blastoise-Mega': 'Blastoisinite',
  'Beedrill-Mega': 'Beedrillite',
  'Pidgeot-Mega': 'Pidgeotite',

  // Gen 2
  'Slowbro-Mega': 'Slowbronite',
  'Steelix-Mega': 'Steelixite',
  'Scizor-Mega': 'Scizorite',
  'Heracross-Mega': 'Heracronite',
  'Houndoom-Mega': 'Houndoominite',
  'Tyranitar-Mega': 'Tyranitarite',

  // Gen 3
  'Sceptile-Mega': 'Sceptilite',
  'Blaziken-Mega': 'Blazikenite',
  'Swampert-Mega': 'Swampertite',
  'Gardevoir-Mega': 'Gardevoirite',
  'Sableye-Mega': 'Sablenite',
  'Mawile-Mega': 'Mawilite',
  'Aggron-Mega': 'Aggronite',
  'Medicham-Mega': 'Medichamite',
  'Manectric-Mega': 'Manectite',
  'Sharpedo-Mega': 'Sharpedonite',
  'Camerupt-Mega': 'Cameruptite',
  'Altaria-Mega': 'Altarianite',
  'Banette-Mega': 'Banettite',
  'Absol-Mega': 'Absolite',
  'Glalie-Mega': 'Glalitite',
  'Salamence-Mega': 'Salamencite',
  'Metagross-Mega': 'Metagrossite',
  'Latias-Mega': 'Latiasite',
  'Latios-Mega': 'Latiosite',

  // Gen 4
  'Lopunny-Mega': 'Lopunnite',
  'Garchomp-Mega': 'Garchompite',
  'Lucario-Mega': 'Lucarionite',
  'Abomasnow-Mega': 'Abomasite',
  'Gallade-Mega': 'Galladite',

  // Gen 5
  'Audino-Mega': 'Audinite',

  // Gen 6
  'Diancie-Mega': 'Diancite',

  // Special cases (Mega X/Y)
  'Mewtwo-Mega-X': 'Mewtwonite X',
  'Mewtwo-Mega-Y': 'Mewtwonite Y',

  // Gen 3 (also has X/Y variants)
  'Gengar-Mega': 'Gengarite',
  'Kangaskhan-Mega': 'Kangaskhanite',
  'Pinsir-Mega': 'Pinsirite',
  'Gyarados-Mega': 'Gyaradosite',
  'Aerodactyl-Mega': 'Aerodactylite',
  'Alakazam-Mega': 'Alakazite',
  'Ampharos-Mega': 'Ampharosite',
}

/**
 * Look up the mega stone for a given species and forme.
 * Returns the stone name or undefined if not a mega evolution.
 */
export function getMegaStone(species: string, forme: string | null): string | undefined {
  if (!forme || !forme.includes('Mega')) {
    return undefined
  }

  const key = forme === 'Mega' ? `${species}-Mega` : `${species}-${forme}`
  return MEGA_STONE_MAP[key]
}
