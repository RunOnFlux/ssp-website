---
title: SSP Newsroom
url: https://sspwallet.io/newsroom
description: News, product updates, and announcements from SSP Wallet.
last_reviewed: 2026-04-28
---

# SSP Newsroom

The SSP Newsroom is the canonical home for product announcements, release notes, and ecosystem news. Articles are surfaced in the user-facing UI and as machine-readable Markdown for AI agents and search bots.

## Sub-routes

- `/newsroom/{slug}` — individual article (Markdown form available via `Accept: text/markdown`)

## How to find an article

Each article is identified by a URL-safe slug. Article body, author, tags, and related links are rendered in the Markdown response. The full list of articles is available at `/newsroom`.
