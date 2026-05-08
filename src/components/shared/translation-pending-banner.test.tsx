import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { TranslationPendingBanner } from './translation-pending-banner'

const messages = {
  Common: { translationPendingBanner: "This article isn't translated yet — showing English." },
}

describe('TranslationPendingBanner', () => {
  it('renders i18n copy', () => {
    render(
      <NextIntlClientProvider locale='es' messages={messages}>
        <TranslationPendingBanner />
      </NextIntlClientProvider>
    )
    expect(screen.getByText(/showing English/)).toBeInTheDocument()
  })

  it('has role status for assistive tech', () => {
    render(
      <NextIntlClientProvider locale='es' messages={messages}>
        <TranslationPendingBanner />
      </NextIntlClientProvider>
    )
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
