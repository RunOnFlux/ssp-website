# SSP Translation Glossary

This glossary is the source of truth for translation policy across every
locale under `src/messages/`. It defines (a) terms that must never be
translated, (b) translation policies for ambiguous or domain-specific
terms, and (c) per-locale style notes.

New keys are translated directly into every locale file in the same change
that introduces them — there is no `__TODO_TRANSLATE__` placeholder stage
and no separate human-translator pass. When a term arises that _should_ be
locked or has an ambiguous translation, add it here in the same commit.

## 1. Locked terms — leave-as-is in every locale

These appear in English regardless of target locale. Brand names, project
names, technical identifiers, and well-known cryptocurrency/protocol names.

### Brand & product

- SSP
- Zelcore
- Flux
- InFlux Technologies, InFlux Technologies Limited

### Chains & coins

Maintained alongside `src/constants/supported-chains.ts`. Currently:

- Bitcoin (BTC), Litecoin (LTC), Dogecoin (DOGE), Bitcoin Cash (BCH), Zcash (ZEC)
- Ethereum (ETH), Polygon (MATIC), Avalanche (AVAX), BNB Smart Chain (BSC, BNB)
- Solana (SOL), Base, Arbitrum, Optimism

### Standards & protocols

- ERC-20, ERC-721, ERC-1155, ERC-4337
- Layer 1, Layer 2
- ZK-Rollup, Optimistic Rollup
- EIP-<number> (e.g. EIP-1559)

### Platforms (proper nouns)

- GitHub, Discord, X (Twitter), YouTube, Medium, Reddit, Telegram, Facebook, LinkedIn
- Google Play, App Store, iOS, Android

## 2. Term policy table

| English term              | Domain | Policy                                                                                        |
| ------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| self-custody              | crypto | Translate; preserve the "self-" prefix nuance (e.g. de "Selbstverwahrung", es "autocustodia") |
| multisig                  | crypto | Leave-as-is in body copy; in glossary-style definitions, optionally expand on first use       |
| seed phrase               | crypto | Translate to the locale's standard term (ja: シードフレーズ, ko: 시드 구문, zh: 助记词)       |
| recovery phrase           | crypto | Translate; same locale-standard convention as "seed phrase" — these are often interchangeable |
| hardware wallet           | crypto | Translate                                                                                     |
| dApp                      | crypto | Leave-as-is                                                                                   |
| smart contract            | crypto | Translate                                                                                     |
| gas fee                   | crypto | Translate                                                                                     |
| custodial / non-custodial | crypto | Translate; pair with "self-custody" policy                                                    |
| airdrop                   | crypto | Leave-as-is in most locales; ja/ko/zh: translate using the locale's standard rendering        |
| staking                   | crypto | Translate where a clear native term exists; otherwise leave-as-is                             |
| swap (verb)               | crypto | Translate using the locale's wallet-app convention                                            |
| Enterprise (nav label)    | UX     | Translate as the locale's B2B audience label (e.g. de "Unternehmen", fr "Entreprise", ja "法人向け"). "SSP Enterprise" as a product name stays English. |
| Academy (nav label)       | UX     | Translate as the locale's "learning/education section" label (e.g. de "Akademie", ja "アカデミー"). "SSP Academy" as a product name stays English. |

(Add rows as new terms surface.)

## 3. Per-locale style notes

### ja

- Register: です・ます throughout (polite)
- "seed phrase" → シードフレーズ (preferred over シード文)

### ko

- Register: formal (-습니다)
- "seed phrase" → 시드 구문

### zh

- Use 简体中文 (Simplified) — existing content already uses this register; do not switch to Traditional
- "seed phrase" → 助记词

### de

- Register: formal Sie (not du) for marketing copy
- "self-custody" → Selbstverwahrung

### fr

- Register: formal vous (not tu) for marketing copy

### pt-BR

- Use Brazilian Portuguese conventions
- "carteira" preferred over "wallet"

(Add per-locale notes as discovered during Phase 2.)

## 4. ICU placeholder protocol

All ICU placeholders must be preserved exactly. Examples:

- `{count}` → preserve `{count}` literally; do not translate the placeholder name
- `{count, plural, one {…} other {…}}` → preserve the structure including `one` / `other` keys (these are ICU plural categories, NOT translatable words). Translate only the bodies inside `{…}`
- `{role, select, admin {…} other {…}}` → same: preserve `select`, `admin`, `other` as control words; translate bodies
- `<link>...</link>` rich-text tags → preserve tag names verbatim; translate the text content between them
- `{date, date, long}` → preserve `date, long` formatting key

## 5. Markdown protocol

Markdown markup must be preserved:

- `**bold**` — preserve the `**` markers, translate the inside text
- `*italic*` — same
- `[link text](url)` — translate `link text`, preserve the URL
- `` `code` `` — preserve code spans verbatim (do not translate)
- Code blocks (` ``` `) — preserve verbatim
