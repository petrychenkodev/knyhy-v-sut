import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Locale } from '@/lib/types'
import { t } from '@/lib/i18n'
import BookCoverHero from '@/components/BookCoverHero'
import ReadTracker from '@/components/ReadTracker'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

interface PageProps {
  params: { locale: Locale; slug: string }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').slice(0, 160)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (params.locale === 'en' ? 'en' : 'uk') as Locale
  const supabase = createAdminClient()
  const { data: book } = await supabase
    .from('books')
    .select('title_ua, title_en, summary_ua, summary_en, cover_url, slug, author')
    .eq('slug', params.slug)
    .single()

  if (!book) return {}

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://knyhy-v-sut.vercel.app'
  const title = locale === 'uk' ? book.title_ua : book.title_en
  const author = book.author
  const summary = locale === 'uk' ? book.summary_ua : book.summary_en
  const description = stripHtml(summary || '')

  return {
    title: `${title} — ${author} | Самарі`,
    description,
    keywords: [
      title, author,
      `${title} самарі`, `${title} огляд`,
      `${author} книги`, 'book summary',
      `${title} summary`, `${title} review`,
    ],
    openGraph: {
      title: `${title} — ${author}`,
      description,
      type: 'article',
      images: book.cover_url ? [{ url: book.cover_url, alt: title }] : [],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/books/${book.slug}`,
      languages: {
        'uk': `${baseUrl}/uk/books/${book.slug}`,
        'en': `${baseUrl}/en/books/${book.slug}`,
      },
    },
  }
}

export async function generateStaticParams() {
  const supabase = createAdminClient()
  const { data: books } = await supabase
    .from('books')
    .select('slug')
    .eq('published', true)

  if (!books) return []

  return ['uk', 'en'].flatMap((locale) =>
    books.map((book) => ({ locale, slug: book.slug }))
  )
}

export default async function BookPage({ params }: PageProps) {
  const locale = (params.locale === 'en' ? 'en' : 'uk') as Locale
  const tr = t[locale]
  const supabase = createClient()

  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!book) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://knyhy-v-sut.vercel.app'
  const summary = locale === 'uk' ? book.summary_ua : book.summary_en
  const insights: string[] = locale === 'uk'
    ? (book.key_insights_ua ?? [])
    : (book.key_insights_en ?? [])
  const practical: string[] = locale === 'uk'
    ? (book.practical_ua ?? [])
    : (book.practical_en ?? [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: locale === 'uk' ? book.title_ua : book.title_en,
    author: { '@type': 'Person', name: book.author },
    description: (summary || '').replace(/<[^>]*>/g, '').slice(0, 300),
    image: book.cover_url,
    inLanguage: locale === 'uk' ? 'uk' : 'en',
    url: `${baseUrl}/${locale}/books/${book.slug}`,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back link */}
      <Link href={`/${locale}`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2D5016] transition-colors mb-8">
        <ArrowLeft size={16} strokeWidth={1.5} />
        {tr.allBooks}
      </Link>

      <BookCoverHero book={book} locale={locale} />

      <div className="flex justify-end -mt-4 mb-4">
        <ReadTracker book={book} locale={locale} />
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
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
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        </div>
      )}

      {/* Key Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <h2 className="font-playfair text-2xl font-semibold text-[#1A1A18] mb-6">
            {tr.keyInsights}
          </h2>
          <ol className="space-y-4">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-[#2D5016] text-white text-sm font-semibold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div
                  className="prose prose-sm max-w-none text-gray-800 pt-1 [&_p]:my-0 [&_strong]:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: insight }}
                />
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Practical Application */}
      {practical.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
          <h2 className="font-playfair text-2xl font-semibold text-[#1A1A18] mb-6">
            {tr.practicalTitle}
          </h2>
          <ul className="space-y-4">
            {practical.map((item, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-[#2D5016]/15 text-[#2D5016] flex items-center justify-center">
                  <Check size={16} strokeWidth={1.5} />
                </span>
                <div
                  className="prose prose-sm max-w-none text-gray-800 pt-1 [&_p]:my-0 [&_strong]:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom nav */}
      <div className="flex items-center justify-between">
        <Link href={`/${locale}`}
          className="flex items-center gap-2 text-sm font-medium text-[#2D5016] hover:underline">
          <ArrowLeft size={16} strokeWidth={1.5} />
          {tr.allBooks}
        </Link>
        <span className="flex items-center gap-1 text-sm text-gray-400">
          {tr.nextBook}
          <ArrowRight size={16} strokeWidth={1.5} />
        </span>
      </div>

    </div>
  )
}
