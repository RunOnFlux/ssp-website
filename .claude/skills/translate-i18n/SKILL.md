---
name: translate-i18n
description: Translate one ssp-website locale's messages JSON file from English source, using the project glossary. Invoked once per (target locale) during Phase 2 of i18n Wave 1.
---

# translate-i18n

This skill is invoked by a parent agent (typically running
`superpowers:subagent-driven-development` for Phase 2 of the i18n Wave 1
plan) to translate one locale's `src/messages/<locale>.json` file.

## Inputs (provided in the parent's invocation prompt)

- **`--source`** — absolute path to source locale JSON (typically
  `/Users/vasilismagkoutis/repos/ssp-website/.worktrees/i18n-wave1-locale-expansion/src/messages/en.json`)
- **`--target`** — target BCP-47 locale code (e.g. `pt-BR`, `ru`, `ja`). Must
  be in `routing.locales` from `src/i18n/routing.ts` and must not be `en`.
- **`--glossary`** — absolute path to `docs/i18n/glossary.md`
- **`--output`** — absolute path to write the target locale JSON (typically
  `src/messages/<locale>.json`)

## Procedure

1. **Read** `--source` and `--glossary` end-to-end.
2. **Walk** the source JSON tree. For each string value:
   - If the value still has the `__TODO_TRANSLATE__ ` prefix (from the
     scaffold-locale script), strip the marker and treat the remainder as the
     English source to translate.
   - If the value does not have the marker, treat the entire value as English
     source.
   - Produce a translation that:
     - Preserves every ICU placeholder verbatim (see glossary section 4)
     - Preserves every markdown marker (see glossary section 5)
     - Never translates any locked term from glossary section 1
     - Follows per-term policy from glossary section 2
     - Follows per-locale style notes from glossary section 3
3. **Write** the output JSON to `--output`, preserving the exact key
   structure and ordering of the source.
4. **Self-check pass.** Re-read your output and verify:
   - Every ICU placeholder pattern present in source appears in output
   - No locked term has been translated (search the output for each glossary
     section 1 entry — they must appear verbatim, in English)
   - No value is empty
   - No `__TODO_TRANSLATE__` marker survives in the output
   - Key structure matches source (same keys, same nesting, same order)
5. **Report** to stdout:
   - Lines translated
   - Any per-locale notes worth adding to the glossary (these go in the PR
     description for the parent agent to incorporate)
   - Any source strings that were structurally suspicious (empty, contained
     only placeholders, etc.) — flagged for review

## Failure modes

- If the source file does not exist or is not valid JSON, exit with stderr
  message and non-zero status.
- If the target locale is `en` or is not in `routing.locales`, exit with
  stderr message and non-zero status.
- If the glossary file does not exist, exit with stderr message and
  non-zero status.
- If a single string fails to translate (e.g. an unhandled ICU edge case),
  do not abort the whole file — leave that key with its original
  `__TODO_TRANSLATE__ <english>` value and flag it in the report.

## Notes

- This skill does no codebase modification beyond writing the `--output` file.
- The parent agent is responsible for git operations (staging, committing,
  reviewing).
- Phase 2's parent agent dispatches one invocation per new locale in
  parallel. Each invocation is independent; subagents do not coordinate.
