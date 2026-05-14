# Top-nav and locale-switcher polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drop the chevron on the Learn nav trigger, move Newsroom into the Learn dropdown, and trim the locale switcher to a globe-only trigger backed by next-intl's cookie persistence.

**Architecture:** Three surgical changes on the public website's top bar. Extend the shadcn `NavigationMenuTrigger` with an opt-in `hideIndicator` prop; reorder the Learn dropdown items with Newsroom first; delete the locale label from the switcher trigger. Persistence rides on next-intl's existing `NEXT_LOCALE` cookie — no new mechanism added, just test coverage for the contract.

**Tech Stack:** Next.js 16 App Router, next-intl 4.9, React 19, Radix `NavigationMenu` (via shadcn), lucide-react icons, Vitest 4 + happy-dom + `@testing-library/react`.

**Spec:** [`docs/superpowers/specs/2026-05-14-top-nav-and-locale-switcher-polish-design.md`](../specs/2026-05-14-top-nav-and-locale-switcher-polish-design.md)

**Branch:** `feat/newsroom-academy-app-router-migration` (the same branch the spec was committed to). No new branch, no new worktree — the public website lives in `/Users/vasilismagkoutis/repos/ssp-website/` and is already on this branch.

---

## File Map

| File | Action |
|---|---|
| `src/components/ui/navigation-menu.tsx` | **Modify** — add `hideIndicator?: boolean` prop to `NavigationMenuTrigger`. |
| `src/components/ui/navigation-menu.test.tsx` | **Create** — covers chevron-default vs. `hideIndicator` behavior. |
| `src/components/header/learn-dropdown.tsx` | **Modify** — reorder items with Newsroom first, pass `hideIndicator` to trigger. |
| `src/components/header/learn-dropdown.test.tsx` | **Modify** — extend to cover the new item order and `hideIndicator` plumbing. |
| `src/components/header/learn-mobile-section.tsx` | **Modify** — reorder mobile items with Newsroom first. |
| `src/components/header/learn-mobile-section.test.tsx` | **Create** — covers the new mobile item order. |
| `src/components/header/header.tsx` | **Modify** — drop standalone Newsroom from `primaryNav`; extend `isLearnActive` to include `/newsroom` paths. |
| `src/components/header/locale-switcher.tsx` | **Modify** — remove the locale-label `<span>` from the trigger; add an inline comment naming `NEXT_LOCALE` as the persistence mechanism. |
| `src/components/header/locale-switcher.test.tsx` | **Create** — assert the trigger has the Globe icon and no text label. |
| `src/middleware.test.ts` | **Create** — assert cookie wins over `Accept-Language` and that `Accept-Language` is honored when no cookie is set. |
| `src/messages/en.json` … `src/messages/id.json` (14 files) | **Modify** — add `Header.learnNewsroomDescription`. |

---

## Task 1: Add `hideIndicator` prop to `NavigationMenuTrigger`

**Files:**
- Modify: `src/components/ui/navigation-menu.tsx:42-58`
- Create test: `src/components/ui/navigation-menu.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/ui/navigation-menu.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu'

function setup(trigger: React.ReactNode) {
  return render(
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>{trigger}</NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

describe('NavigationMenuTrigger', () => {
  it('renders the chevron indicator by default', () => {
    const { container } = setup(<NavigationMenuTrigger>Open</NavigationMenuTrigger>)
    const trigger = container.querySelector('button')
    expect(trigger).not.toBeNull()
    expect(trigger?.querySelector('svg')).not.toBeNull()
  })

  it('omits the chevron indicator when hideIndicator is true', () => {
    const { container } = setup(
      <NavigationMenuTrigger hideIndicator>Open</NavigationMenuTrigger>
    )
    const trigger = container.querySelector('button')
    expect(trigger).not.toBeNull()
    expect(trigger?.querySelector('svg')).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test, verify it fails**

```
yarn test src/components/ui/navigation-menu.test.tsx
```

Expected: the second test fails because `hideIndicator` is not a real prop yet — the chevron is rendered unconditionally.

- [ ] **Step 3: Add the `hideIndicator` prop**

Replace the `NavigationMenuTrigger` definition in `src/components/ui/navigation-menu.tsx` (lines 42–58) with:

```tsx
const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & {
    hideIndicator?: boolean
  }
