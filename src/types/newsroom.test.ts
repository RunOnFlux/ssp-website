import { describe, it, expectTypeOf } from 'vitest'
import type { NewsroomPost, Author, ArticleSection } from './newsroom'

describe('NewsroomPost', () => {
  it('compiles', () => {
    expectTypeOf<NewsroomPost['section']>().toEqualTypeOf<ArticleSection>()
    expectTypeOf<Author['slug']>().toEqualTypeOf<string>()
  })
})
