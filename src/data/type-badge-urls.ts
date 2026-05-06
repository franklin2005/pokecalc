/**
 * Bundled PNG URLs for type badges (src/assets/type_badges/{type}.png).
 */

import type { TypeName } from '../types/pokemon'
import { ALL_TYPES } from './type-colors'

const modules = import.meta.glob('../assets/type_badges/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function resolveUrlForFile(filename: string): string | undefined {
  const normalized = filename.toLowerCase()
  const entry = Object.entries(modules).find(([path]) =>
    path.replace(/\\/g, '/').endsWith(`/${normalized}`)
  )
  return entry?.[1]
}

const TYPE_BADGE_SRC: Partial<Record<TypeName, string>> = {}
for (const t of ALL_TYPES) {
  const url = resolveUrlForFile(`${t.toLowerCase()}.png`)
  if (url) {
    TYPE_BADGE_SRC[t] = url
  }
}

const normalFallback =
  TYPE_BADGE_SRC.Normal ?? Object.values(modules)[0] ?? ''

export function getTypeBadgeSrc(type: TypeName): string {
  return TYPE_BADGE_SRC[type] ?? normalFallback
}
