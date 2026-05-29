import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://knyhy-v-sut.vercel.app'

  const { data: books } = await supabase
    .from('books').select('slug, created_at').eq('published', true)

  const { data: articles } = await supabase
    .from('articles').select('slug, created_at').eq('published', true)

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/catalog`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/articles`, priority: 0.8, changeFrequency: 'weekly' },
  ]

  const bookPages: MetadataRoute.Sitemap = (books || []).map(book => ({
    url: `${baseUrl}/books/${book.slug}`,
    lastModified: new Date(book.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.95,
  }))

  const articlePages: MetadataRoute.Sitemap = (articles || []).map(article => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...bookPages, ...articlePages]
}
