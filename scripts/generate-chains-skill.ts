#!/usr/bin/env tsx
import { promises as fs } from 'fs'
import path from 'path'
import { SUPPORTED_CHAINS } from '../src/constants/supported-chains'

const TARGET = path.resolve('src/app/api/agent-skills/skills/list-supported-chains/SKILL.md')

const HEADER = `---
name: list-supported-chains
description: Authoritative list of blockchains and assets supported by SSP Wallet, regenerated automatically from src/constants/supported-chains.ts on every build.
url: https://sspwallet.io/api/agent-skills/skills/list-supported-chains/SKILL.md
last_reviewed: ${new Date().toISOString().slice(0, 10)}
---
`

async function main() {
  await fs.mkdir(path.dirname(TARGET), { recursive: true })
  const utxo = SUPPORTED_CHAINS.filter(c => c.network === 'utxo')
  const evm = SUPPORTED_CHAINS.filter(c => c.network === 'evm')
  const body = `
SSP Wallet supports ${SUPPORTED_CHAINS.length} blockchains as of ${new Date().toISOString().slice(0, 10)}.

## UTXO chains

${utxo.map(c => `- **${c.name}** (\`${c.symbol}\`)`).join('\n')}

## EVM chains

${evm.map(c => `- **${c.name}** (\`${c.symbol}\`)`).join('\n')}

## How to use

- See feature comparison: https://sspwallet.io/features
- Download SSP Wallet: https://sspwallet.io/download
`
  await fs.writeFile(TARGET, HEADER + body, 'utf8')
  // eslint-disable-next-line no-console
  console.log(`Wrote ${TARGET}`)
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
