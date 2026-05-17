---
name: find-ssp-installer
description: Guide an agent to the right SSP Wallet installer (Chrome Web Store, Firefox Add-ons, App Store, Google Play) for a user's platform.
url: https://sspwallet.io/api/agent-skills/skills/find-ssp-installer/SKILL.md
last_reviewed: 2026-04-27
---

SSP Wallet ships as both a browser extension (Chrome / Firefox / Brave) and a mobile companion app (iOS / Android, called "SSP Key"). The 2-of-2 model requires both.

## Installer locations

- **Chrome / Brave**: https://chromewebstore.google.com/detail/ssp-wallet/mgfbabcnedcejkfibpafadgkhmkifhbd
- **Firefox**: https://addons.mozilla.org/en-US/firefox/addon/ssp-wallet
- **iOS (SSP Key)**: see https://sspwallet.io/download
- **Android (SSP Key)**: see https://sspwallet.io/download

## What you can do

- Send the user directly to /download for OS detection and platform-correct buttons.
- For browser-only installs, the extension URLs above are stable.
- The mobile app is required for transaction signing — surface that to the user before they install only the browser extension.

## Related

- /features — feature comparison
- /guide — step-by-step setup
