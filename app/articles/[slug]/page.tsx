import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { t } from '@/lib/i18n'
import ReadingProgress from '@/components/ReadingProgress'
import ArticleCard from '@/components/ArticleCard'
import { ArrowLeft, Clock } from 'lucide-react'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createAdminClient()
  const { data: article } = await supabase
    .from('articles')
    .select('title_ua, excerpt_ua, cover_url, slug')
    .eq('slug', params.slug)
    .single()

  if (!article) return {}

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://knyhy-v-sut.vercel.app'
  const title = article.title_ua
  const description = article.excerpt_ua?.slice(0, 160)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: article.cover_url ? [{ url: article.cover_url, alt: title }] : [],
    },
    alternates: {
      canonical: `${baseUrl}/articles/${article.slug}`,
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const supabase = createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!article) notFound()

  const title = article.title_ua
  const content = article.content_ua
  const date = new Date(article.created_at).toLocaleDateString('uk-UA', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const { data: related } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .neq('slug', params.slug)
    .limit(2)

  return (
    <div className="pb-24">
      <ReadingProgress />

      {/* Cover hero */}
      {article.cover_url && (
        <div className="relative w-full max-h-96 overflow-hidden">
          <Image
            src={article.cover_url}
            alt={title}
            width={1200}
            height={630}
            className="w-full object-cover max-h-96"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2D5016] transition-colors mb-8"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          {t.allArticles}
        </Link>

        {/* Title */}
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A1A18] leading-tight mb-4">
          {title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-10 pb-6 border-b border-gray-100">
          <span>{date}</span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} strokeWidth={1.5} />
            {article.read_time_min} хв читання
          </span>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-playfair
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-[#1A1A18]
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-[#1A1A18]
            prose-p:leading-relaxed prose-p:mb-5 prose-p:text-gray-800
            prose-hr:my-8
            prose-strong:font-semibold prose-strong:text-gray-900
            prose-blockquote:border-l-4 prose-blockquote:border-[#2D5016]
            prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-gray-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Back link bottom */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2D5016] hover:underline"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            {t.allArticles}
          </Link>
        </div>
      </div>

      {/* Related articles */}
      {related && related.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 className="font-playfair text-2xl font-semibold text-[#1A1A18] mb-6">
            {t.relatedArticles}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
