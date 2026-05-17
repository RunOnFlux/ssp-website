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
