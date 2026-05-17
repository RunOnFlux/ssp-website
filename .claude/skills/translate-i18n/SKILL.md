---
name: translate-i18n
description: Translate one ssp-website locale's messages JSON file from the canonical English source, using the project glossary. Used when adding a new locale or backfilling missing keys.
---

# translate-i18n

This skill translates one locale's `src/messages/<locale>.json` file directly from `src/messages/en.json`, applying the policies in `docs/i18n/glossary.md`. There is no `__TODO_TRANSLATE__` placeholder stage — every string is translated before the file is written.

## Inputs (provided in the invocation prompt)

- **`--source`** — absolute path to the source English JSON (typically `src/messages/en.json`).
- **`--target`** — target BCP-47 locale code (e.g. `pt-BR`, `ru`, `ja`). Must be in `routing.locales` from `src/i18n/routing.ts` and must not be `en`.
- **`--glossary`** — absolute path to `docs/i18n/glossary.md`.
- **`--output`** — absolute path to write the target locale JSON (typically `src/messages/<locale>.json`).

## Procedure

1. **Read** `--source` and `--glossary` end-to-end.
2. **Walk** the source JSON tree. For each string value, produce a translation that:
   - Preserves every ICU placeholder verbatim (see glossary section 4).
   - Preserves every markdown marker (see glossary section 5).
   - Never translates any locked term from glossary section 1.
   - Follows per-term policy from glossary section 2.
   - Follows per-locale style notes from glossary section 3.
3. **Write** the output JSON to `--output`, preserving the exact key structure and ordering of the source.
4. **Self-check pass.** Re-read your output and verify:
   - Every ICU placeholder pattern present in source appears in output.
   - No locked term has been translated (search the output for each glossary section 1 entry — they must appear verbatim, in English).
   - No value is empty.
   - No `__TODO_TRANSLATE__` marker is present (it must never appear in committed files).
   - Key structure matches source (same keys, same nesting, same order).
5. **Report** to stdout:
   - Lines translated.
   - Any per-locale notes worth adding to the glossary.
   - Any source strings that were structurally suspicious (empty, contained only placeholders, etc.) — flagged for review.

## Failure modes

- If the source file does not exist or is not valid JSON, exit with stderr message and non-zero status.
- If the target locale is `en` or is not in `routing.locales`, exit with stderr message and non-zero status.
- If the glossary file does not exist, exit with stderr message and non-zero status.
- If a single string fails to translate (e.g. an unhandled ICU edge case), do not abort the whole file — leave that key with the English source value and flag it in the report so a follow-up pass can resolve it.

## Notes

- This skill does no codebase modification beyond writing the `--output` file.
- The caller is responsible for git operations (staging, committing, reviewing).
- Invocations are independent; when translating multiple locales, dispatch one invocation per locale in parallel.
