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