>(({ className, children, hideIndicator, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
  >
    {children}
    {!hideIndicator && (
      <ChevronDown
        className='relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180'
        aria-hidden='true'
      />
    )}
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName
```

- [ ] **Step 4: Run the test, verify it passes**

```
yarn test src/components/ui/navigation-menu.test.tsx
```

Expected: both tests pass.

- [ ] **Step 5: Commit**

```
git add src/components/ui/navigation-menu.tsx src/components/ui/navigation-menu.test.tsx
git commit -m "feat(ui): add hideIndicator prop to NavigationMenuTrigger"
```

---

## Task 2: Add the `learnNewsroomDescription` key to all 14 locale message files

**Files:**
- Modify: `src/messages/en.json`
- Modify: `src/messages/es.json`
- Modify: `src/messages/zh.json`
- Modify: `src/messages/pt-BR.json`
- Modify: `src/messages/ru.json`
- Modify: `src/messages/tr.json`
- Modify: `src/messages/ja.json`
- Modify: `src/messages/de.json`
- Modify: `src/messages/fr.json`
- Modify: `src/messages/it.json`
- Modify: `src/messages/pl.json`
- Modify: `src/messages/ko.json`
- Modify: `src/messages/vi.json`
- Modify: `src/messages/id.json`

- [ ] **Step 1: Insert the new key into each locale file**

In every file under `src/messages/`, find the `Header` block — it ends with `"learnGlossaryDescription": "<...>"` followed by a closing `}`. Add `"learnNewsroomDescription": "<localized string>"` as a new key after `"learnGlossaryDescription"`. Remember to add a trailing comma to the `learnGlossaryDescription` line so JSON stays valid.

Use the exact values below.

| Locale | Value |
|---|---|
| `en.json` | `"Latest announcements and product updates"` |
| `es.json` | `"Últimos anuncios y novedades del producto"` |
| `zh.json` | `"最新公告与产品更新"` |
| `pt-BR.json` | `"Últimos anúncios e atualizações do produto"` |
| `ru.json` | `"Последние анонсы и обновления продукта"` |
| `tr.json` | `"Son duyurular ve ürün güncellemeleri"` |
| `ja.json` | `"最新のお知らせとプロダクトのアップデート"` |
| `de.json` | `"Neueste Ankündigungen und Produkt-Updates"` |
| `fr.json` | `"Dernières annonces et mises à jour produit"` |
| `it.json` | `"Ultimi annunci e aggiornamenti del prodotto"` |
| `pl.json` | `"Najnowsze ogłoszenia i aktualizacje produktu"` |
| `ko.json` | `"최신 공지사항 및 제품 업데이트"` |
| `vi.json` | `"Thông báo mới nhất và cập nhật sản phẩm"` |
| `id.json` | `"Pengumuman terbaru dan pembaruan produk"` |

Example (en.json, after the edit):

```jsonc
    "learnAcademyDescription": "Long-form articles organized by category",
    "learnSeriesDescription": "Guided multi-part learning paths",
    "learnGlossaryDescription": "Crypto and SSP terms, 2,000+ entries",
    "learnNewsroomDescription": "Latest announcements and product updates"
  },
```

- [ ] **Step 2: Verify all 14 files parse as JSON**

```
node -e "['en','es','zh','pt-BR','ru','tr','ja','de','fr','it','pl','ko','vi','id'].forEach(l => { JSON.parse(require('fs').readFileSync('src/messages/' + l + '.json', 'utf8')); console.log(l, 'ok') })"
```

Expected: 14 lines printed, each ending in `ok`. Any `SyntaxError` means a missing comma or stray quote — fix and re-run.

- [ ] **Step 3: Run type-check**

```
yarn type-check
```

Expected: passes. next-intl validates that messages files keep matching shapes at type-check time.

- [ ] **Step 4: Commit**

```
git add src/messages/en.json src/messages/es.json src/messages/zh.json src/messages/pt-BR.json src/messages/ru.json src/messages/tr.json src/messages/ja.json src/messages/de.json src/messages/fr.json src/messages/it.json src/messages/pl.json src/messages/ko.json src/messages/vi.json src/messages/id.json
git commit -m "i18n(header): add learnNewsroomDescription for all 14 locales"
```

---

## Task 3: Newsroom-first dropdown items + `hideIndicator` in `LearnDropdown`

**Files:**
- Modify: `src/components/header/learn-dropdown.tsx`
- Modify: `src/components/header/learn-dropdown.test.tsx`

- [ ] **Step 1: Write the failing tests**

Replace the contents of `src/components/header/learn-dropdown.test.tsx` with:

```tsx
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect, vi } from 'vitest'
import { LearnDropdown, buildLearnDropdownItems } from './learn-dropdown'

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const messages = {
  Header: {
    learn: 'Learn',
    newsroom: 'Newsroom',
    academy: 'Academy',
    series: 'Series',
    learnGlossary: 'Glossary',
    learnNewsroomDescription: 'Latest announcements',
    learnAcademyDescription: 'Articles by category',
    learnSeriesDescription: 'Multi-part paths',
    learnGlossaryDescription: 'Crypto terms',
  },
}

