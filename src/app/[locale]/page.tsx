import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('Header')
  return (
    <main style={{ padding: '2rem' }}>
      <h1>{t('home')}</h1>
      <p>Foundation migration in progress. This placeholder is replaced in Phase 6.</p>
    </main>
  )
}
