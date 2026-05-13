import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

import { LearnDropdown } from './learn-dropdown'

const messages = {
  Header: {
    learn: 'Learn',
    academy: 'Academy',
    series: 'Series',
    learnGlossary: 'Glossary',
    learnAcademyDescription: 'Articles by category',
    learnSeriesDescription: 'Multi-part paths',
    learnGlossaryDescription: 'Crypto terms',
  },
}

describe('LearnDropdown', () => {
  it('renders the trigger label "Learn"', () => {
    render(
      <NextIntlClientProvider locale='en' messages={messages}>
        <LearnDropdown isActive={false} />
      </NextIntlClientProvider>
    )
    expect(screen.getByText('Learn')).toBeInTheDocument()
  })

  it('applies active class when isActive is true', () => {
    const { container } = render(
      <NextIntlClientProvider locale='en' messages={messages}>
        <LearnDropdown isActive />
      </NextIntlClientProvider>
    )
    const trigger = container.querySelector('[data-active]') ?? container.querySelector('button')
    expect(trigger?.className).toMatch(/text-primary/)
  })
})
