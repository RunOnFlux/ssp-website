import { describe, it, expect } from 'vitest'
import en from '@/messages/en.json'
import es from '@/messages/es.json'
import zh from '@/messages/zh.json'

type AnyObj = Record<string, unknown>

function flattenKeys(obj: AnyObj, prefix = ''): string[] {
  const keys: string[] = []
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...flattenKeys(v as AnyObj, path))
    } else {
      keys.push(path)
    }
  }
  return keys
}

describe('locale coverage', () => {
  const enKeys = new Set(flattenKeys(en as AnyObj))
  for (const [name, locale] of [
    ['es', es],
    ['zh', zh],
  ] as const) {
    it(`${name}.json contains every key from en.json`, () => {
      const localeKeys = new Set(flattenKeys(locale as AnyObj))
      const missing = [...enKeys].filter((k) => !localeKeys.has(k))
      expect(missing, `Keys missing from ${name}.json:\n${missing.join('\n')}`).toEqual([])
    })
    it(`${name}.json has no orphan keys (not in en.json)`, () => {
      const localeKeys = new Set(flattenKeys(locale as AnyObj))
      const orphans = [...localeKeys].filter((k) => !enKeys.has(k))
      expect(orphans, `Orphan keys in ${name}.json:\n${orphans.join('\n')}`).toEqual([])
    })
  }
})
