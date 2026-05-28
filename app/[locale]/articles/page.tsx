import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Locale } from '@/lib/types'
import { t } from '@/lib/i18n'
import ArticleCard from '@/components/ArticleCard'

interface PageProps {
  params: { locale: Locale }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (params.locale === 'en' ? 'en' : 'uk') as Locale
  const tr = t[locale]
  return {
    title: tr.articles,
    description: tr.articlesSubtitle,
  }
}

export const dynamic = 'force-dynamic'

export default async function ArticlesPage({ params }: PageProps) {
  const locale = (params.locale === 'en' ? 'en' : 'uk') as Locale
  const tr = t[locale]
  const supabase = createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="mb-10">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A18] mb-3">
          {tr.articles}
        </h1>
        <p className="text-lg text-gray-500">{tr.articlesSubtitle}</p>
      </div>

      {!articles || articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">
            {locale === 'uk' ? 'Статті скоро з\'являться' : 'Articles coming soon'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
