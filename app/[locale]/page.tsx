import { createClient } from '@/lib/supabase/server'
import { Locale } from '@/lib/types'
import { t } from '@/lib/i18n'
import BookGrid from '@/components/BookGrid'

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const locale = (params.locale === 'en' ? 'en' : 'uk') as Locale
  const tr = t[locale]
  const supabase = createClient()

  const { data: books } = await supabase
    .from('books')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-2xl">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-[#1A1A18] leading-tight mb-2">
            {tr.heroTitle}
          </h1>
          <h2 className="font-playfair text-3xl md:text-5xl font-light text-gray-400 leading-tight mb-6">
            {tr.heroEn}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-10 font-light">
            {tr.heroSubtitle}
          </p>
          <a
            href={`/${locale}/catalog`}
            className="inline-block px-8 py-4 bg-[#2D5016] text-white font-medium rounded-xl hover:bg-[#3a6a1d] transition-colors text-base md:text-lg"
          >
            {tr.readFree}
          </a>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-[#1A1A18] mb-8">
          {tr.recentlyAdded}
        </h2>
        <BookGrid books={books ?? []} locale={locale} />
      </section>
    </>
  )
}
