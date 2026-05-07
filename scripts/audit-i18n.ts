#!/usr/bin/env tsx
// CLI wrapper around the i18n audit library. Walks the same surfaces as the
// guard test (see `__tests__/i18n/no-hardcoded-strings.test.ts`) but reports
// every hit -- including the legal-text-body backlog the test exempts -- so
// developers can see the full worklist on demand.

import path from 'node:path'
import { audit, formatHits } from '../src/i18n/audit'

async function main(): Promise<void> {
  const projectRoot = process.cwd()
  const hits = await audit({
    projectRoot,
    roots: [path.join(projectRoot, 'src/app/[locale]'), path.join(projectRoot, 'src/components')],
    optionalFiles: [
      path.join(projectRoot, 'src/app/not-found.tsx'),
      path.join(projectRoot, 'src/app/error.tsx'),
      path.join(projectRoot, 'src/app/global-error.tsx'),
    ],
  })
  process.stdout.write(formatHits(hits, projectRoot))
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
