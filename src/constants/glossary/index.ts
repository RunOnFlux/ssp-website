import { normalizeSlug } from '@/lib/glossary-utils'
import type { GlossaryEntry, GlossaryEntrySource } from './types'
import cmcRaw from './cmc.json'
import sspCuratedRaw from './ssp-curated.json'
import webSourcedRaw from './web-sourced.json'

const cmc = cmcRaw as GlossaryEntrySource[]
const sspCurated = sspCuratedRaw as GlossaryEntrySource[]
const webSourced = webSourcedRaw as GlossaryEntrySource[]

export function getGlossary(): readonly GlossaryEntry[] {
  const map = new Map<string, GlossaryEntry>()

  // Lowest precedence first; later sets override earlier sets on slug collision.
  for (const entry of webSourced) {
    map.set(normalizeSlug(entry.slug), { ...entry, source: 'web' })
  }
  for (const entry of cmc) {
    map.set(normalizeSlug(entry.slug), { ...entry, source: 'cmc' })
  }
  for (const entry of sspCurated) {
    map.set(normalizeSlug(entry.slug), { ...entry, source: 'ssp-curated' })
  }

  const merged = Array.from(map.values()).sort((a, b) =>
    a.title.localeCompare(b.title, 'en')
  )
  return Object.freeze(merged)
}

export const GLOSSARY = getGlossary()
export type { GlossaryEntry, GlossaryEntrySource } from './types'
