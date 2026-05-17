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