function renderDropdown(isActive = false) {
  return render(
    <NextIntlClientProvider locale='en' messages={messages}>
      <LearnDropdown isActive={isActive} />
    </NextIntlClientProvider>
  )
}

describe('LearnDropdown', () => {
  it('renders the trigger label "Learn"', () => {
    renderDropdown()
    expect(screen.getByText('Learn')).toBeInTheDocument()
  })

  it('applies active class when isActive is true', () => {
    const { container } = renderDropdown(true)
    const trigger = container.querySelector('[data-active]') ?? container.querySelector('button')
    expect(trigger?.className).toMatch(/text-primary/)
  })

  it('hides the chevron indicator on the trigger', () => {
    const { container } = renderDropdown()
    const trigger = container.querySelector('button')
    expect(trigger).not.toBeNull()
    expect(trigger?.querySelector('svg')).toBeNull()
  })

  it('places Newsroom first, then Academy, Series, Glossary in the items list', () => {
    // Radix mounts content lazily; we read the items via the named export
    // instead of opening the dropdown in happy-dom.
    const items = buildLearnDropdownItems(
      (k: string) => messages.Header[k as keyof typeof messages.Header] ?? k
    )
    expect(items.map(i => i.href)).toEqual([
      '/newsroom',
      '/academy',
      '/academy/series',
      '/glossary',
    ])
    expect(items[0].label).toBe('Newsroom')
    expect(items[0].desc).toBe('Latest announcements')
  })
})
```

- [ ] **Step 2: Run the test, verify it fails**

```
yarn test src/components/header/learn-dropdown.test.tsx
```

Expected: the "hides the chevron" test fails because the existing dropdown does not pass `hideIndicator`. The "Newsroom first" test fails because the items array currently starts with Academy and `__testItems` is not exported.

- [ ] **Step 3: Update the component**

Replace the contents of `src/components/header/learn-dropdown.tsx` with:

```tsx
'use client'

import { BookA, BookOpen, Compass, Newspaper } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Link } from '@/i18n/navigation'

interface Props {
  isActive: boolean
}

type Translator = (key: string) => string

