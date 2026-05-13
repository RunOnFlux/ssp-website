import { fireEvent, render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect, beforeEach } from 'vitest'
import { GlossarySearch } from './glossary-search'

const messages = {
  Glossary: {
    matches: '{count, plural, =0 {No matches} =1 {1 match} other {# matches}}',
  },
}

function renderSearch(props: { placeholder: string; totalLabel: string }) {
  return render(
    <NextIntlClientProvider locale='en' messages={messages}>
      <GlossarySearch {...props} />
    </NextIntlClientProvider>
  )
}

describe('GlossarySearch', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <input data-search-input />
      </div>
      <section data-letter-section data-letter="A">
        <a data-glossary-card data-title="Address">Address</a>
        <a data-glossary-card data-title="Air-gapped">Air-gapped</a>
      </section>
      <section data-letter-section data-letter="B">
        <a data-glossary-card data-title="Bitcoin">Bitcoin</a>
      </section>
    `
  })

  it('shows all cards when query is empty', () => {
    renderSearch({ placeholder: 'Search…', totalLabel: '3 terms' })
    expect(screen.getByText('3 terms')).toBeInTheDocument()
    const cards = document.querySelectorAll<HTMLElement>('[data-glossary-card]')
    for (const card of cards) {
      expect(card.style.display).toBe('')
    }
  })

  it('filters cards by case-insensitive substring on title', () => {
    renderSearch({ placeholder: 'Search…', totalLabel: '3 terms' })
    const input = screen.getByPlaceholderText('Search…') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'air' } })

    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-glossary-card]'))
    const visible = cards.filter(c => c.style.display !== 'none')
    expect(visible.map(c => c.dataset.title)).toEqual(['Air-gapped'])
    expect(screen.getByText('1 match')).toBeInTheDocument()
  })

  it('hides letter sections with no visible cards', () => {
    renderSearch({ placeholder: 'Search…', totalLabel: '3 terms' })
    const input = screen.getByPlaceholderText('Search…') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'bitcoin' } })

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-letter-section]'))
    const sectionA = sections.find(s => s.dataset.letter === 'A')
    const sectionB = sections.find(s => s.dataset.letter === 'B')
    expect(sectionA?.style.display).toBe('none')
    expect(sectionB?.style.display).toBe('')
  })

  it('restores all cards when query is cleared', () => {
    renderSearch({ placeholder: 'Search…', totalLabel: '3 terms' })
    const input = screen.getByPlaceholderText('Search…') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'air' } })
    fireEvent.change(input, { target: { value: '' } })

    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-glossary-card]'))
    for (const card of cards) {
      expect(card.style.display).toBe('')
    }
    expect(screen.getByText('3 terms')).toBeInTheDocument()
  })
})
