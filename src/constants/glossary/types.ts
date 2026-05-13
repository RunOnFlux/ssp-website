export interface GlossaryDifficulty {
  level: 1 | 2 | 3
  label: string
  slug: string
  language: string
}

export interface GlossaryEntrySource {
  title: string
  slug: string
  excerpt: string
  difficulty?: GlossaryDifficulty
}

export interface GlossaryEntry extends GlossaryEntrySource {
  source: 'ssp-curated' | 'cmc' | 'web'
}