export function buildLearnDropdownItems(t: Translator) {
  return [
    {
      href: '/newsroom' as const,
      icon: Newspaper,
      label: t('newsroom'),
      desc: t('learnNewsroomDescription'),
    },
    {
      href: '/academy' as const,
      icon: BookOpen,
      label: t('academy'),
      desc: t('learnAcademyDescription'),
    },
    {
      href: '/academy/series' as const,
      icon: Compass,
      label: t('series'),
      desc: t('learnSeriesDescription'),
    },
    {
      href: '/glossary' as const,
      icon: BookA,
      label: t('learnGlossary'),
      desc: t('learnGlossaryDescription'),
    },
  ]
}

export function LearnDropdown({ isActive }: Props) {
  const t = useTranslations('Header')
  const items = buildLearnDropdownItems(t)

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            hideIndicator
            className={isActive ? 'text-primary-600 dark:text-primary-400' : ''}
            data-active={isActive || undefined}
          >
            {t('learn')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid w-[360px] gap-2 p-3'>
              {items.map(item => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className='dark:hover:bg-dark-800 flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-gray-50'
                    >
                      <item.icon className='mt-1 h-5 w-5 shrink-0' />
                      <div>
                        <div className='font-medium text-gray-900 dark:text-white'>
                          {item.label}
                        </div>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{item.desc}</p>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
```

- [ ] **Step 4: Run the test, verify it passes**

```
yarn test src/components/header/learn-dropdown.test.tsx
```

Expected: all four tests pass.

- [ ] **Step 5: Commit**

```
git add src/components/header/learn-dropdown.tsx src/components/header/learn-dropdown.test.tsx
git commit -m "feat(header): newsroom-first Learn dropdown, drop chevron indicator"
```

---

## Task 4: Newsroom-first items in `LearnMobileSection`

**Files:**
- Modify: `src/components/header/learn-mobile-section.tsx`
- Create test: `src/components/header/learn-mobile-section.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/header/learn-mobile-section.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect, vi } from 'vitest'
import { LearnMobileSection } from './learn-mobile-section'

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const messages = {
  Header: {
    learn: 'Learn',
    newsroom: 'Newsroom',
    academy: 'Academy',
    series: 'Series',
    learnGlossary: 'Glossary',
  },
}

function renderMobile(pathname = '/') {
  return render(
    <NextIntlClientProvider locale='en' messages={messages}>
      <LearnMobileSection pathname={pathname} onItemClick={() => {}} />
    </NextIntlClientProvider>
  )
}

describe('LearnMobileSection', () => {
  it('renders the Learn section header', () => {
    renderMobile()
    expect(screen.getByText('Learn')).toBeInTheDocument()
  })

  it('renders Newsroom, Academy, Series, Glossary in that order', () => {
    const { container } = renderMobile()
    const links = Array.from(container.querySelectorAll('a'))
    expect(links.map(a => a.getAttribute('href'))).toEqual([
      '/newsroom',
      '/academy',
      '/academy/series',
      '/glossary',
    ])
  })

  it('highlights the Newsroom item when the pathname is /newsroom', () => {
    const { container } = renderMobile('/newsroom')
    const newsroomLink = container.querySelector('a[href="/newsroom"]')
    expect(newsroomLink?.className).toMatch(/text-primary/)
  })

  it('highlights the Newsroom item when the pathname is /newsroom/some-slug', () => {
    const { container } = renderMobile('/newsroom/some-slug')
    const newsroomLink = container.querySelector('a[href="/newsroom"]')
    expect(newsroomLink?.className).toMatch(/text-primary/)
  })
})
```

- [ ] **Step 2: Run the test, verify it fails**

```
yarn test src/components/header/learn-mobile-section.test.tsx
```

Expected: the "renders Newsroom, Academy, Series, Glossary in that order" test fails because Newsroom is not in the items list yet. The two `/newsroom` highlight tests also fail.

- [ ] **Step 3: Update the component**

Replace the contents of `src/components/header/learn-mobile-section.tsx` with:

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface Props {
  pathname: string
  onItemClick: () => void
}

type MobileHref = '/newsroom' | '/academy' | '/academy/series' | '/glossary'

export function LearnMobileSection({ pathname, onItemClick }: Props) {
  const t = useTranslations('Header')

  const items: Array<{ href: MobileHref; label: string }> = [
    { href: '/newsroom', label: t('newsroom') },
    { href: '/academy', label: t('academy') },
    { href: '/academy/series', label: t('series') },
    { href: '/glossary', label: t('learnGlossary') },
  ]

  return (
    <div className='py-2'>
      <div className='px-4 pt-2 pb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400'>
        {t('learn')}
      </div>
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onItemClick}
          className={cn(
            'block px-6 py-2 text-base font-medium transition-colors duration-200',
            pathname === item.href || pathname.startsWith(item.href + '/')
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
              : 'hover:text-primary-600 dark:hover:bg-dark-800 dark:hover:text-primary-400 text-gray-700 hover:bg-gray-50 dark:text-gray-300'
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run the test, verify it passes**

```
yarn test src/components/header/learn-mobile-section.test.tsx
```

Expected: all four tests pass.

- [ ] **Step 5: Commit**

```
git add src/components/header/learn-mobile-section.tsx src/components/header/learn-mobile-section.test.tsx
git commit -m "feat(header): add Newsroom to mobile Learn section"
```

---

## Task 5: Drop standalone Newsroom from `Header` and extend `isLearnActive`

**Files:**
- Modify: `src/components/header/header.tsx:26-49`

- [ ] **Step 1: Drop the standalone Newsroom entry from `primaryNav`**

In `src/components/header/header.tsx`, find the `primaryNav` array (around lines 26–35) and delete the line:

```tsx
    { kind: 'link', name: t('newsroom'), href: '/newsroom' },
```

After the edit, the array should read:

```tsx
  const primaryNav: NavItem[] = [
    { kind: 'link', name: t('home'), href: '/' },
    { kind: 'link', name: t('enterprise'), href: '/enterprise' },
    { kind: 'link', name: t('features'), href: '/features' },
    { kind: 'group', key: 'learn', name: t('learn') },
    { kind: 'link', name: t('guide'), href: '/guide' },
    { kind: 'link', name: t('support'), href: '/support' },
    { kind: 'link', name: t('contact'), href: '/contact' },
  ]
```

- [ ] **Step 2: Extend `isLearnActive` to include `/newsroom` paths**

In the same file, replace the `isLearnActive` definition (around lines 45–49) with:

```tsx
  const isLearnActive =
    pathname === '/academy' ||
    pathname.startsWith('/academy/') ||
    pathname === '/glossary' ||
    pathname.startsWith('/glossary/') ||
    pathname === '/newsroom' ||
    pathname.startsWith('/newsroom/')
```

- [ ] **Step 3: Run type-check and existing tests**

```
yarn type-check
yarn test src/components/header/
```

Expected: type-check passes, all header tests pass. (No new test in this task — the active-state behavior is exercised by the mobile section test added in Task 4, and the manual smoke at the end verifies the dropdown trigger lights up correctly.)

- [ ] **Step 4: Commit**

```
git add src/components/header/header.tsx
git commit -m "feat(header): remove top-level Newsroom link, extend isLearnActive for /newsroom"
```

---

## Task 6: Trim `LocaleSwitcher` to globe-only

**Files:**
- Modify: `src/components/header/locale-switcher.tsx:43-53`
- Create test: `src/components/header/locale-switcher.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/header/locale-switcher.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect, vi } from 'vitest'
import { LocaleSwitcher } from './locale-switcher'

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/',
}))

