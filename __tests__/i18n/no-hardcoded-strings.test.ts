import path from 'node:path'
import { describe, it, expect } from 'vitest'
import { audit } from '@/i18n/audit'

const projectRoot = path.resolve(__dirname, '../..')

// Files exempted from the guard test because they contain legal-text bodies
// that require per-locale legal review (deferred from Phase A -- see T13 spec).
// Adding entries here is OK but it's a stop-the-line review event; do not
// extend casually.
const LEGAL_TEXT_EXEMPT = new Set<string>([
  'src/app/[locale]/privacy-policy/page.tsx',
  'src/app/[locale]/terms-of-service/page.tsx',
  'src/app/[locale]/cookie-policy/page.tsx',
])

describe('no hardcoded strings in app pages and components', () => {
  it('reports zero literals after the i18n migration', async () => {
    const hits = await audit({
      projectRoot,
      roots: [path.join(projectRoot, 'src/app/[locale]'), path.join(projectRoot, 'src/components')],
      optionalFiles: [
        path.join(projectRoot, 'src/app/not-found.tsx'),
        path.join(projectRoot, 'src/app/error.tsx'),
        path.join(projectRoot, 'src/app/global-error.tsx'),
      ],
      exemptFiles: LEGAL_TEXT_EXEMPT,
    })
    const preview = hits
      .slice(0, 20)
      .map(h => `  ${path.relative(projectRoot, h.file)}:${h.line} (${h.reason}) ${h.match}`)
      .join('\n')
    const overflow = hits.length > 20 ? `\n  ... and ${hits.length - 20} more` : ''
    expect(
      hits,
      `Found ${hits.length} hardcoded literal(s). Translate them via next-intl, or add to the ALLOW set if they are brand names. To extend LEGAL_TEXT_EXEMPT, get explicit review.\n${preview}${overflow}`
    ).toEqual([])
  })
})
