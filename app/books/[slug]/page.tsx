import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { t } from '@/lib/i18n'
import BookCoverHero from '@/components/BookCoverHero'
import ReadTracker from '@/components/ReadTracker'
import ReadingProgress from '@/components/ReadingProgress'
import BookCard from '@/components/BookCard'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import TextHighlighter from '@/components/TextHighlighter'

interface PageProps {
  params: { slug: string }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').slice(0, 160)
}

function insertQuotesIntoSummary(summaryHtml: string, quotes: string[]): string {
  if (!quotes.length || !summaryHtml) return summaryHtml

  const quoteBlock = (text: string) =>
    `<blockquote class="inline-quote">${text}</blockquote>`

  const hasHr = /<hr\s*\/?>/i.test(summaryHtml)

  if (hasHr) {
    const parts = summaryHtml.split(/(<hr\s*\/?>)/i)
    const result: string[] = []
    let quoteIndex = 0

    for (let i = 0; i < parts.length; i++) {
      result.push(parts[i])
      if (/<hr\s*\/?>/i.test(parts[i]) && quoteIndex < quotes.length) {
        result.push(quoteBlock(quotes[quoteIndex]))
        quoteIndex++
      }
    }
    return result.join('')
  }

  const unsafeNext = /^\s*<(ul|ol|li|h2|h3)/i
  const parts = summaryHtml.split(/(<\/p>)/i)
  const result: string[] = []
  let quoteIndex = 0
  let pCount = 0

  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i])

    if (/<\/p>/i.test(parts[i])) {
      pCount++
      const nextPart = parts[i + 1] ?? ''
      const isSafe = !unsafeNext.test(nextPart.trimStart())

      if (pCount % 3 === 0 && isSafe && quoteIndex < quotes.length) {
        result.push(quoteBlock(quotes[quoteIndex]))
        quoteIndex++
      }
    }
  }

  return result.join('')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createAdminClient()
  const { data: book } = await supabase
    .from('books')
    .select('title_ua, summary_ua, cover_url, slug, author')
    .eq('slug', params.slug)
    .single()

  if (!book) return {}

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://knyhy-v-sut.vercel.app'
  const title = book.title_ua
  const description = stripHtml(book.summary_ua || '')

  return {
    title: `${title} — ${book.author} | Самарі`,
    description,
    keywords: [
      title, book.author,
      `${title} самарі`, `${title} огляд`,
      `${book.author} книги`,
    ],
    openGraph: {
      title: `${title} — ${book.author}`,
      description,
      type: 'article',
      images: book.cover_url ? [{ url: book.cover_url, alt: title }] : [],
    },
    alternates: {
      canonical: `${baseUrl}/books/${book.slug}`,
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
  return books.map((book) => ({ slug: book.slug }))
}

export default async function BookPage({ params }: PageProps) {
  const supabase = createClient()

  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!book) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://knyhy-v-sut.vercel.app'
  const summary = book.summary_ua
  const insights: string[] = book.key_insights_ua ?? []
  const practical: string[] = book.practical_ua ?? []
  const quotes: string[] = book.quotes_ua ?? []
  const reflection: string[] = book.reflection_ua ?? []

  const { data: relatedBooks } = await supabase
    .from('books')
    .select('*')
    .eq('published', true)
    .eq('category', book.category)
    .neq('slug', book.slug)
    .limit(3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title_ua,
    author: { '@type': 'Person', name: book.author },
    description: (summary || '').replace(/<[^>]*>/g, '').slice(0, 300),
    image: book.cover_url,
    inLanguage: 'uk',
    url: `${baseUrl}/books/${book.slug}`,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back link */}
      <Link href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2D5016] transition-colors mb-8">
        <ArrowLeft size={16} strokeWidth={1.5} />
        {t.allBooks}
      </Link>

      <BookCoverHero book={book} />

      <div className="flex justify-end -mt-4 mb-4">
        <ReadTracker book={book} />
      </div>

      {/* Summary with inline quotes */}
      {summary && (
        <TextHighlighter sourceType="book" sourceTitle={book.title_ua} sourceSlug={book.slug}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-playfair
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-[#1A1A18]
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-[#1A1A18]
                prose-p:leading-relaxed prose-p:mb-5 prose-p:text-gray-800
                prose-hr:my-8
                prose-strong:font-semibold prose-strong:text-gray-900
                prose-blockquote:not-prose
                prose-ul:list-disc prose-ol:list-decimal
                prose-li:text-gray-800"
              dangerouslySetInnerHTML={{
                __html: insertQuotesIntoSummary(summary, quotes.filter(q => q.trim()).slice(0, 3)),
              }}
            />
          </div>
        </TextHighlighter>
      )}

      {/* Key Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <h2 className="font-playfair text-2xl font-semibold text-[#1A1A18] mb-6">
            {t.keyInsights}
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
            {t.practicalTitle}
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

      {/* Reflection Questions */}
      {reflection.filter(q => q.trim()).length > 0 && (
        <div className="bg-[#2D5016] rounded-2xl p-8 md:p-12 mb-8">
          <h2 className="font-playfair text-2xl font-semibold text-white mb-1">
            Запитай себе
          </h2>
          <p className="text-white/70 text-sm mb-8">
            Питання для глибшого розуміння
          </p>
          <ol className="space-y-6">
            {reflection.filter(q => q.trim()).map((question, idx) => (
              <li key={idx} className="flex gap-5 items-start">
                <span className="shrink-0 w-8 h-8 rounded-full bg-white/20 text-white text-sm font-semibold flex items-center justify-center">
                  {idx + 1}
                </span>
                <p className="font-playfair text-lg italic text-white leading-relaxed pt-1">
                  {question}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Related Books */}
      {relatedBooks && relatedBooks.length > 0 && (
        <div className="pt-8 mt-4 border-t border-gray-100 mb-8">
          <h2 className="font-playfair text-2xl font-semibold text-[#1A1A18] mb-6">
            Схожі книги
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 md:grid md:grid-cols-3 md:overflow-visible">
            {relatedBooks.map((related) => (
              <div key={related.id} className="shrink-0 w-[160px] md:w-auto">
                <BookCard book={related} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="flex items-center justify-between">
        <Link href="/"
          className="flex items-center gap-2 text-sm font-medium text-[#2D5016] hover:underline">
          <ArrowLeft size={16} strokeWidth={1.5} />
          {t.allBooks}
        </Link>
        <span className="flex items-center gap-1 text-sm text-gray-400">
          {t.nextBook}
          <ArrowRight size={16} strokeWidth={1.5} />
        </span>
      </div>

    </div>
  )
}
