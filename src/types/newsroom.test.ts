import { describe, it, expectTypeOf } from 'vitest'
import type { Locale } from '@/i18n/routing'
import type { NewsroomPost, SeriesSummary, SeriesDetail, Author, ArticleSection } from './newsroom'

describe('NewsroomPost', () => {
  it('compiles', () => {
    expectTypeOf<NewsroomPost['section']>().toEqualTypeOf<ArticleSection>()
    expectTypeOf<Author['slug']>().toEqualTypeOf<string>()
  })
})

describe('locale fields', () => {
  it('NewsroomPost has locale and servedLocale', () => {
    expectTypeOf<NewsroomPost>().toHaveProperty('locale').toEqualTypeOf<Locale>()
    expectTypeOf<NewsroomPost>().toHaveProperty('servedLocale').toEqualTypeOf<Locale>()
  })
  it('SeriesSummary has locale and servedLocale', () => {
    expectTypeOf<SeriesSummary>().toHaveProperty('locale').toEqualTypeOf<Locale>()
    expectTypeOf<SeriesSummary>().toHaveProperty('servedLocale').toEqualTypeOf<Locale>()
  })
  it('SeriesDetail has locale and servedLocale', () => {
    expectTypeOf<SeriesDetail>().toHaveProperty('locale').toEqualTypeOf<Locale>()
    expectTypeOf<SeriesDetail>().toHaveProperty('servedLocale').toEqualTypeOf<Locale>()
  })
})
