import { siteUrl } from '@/lib/seo'
import type { NewsroomPost, Author } from '@/types/newsroom'

export function renderArticleAsAgentMd(post: NewsroomPost): string {
  const path =
    post.section === 'academy' && post.category
      ? `/academy/${post.category}/${post.slug}`
      : `/newsroom/${post.slug}`
  return `---
title: ${JSON.stringify(post.title)}
url: ${siteUrl}${path}
last_reviewed: ${post.modifiedDate ?? post.date}
section: ${post.section}
${post.category ? `category: ${post.category}\n` : ''}author: ${JSON.stringify(post.author)}
tags: ${JSON.stringify(post.tags)}
---

${post.description}

${post.content}

## Related

${(post.relatedSlugs ?? []).map(s => `- /${post.section}/${s}`).join('\n') || '_(none)_'}
`
}

export function renderAuthorAsAgentMd(author: Author): string {
  return `---
title: ${JSON.stringify(author.name)}
url: ${siteUrl}/author/${author.slug}
last_reviewed: ${new Date().toISOString().slice(0, 10)}
---

${author.bio ?? ''}

## Links

${[
  author.websiteUrl ? `- Website: ${author.websiteUrl}` : null,
  author.twitterUrl ? `- Twitter: ${author.twitterUrl}` : null,
  author.githubUrl ? `- GitHub: ${author.githubUrl}` : null,
  author.linkedinUrl ? `- LinkedIn: ${author.linkedinUrl}` : null,
]
  .filter(Boolean)
  .join('\n')}
`
}
