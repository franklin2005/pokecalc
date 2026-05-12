/**
 * Item sprite URL mapping.
 * Returns local sprite paths with tier fallback chain handled via img onError.
 *
 * Tiers (in priority order):
 *   1. dream-world — Berries, type boosts, utility items (48 items, 88×90 illustrated)
 *   2. vgc         — All items from vgcmulticalc.com (160×160, covers all mega stones)
 *   3. gen9        — Custom mega stones (23 items, 160×160)
 *   4. sv          — Dream World gaps from Serebii (2 items, 160×160)
 *   5. pixel       — Official mega stones from PokeAPI (36 items, 30×30 last resort)
 */
const TIERS = ['dream-world', 'vgc', 'gen9', 'sv', 'pixel'] as const

/** Slugify an item name: lowercase, spaces → hyphens. */
function slugify(name: string): string {
  return name.toLowerCase().replace(/ /g, '-')
}

/**
 * Build the full fallback chain for an item's sprite.
 * Returns an array of URLs to try in order.
 * Use the first URL as src, and walk the chain on img onError.
 */
export function getItemSpriteUrls(itemName: string): string[] {
  const slug = slugify(itemName)
  return TIERS.map((tier) => `/sprites/items/${tier}/${slug}.png`)
}

/**
 * Get the primary (first-tier) URL for an item sprite.
 * Use this as the img src; handle fallbacks via onError.
 */
export function getItemSpriteUrl(itemName: string): string {
  return getItemSpriteUrls(itemName)[0]
}

/**
 * Build an onError handler that walks the fallback chain.
 * Usage: onError={handleItemSpriteError(itemName)}
 */
export function handleItemSpriteError(itemName: string): (e: React.SyntheticEvent<HTMLImageElement>) => void {
  const urls = getItemSpriteUrls(itemName)

  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const currentSrc = img.src

    // Find current position in the chain
    const currentIndex = urls.findIndex((url) => currentSrc.endsWith(url))

    // Try next tier
    const nextIndex = currentIndex + 1
    if (nextIndex < urls.length) {
      img.src = urls[nextIndex]
    } else {
      // All tiers exhausted — hide the broken image
      img.style.display = 'none'
    }
  }
}
