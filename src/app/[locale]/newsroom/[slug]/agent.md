---
title: SSP Newsroom — Article
url: https://sspwallet.io/newsroom/{slug}
description: Individual newsroom article page, locale-aware with translation-pending banner support.
last_reviewed: 2026-05-08
---

# SSP Newsroom Article

Individual article pages served under `/newsroom/{slug}`. Content is fetched from
the CMS with locale awareness: if the requested locale has no translation, the
English fallback is served and a `<TranslationPendingBanner>` is shown to the
reader.

## Routing behaviour

- If the CMS returns a post with `section: 'academy'`, the request is permanently
  redirected to `/{locale}/academy/{category}/{slug}`.
- If the slug in the URL differs from the canonical slug returned by the CMS
  (e.g. after a slug rename), the request is permanently redirected to
  `/{locale}/newsroom/{post.slug}`.

## Locale handling

- `getPostBySlug(slug, locale)` — fetches with locale fallback.
- `post.servedLocale` is the locale actually served (may differ from `post.locale`
  when a translation is pending).
- The `<PostArticle>` component receives `showTranslationPendingBanner` when
  `post.servedLocale !== post.locale`.
- The `<article>` element carries `lang={post.servedLocale}` for correct browser
  and assistive-technology language signalling.

## Related components

- `src/components/shared/post-article.tsx`
- `src/components/shared/translation-pending-banner.tsx`
