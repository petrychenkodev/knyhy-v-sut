import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient()
  const { data: books } = await supabase
    .from('books')
    .select('slug, created_at')
    .eq('published', true)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://knyhy-v-sut.vercel.app'

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/uk`, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/en`, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/uk/catalog`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/en/catalog`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/uk/catalog?category=Психологія`, priority: 0.8 },
    { url: `${baseUrl}/uk/catalog?category=Бізнес`, priority: 0.8 },
    { url: `${baseUrl}/uk/catalog?category=Філософія`, priority: 0.8 },
    { url: `${baseUrl}/uk/catalog?category=Наука`, priority: 0.8 },
  ]

  const bookPages: MetadataRoute.Sitemap = (books || []).flatMap((book) => [
    {
      url: `${baseUrl}/uk/books/${book.slug}`,
      lastModified: new Date(book.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/en/books/${book.slug}`,
      lastModified: new Date(book.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.95,
    },
  ])

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, created_at')
    .eq('published', true)

  const articlePages: MetadataRoute.Sitemap = (articles || []).flatMap((article) => [
    {
      url: `${baseUrl}/uk/articles/${article.slug}`,
      lastModified: new Date(article.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/en/articles/${article.slug}`,
      lastModified: new Date(article.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
  ])

  return [...staticPages, ...bookPages, ...articlePages]
}
