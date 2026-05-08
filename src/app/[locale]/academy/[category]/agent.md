---
title: SSP Academy — Category Hub
url: https://sspwallet.io/academy/{category}
description: Category landing page listing all academy posts for a given topic.
last_reviewed: 2026-05-08
---

# SSP Academy — Category Hub

Renders the post listing for a single academy category. Category title and description are sourced from the `Categories` next-intl namespace (not the API). A `LocaleBadge` overlay is shown per card when the served locale differs from the requested locale.

## Notes

- `generateStaticParams` emits one route per `ACADEMY_CATEGORY_SLUGS` entry.
- Invalid category slugs trigger `notFound()`.
- Empty categories show a fallback with links to three other categories.
