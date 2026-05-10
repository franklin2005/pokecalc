/**
 * PokeCalc — Mega Stone Mapping
 * Maps species+forme keys to their corresponding mega stone item names.
 *
 * Key format: "SpeciesName-Mega" or "SpeciesName-Mega-X" / "SpeciesName-Mega-Y"
 * Value: exact item name from CHAMPIONS_ITEM_CATEGORIES.megaStones.
 *
 * Contains all 59 mega evolutions available in Pokémon Champions format.
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
  'Clefable-Mega': 'Clefablite',
  'Alakazam-Mega': 'Alakazite',
  'Victreebel-Mega': 'Victreebelite',
  'Slowbro-Mega': 'Slowbronite',
  'Gengar-Mega': 'Gengarite',
  'Kangaskhan-Mega': 'Kangaskhanite',
  'Starmie-Mega': 'Starminite',
  'Pinsir-Mega': 'Pinsirite',
  'Gyarados-Mega': 'Gyaradosite',
  'Aerodactyl-Mega': 'Aerodactylite',
  'Dragonite-Mega': 'Dragoninite',

  // Gen 2
  'Meganium-Mega': 'Meganiumite',
  'Feraligatr-Mega': 'Feraligite',
  'Ampharos-Mega': 'Ampharosite',
  'Steelix-Mega': 'Steelixite',
  'Scizor-Mega': 'Scizorite',
  'Heracross-Mega': 'Heracronite',
  'Skarmory-Mega': 'Skarmorite',
  'Houndoom-Mega': 'Houndoominite',
  'Tyranitar-Mega': 'Tyranitarite',

  // Gen 3
  'Gardevoir-Mega': 'Gardevoirite',
  'Sableye-Mega': 'Sablenite',
  'Aggron-Mega': 'Aggronite',
  'Medicham-Mega': 'Medichamite',
  'Manectric-Mega': 'Manectite',
  'Sharpedo-Mega': 'Sharpedonite',
  'Camerupt-Mega': 'Cameruptite',
  'Altaria-Mega': 'Altarianite',
  'Banette-Mega': 'Banettite',
  'Chimecho-Mega': 'Chimechite',
  'Absol-Mega': 'Absolite',
  'Glalie-Mega': 'Glalitite',

  // Gen 4
  'Lopunny-Mega': 'Lopunnite',
  'Garchomp-Mega': 'Garchompite',
  'Lucario-Mega': 'Lucarionite',
  'Abomasnow-Mega': 'Abomasite',
  'Gallade-Mega': 'Galladite',
  'Froslass-Mega': 'Froslassite',

  // Gen 5
  'Emboar-Mega': 'Emboarite',
  'Excadrill-Mega': 'Excadrite',
  'Audino-Mega': 'Audinite',
  'Chandelure-Mega': 'Chandelurite',
  'Golurk-Mega': 'Golurkite',

  // Gen 6
  'Chesnaught-Mega': 'Chesnaughtite',
  'Delphox-Mega': 'Delphoxite',
  'Greninja-Mega': 'Greninjite',
  'Floette-Mega': 'Floettite',
  'Meowstic-Mega': 'Meowsticite',
  'Hawlucha-Mega': 'Hawluchanite',
  'Crabominable-Mega': 'Crabominite',
  'Drampa-Mega': 'Drampanite',
  'Scovillain-Mega': 'Scovillainite',
  'Glimmora-Mega': 'Glimmoranite',
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
