import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Locale } from '@/lib/types'
import { t } from '@/lib/i18n'
import CatalogClient from '@/components/CatalogClient'

interface PageProps {
  params: { locale: Locale }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (params.locale === 'en' ? 'en' : 'uk') as Locale
  const tr = t[locale]
  return {
    title: tr.catalogMeta,
    description: tr.catalogDesc,
  }
}

export const dynamic = 'force-dynamic'

export default async function CatalogPage({ params }: PageProps) {
  const locale = (params.locale === 'en' ? 'en' : 'uk') as Locale
  const supabase = createClient()

  const { data: books } = await supabase
    .from('books')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <Suspense fallback={null}>
      <CatalogClient books={books ?? []} locale={locale} />
    </Suspense>
  )
}
