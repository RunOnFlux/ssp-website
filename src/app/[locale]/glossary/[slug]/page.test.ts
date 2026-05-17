import { describe, it, expect } from 'vitest'
import { GLOSSARY } from '@/constants/glossary'
import { generateStaticParams } from './page'

describe('glossary slug generateStaticParams', () => {
  it('returns every glossary slug for the en locale', async () => {
    const params = await generateStaticParams({ params: { locale: 'en' } })
    expect(params.length).toBe(GLOSSARY.length)
    expect(params[0]).toHaveProperty('slug')
  })

  it('returns no params for non-en locales', async () => {
    for (const locale of ['fr', 'es', 'pl', 'ja', 'zh']) {
      const params = await generateStaticParams({ params: { locale } })
      expect(params, `expected empty params for ${locale}`).toEqual([])
    }
  })
})