vi.mock('@/lib/i18n/localized-paths', () => ({
  useLocalizedPaths: () => ({}),
}))

const messages = { Header: { selectLanguage: 'Select language' } }

function renderSwitcher() {
  return render(
    <NextIntlClientProvider locale='en' messages={messages}>
      <LocaleSwitcher />
    </NextIntlClientProvider>
  )
}

describe('LocaleSwitcher', () => {
  it('renders the trigger with the Globe icon and no visible locale label text', () => {
    const { container } = renderSwitcher()
    const trigger = container.querySelector('button[aria-label="Select language"]')
    expect(trigger).not.toBeNull()
    expect(trigger?.querySelector('svg')).not.toBeNull()
    expect(trigger?.textContent?.trim()).toBe('')
  })
})
```

- [ ] **Step 2: Run the test, verify it fails**

```
yarn test src/components/header/locale-switcher.test.tsx
```

Expected: fails because the trigger's `textContent` is currently `English` (or whatever the locale label is).

- [ ] **Step 3: Update the component**

Replace the contents of `src/components/header/locale-switcher.tsx` with:

```tsx
'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Globe } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { type Locale, routing } from '@/i18n/routing'
import { useLocalizedPaths } from '@/lib/i18n/localized-paths'

// Persistence rides on the `NEXT_LOCALE` cookie that next-intl writes when
// `router.replace(..., { locale })` is invoked. The middleware reads the same
// cookie before falling back to Accept-Language, so the user's choice survives
// page reloads and new sessions without any client-side storage of our own.
const LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  'pt-BR': 'Português (Brasil)',
  ru: 'Русский',
  tr: 'Türkçe',
  ja: '日本語',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  pl: 'Polski',
  ko: '한국어',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
}

