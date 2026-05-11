import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect } from 'vitest'
import { LocaleBadge } from './locale-badge'

const messages = {
  Common: {
    localeBadge: {
      en: 'EN',
      es: 'ES',
      zh: '中',
      'pt-BR': 'PT',
      ru: 'RU',
      tr: 'TR',
      ja: '日',
      de: 'DE',
      fr: 'FR',
      it: 'IT',
      pl: 'PL',
      ko: '한',
      vi: 'VI',
      id: 'ID',
    },
  },
}

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
    expect(screen.getByText('中')).toBeInTheDocument()
  })
  it('renders a Wave 1 locale label (fr)', () => {
    render(
      <NextIntlClientProvider locale='en' messages={messages}>
        <LocaleBadge locale='fr' />
      </NextIntlClientProvider>
    )
    expect(screen.getByText('FR')).toBeInTheDocument()
  })
})
