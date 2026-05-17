# CMS integration guide

How to connect a remote CMS to this site so it stops using the seeded Markdown fallback.

## Switching modes

The site checks two environment variables on startup:

```
SSP_CMS_URL=https://your-cms.example.com
SSP_CMS_API_KEY=your-api-key
```

Set both in `.env.local` (development) or in your hosting provider's environment configuration (production). When both are present every page calls the CMS first. If the CMS returns an error, the site silently falls back to `/content/` and logs a warning to stderr — production outages are observable, but the user never sees a broken page.

When either variable is unset the site uses the seed Markdown in `/content/` unconditionally.

## API contract

All endpoints use `GET` unless noted. Every request carries the header:

```
x-api-key: <value of SSP_CMS_API_KEY>
```

All responses must be `Content-Type: application/json`.

| Path                    | Query params                                                               | Returns                                         | Used by                    |
| ----------------------- | -------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------- |
| `/api/v1/posts`         | `section=newsroom`, `limit=100`                                            | `NewsroomPost[]` or `{ posts: NewsroomPost[] }` | `getAllPosts()`            |
| `/api/v1/posts/:slug`   | —                                                                          | `NewsroomPost`                                  | `getPostBySlug(slug)`      |
| `/api/v1/posts`         | `section=academy`, `category`, `difficulty`, `series`, `featured`, `limit` | `NewsroomPost[]` or `{ posts: NewsroomPost[] }` | `getAcademyPosts(filters)` |
| `/api/v1/categories`    | —                                                                          | `CategoryWithCount[]`                           | `getCategories()`          |
| `/api/v1/series`        | —                                                                          | `SeriesSummary[]`                               | `getAllSeries()`           |
| `/api/v1/series/:slug`  | —                                                                          | `SeriesDetail`                                  | `getSeriesBySlug(slug)`    |
| `/api/v1/authors/:slug` | —                                                                          | `Author`                                        | `getAuthorBySlug(slug)`    |
| `/api/v1/tags`          | —                                                                          | `{ tag: string; count: number }[]`              | `getAllTags()`             |

For exact response shapes, `src/types/newsroom.ts` is the authoritative type definition.

Both `NewsroomPost[]` and the wrapped `{ posts: NewsroomPost[] }` envelope are accepted for list endpoints — the client normalises either shape.

## Caching

Every CMS call is cached at two layers:

- **HTTP layer:** `next: { revalidate: 60 }` for listings, `next: { revalidate: 300 }` for single resources. Next.js extends the fetch cache accordingly.
- **Application layer:** `LRUCache` in `src/lib/cms.ts` with a 60 s TTL and 256 entry limit. This cache covers both the CMS and seed-fallback paths.

To force revalidation from the CMS side simply wait for the longest TTL (300 s for individual posts). You do not need to call a revalidation endpoint unless you want instant propagation.

## Fallback behaviour

When `SSP_CMS_URL` or `SSP_CMS_API_KEY` is unset, or a CMS request throws:

1. The site calls `loadAllSeedPosts()` which reads Markdown files from `/content/` using gray-matter.
2. Author profiles fall back to JSON files in `content/authors/`.
3. A warning is logged to stderr: `[cms] primary failed for <key>, falling back to seed`.

The fallback produces the same `NewsroomPost` and `Author` shapes as the CMS, so no component code changes when switching modes.

## Migrating articles from /content/ to a CMS

When you stand up a CMS and want to move the seed content over:

1. POST each `content/newsroom/*.md` article to the CMS as a new post with `section: "newsroom"`.
2. POST each `content/academy/<category>/*.md` article with the matching `section: "academy"` and `category`.
3. Preserve the `slug` field exactly — it is the URL path segment.
4. Preserve `slugHistory` if any article has been renamed, so the site can emit permanent redirects for old URLs.
5. POST each `content/authors/*.json` author record.
6. Set `SSP_CMS_URL` and `SSP_CMS_API_KEY` in your production environment.
7. Verify the site is serving CMS content (check the stderr logs — no `[cms] primary failed` lines should appear).
8. Remove the seed Markdown from `/content/` if you want to keep the repository clean. This is optional — the files are harmless when env vars are set because the seed loader is never reached.

## Environment-flag override

Set `AGENT_MD=0` to disable the `Accept: text/markdown` content-negotiation path in `src/middleware.ts`. The flag is useful for diagnostics when you want to verify the HTML rendering path without agent negotiation interfering.

```
AGENT_MD=0
```

This flag does not affect the CMS connection.
