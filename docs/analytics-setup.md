# Web Analytics — Setup

ssp-website reports to Google Analytics 4 via `gtag.js`, gated by user consent
through the cookie banner.

## Required environment variables

```sh
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

That's the only var required client-side. If unset, all tracking no-ops.

## What we report

- **Standard pageviews** — automatic via `gtag.js`.
- **Core Web Vitals** — `LCP`, `INP`, `CLS` as GA4 events with
  `metric_id`, `metric_value`, `metric_delta`, `metric_rating`,
  `debug_target` event params. See `src/components/analytics/web-vitals-reporter.tsx`.
- **Content context** — on academy/newsroom pages we attach
  `content_group`, `post_section`, `post_slug`, `post_locale` so reports
  can be filtered by section and language. See
  `src/components/analytics/page-context.tsx`.
- **CTAs** — `cta_click` / `form_submit` events fire on the highest-value
  CTAs: header Download buttons, download-page cards (Chrome/Firefox/Edge/Brave
  extensions, mobile section, Play Store, App Store), Enterprise launch
  buttons (hero / contact section / footer), and the contact form on
  successful submission.

### `cta_id` reference

| cta_id | Where | Notes |
|---|---|---|
| `download_header` | Top nav, desktop | |
| `download_header_mobile` | Top nav, mobile | |
| `download_option` | Download page extension/section cards | `platform` = the option's id (e.g. `chrome`, `firefox`, `mobile`). Note: `platform: 'mobile'` is a click on the "scroll to mobile section" card, not an actual install. |
| `download_mobile` | Download page Play Store / App Store anchors | `platform: 'android' \| 'ios'`. These are real install-intent taps. |
| `enterprise_launch_app` | Enterprise hero CTA | |
| `enterprise_launch_app_contact` | Enterprise contact section | |
| `enterprise_launch_app_footer` | Enterprise final CTA | |

## GA4 admin steps (one-time)

In GA4 admin → Custom definitions → register **event-scoped** custom dimensions
for these parameter names. GA4 only surfaces custom params in reports once
they're registered:

- `content_group`, `post_section`, `post_slug`, `post_locale`, `post_category`
- `platform`, `cta_id`, `form_id`, `placement`, `video_id`
- `target_host`, `target_url`, `network`, `percent`
- `metric_id`, `metric_value`, `metric_delta`, `metric_rating`, `debug_target`

Then in GA4 admin → Events → mark these as **Key events** (conversions):

- `cta_click` (filter to `cta_id` values you actually care about)
- `form_submit`

Web Vitals events surface automatically once received; no admin step.

## Consent

All custom events go through `trackEvent()` in `src/lib/gtag.ts`, which checks
`window.hasAnalyticsConsent()` (exposed by `src/components/cookie-consent.tsx`)
before forwarding to gtag. If the user hasn't accepted analytics cookies,
all events silently no-op.

## Adding new tracked events

Use the wrappers in `src/components/analytics/track.tsx`:

- `<TrackCtaButton ctaId="..." extra={{ ... }}>` — wraps a `<button>`.
- `<TrackOutboundLink href="...">` — wraps an `<a>` to an external URL; fires `outbound_click` with `target_host` and `target_url`.
- `<TrackVideoPlay videoId="..." placement="...">` — wraps content containing `<video>` elements; fires `video_play` once per video.
- `<TrackScrollDepth contentRef={...}>` — null-rendering component; fires `scroll_depth` at 25/50/75/100% milestones.

Or call `trackEvent(name, params)` directly from `@/lib/gtag` for ad-hoc events (e.g., from a form's `onSubmit` success branch).
