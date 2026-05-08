import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { LocaleBadge } from './locale-badge'

const messages = { Common: { localeBadge: { en: 'EN', es: 'ES', zh: 'ZH' } } }

describe('LocaleBadge', () => {
  it('renders EN copy', () => {
    render(
      <NextIntlClientProvider locale='es' messages={messages}>
        <LocaleBadge locale='en' />
      </NextIntlClientProvider>
    )
    expect(screen.getByText('EN')).toBeInTheDocument()
  })
  it('renders ZH copy', () => {
    render(
      <NextIntlClientProvider locale='en' messages={messages}>
        <LocaleBadge locale='zh' />
      </NextIntlClientProvider>
    )
    expect(screen.getByText('ZH')).toBeInTheDocument()
  })
})
