#!/usr/bin/env tsx
// Fails build if any page.tsx in src/app/[locale]/** was modified in the
// most-recent commit without its sibling agent.md being touched in the same commit.
// Escape hatch: include "[agent-md-skip]" in the commit message.

import { execSync } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

async function main() {
  const lastMessage = execSync('git log -1 --pretty=%B').toString()
  if (lastMessage.includes('[agent-md-skip]')) {
    // eslint-disable-next-line no-console
    console.log('agent.md staleness check skipped via [agent-md-skip] marker')
    return
  }

  const changed = execSync('git diff --name-only HEAD~1 HEAD || git diff --name-only --cached')
    .toString()
    .split('\n')
    .filter(Boolean)

  const offenders: string[] = []
  for (const file of changed) {
    if (!file.match(/^src\/app\/\[locale\]\/.+\/page\.tsx$/)) continue
    const dir = path.dirname(file)
    const agentMd = path.join(dir, 'agent.md')
    try {
      await fs.access(agentMd)
    } catch {
      continue // no sibling = not required
    }
    if (!changed.includes(agentMd)) {
      offenders.push(`${file} was modified but its sibling ${agentMd} was not.`)
    }
  }

  if (offenders.length > 0) {
    // eslint-disable-next-line no-console
    console.error('agent.md staleness check FAILED:')
    for (const o of offenders)
      // eslint-disable-next-line no-console
      console.error(`  - ${o}`)
    // eslint-disable-next-line no-console
    console.error(
      '\nFix: update the sibling agent.md in the same commit, OR add "[agent-md-skip]" to the commit message with a one-line reason.'
    )
    process.exit(1)
  }
  // eslint-disable-next-line no-console
  console.log('agent.md staleness check passed.')
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