export function LocaleSwitcher() {
  const t = useTranslations('Header')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const localizedPaths = useLocalizedPaths()

  function setLocale(next: Locale) {
    const targetPath = localizedPaths[next]
    if (targetPath) {
      router.replace(targetPath, { locale: next })
    } else {
      router.replace(pathname, { locale: next })
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className='dark:bg-dark-800 dark:hover:bg-dark-700 inline-flex items-center rounded-lg bg-gray-100 p-2 hover:bg-gray-200'
          aria-label={t('selectLanguage')}
        >
          <Globe className='h-5 w-5 text-gray-700 dark:text-gray-300' />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          className='rounded-card dark:border-dark-700 dark:bg-dark-800 z-50 border border-gray-200 bg-white p-2 shadow-md'
        >
          {routing.locales.map(l => (
            <DropdownMenu.Item
              key={l}
              onSelect={() => setLocale(l as Locale)}
              className={`dark:hover:bg-dark-700 cursor-pointer rounded px-3 py-2 text-sm hover:bg-gray-100 ${
                l === locale ? 'text-primary-600 dark:text-primary-400 font-semibold' : ''
              }`}
            >
              {LABELS[l as Locale]}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
```

Note the three meaningful diffs vs. the existing file:
- The persistence comment block above `LABELS`.
- The button's class string drops the `gap-2` segment (no label to gap from).
- The `<span className='hidden text-sm font-medium md:inline'>{LABELS[locale]}</span>` line after `<Globe ... />` is removed.

- [ ] **Step 4: Run the test, verify it passes**

```
yarn test src/components/header/locale-switcher.test.tsx
```

Expected: the new test passes.

- [ ] **Step 5: Commit**

```
git add src/components/header/locale-switcher.tsx src/components/header/locale-switcher.test.tsx
git commit -m "feat(header): trim locale-switcher trigger to globe-only"
```

---

## Task 7: Middleware test for cookie-vs-Accept-Language

**Files:**
- Create test: `src/middleware.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/middleware.test.ts`:

```ts
import { NextRequest } from 'next/server'
import { describe, it, expect, vi } from 'vitest'

// The middleware imports @/lib/cms; we mock it so the test stays hermetic even
// though the agent-md branch never fires for the html-accept requests below.
vi.mock('@/lib/cms', () => ({
  getAuthorBySlug: vi.fn(),
  getPostBySlug: vi.fn(),
}))

import middleware from './middleware'

function makeReq(path: string, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(new URL(path, 'http://localhost'), {
    headers: { accept: 'text/html', ...headers },
  })
}

describe('middleware locale persistence', () => {
  it('redirects bare paths to the Accept-Language locale when no NEXT_LOCALE cookie is set', async () => {
    const req = makeReq('/', { 'accept-language': 'fr-FR,fr;q=0.9' })
    const res = await middleware(req)
    expect(res).toBeDefined()
    expect(res!.headers.get('location')).toMatch(/\/fr(\/|$)/)
  })

  it('prefers NEXT_LOCALE cookie over Accept-Language', async () => {
    const req = makeReq('/', {
      'accept-language': 'fr-FR,fr;q=0.9',
      cookie: 'NEXT_LOCALE=pl',
    })
    const res = await middleware(req)
    expect(res).toBeDefined()
    expect(res!.headers.get('location')).toMatch(/\/pl(\/|$)/)
  })

  it('keeps the URL locale when it is explicit, regardless of the cookie', async () => {
    const req = makeReq('/de/academy', {
      cookie: 'NEXT_LOCALE=es',
    })
    const res = await middleware(req)
    // The explicit /de/ prefix is honored; either we get no redirect or a 200
    // pass-through. Either way the location header (if any) must not be /es/.
    const loc = res?.headers.get('location') ?? ''
    expect(loc).not.toMatch(/\/es(\/|$)/)
  })
})
```

- [ ] **Step 2: Run the test, verify it passes**

```
yarn test src/middleware.test.ts
```

Expected: all three tests pass on the first run because the behavior is already correct — this task locks the contract with regression coverage. If any test fails on the first run, the middleware is not behaving as the spec claims and the underlying issue should be investigated before committing.

- [ ] **Step 3: Commit**

```
git add src/middleware.test.ts
git commit -m "test(middleware): lock cookie-wins-over-accept-language locale contract"
```

---

## Task 8: Full check + manual smoke

**Files:** none (verification only)

- [ ] **Step 1: Run the full project check**

```
yarn check-all
```

Expected: type-check, lint, format-check, and the full test suite all pass.

- [ ] **Step 2: Boot the dev server**

```
yarn dev
```

Expected: server listens on `http://localhost:3000` (or whichever `PORT` is configured) without errors.

- [ ] **Step 3: Manual smoke checklist**

In a fresh private/incognito window, visit `http://localhost:3000/en` and verify:

  1. The top nav reads `Home   Enterprise   Features   Learn   Guide   Support   Contact`.
  2. The `Learn` label has **no chevron** next to it.
  3. Hovering `Learn` opens the dropdown with **Newsroom** first, then Academy, Series, Glossary.
  4. The Newsroom dropdown item shows its localized description (English: "Latest announcements and product updates").
  5. The locale switcher button shows **only a globe icon** — no `English` (or any locale label) text.
  6. Clicking Newsroom in the dropdown navigates to `/en/newsroom`. The `Learn` trigger shows the orange active state.
  7. Open the language dropdown, pick `Polski`. The URL changes to `/pl/...`. Reload the page hard (⌘⇧R). You stay on `/pl/...`.
  8. Clear cookies for localhost, set the browser language to Spanish, then visit `http://localhost:3000/`. You land on `/es/...`.
  9. Resize to mobile (≤ 1024 px). Open the menu. The `Learn` section lists Newsroom → Academy → Series → Glossary in that order.

- [ ] **Step 4: Stop the dev server**

```
# in the terminal running `yarn dev`
Ctrl-C
```

- [ ] **Step 5: If anything in Step 3 failed**

Diagnose the failure, write a regression test (in the closest existing or new test file), fix the code, commit the fix as a separate atomic commit (`fix(header): ...` or similar). Do not amend earlier commits.

---

## Done

After Task 8 the branch carries seven new commits on top of the spec commit (`1058df8`). Hand off to the user for final review and push when they ask.
