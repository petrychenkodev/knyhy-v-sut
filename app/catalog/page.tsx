import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { t } from '@/lib/i18n'
import CatalogClient from '@/components/CatalogClient'

export const metadata: Metadata = {
  title: t.catalogMeta,
  description: t.catalogDesc,
}

export const dynamic = 'force-dynamic'

export default async function CatalogPage() {
  const supabase = createClient()
  const { data: books } = await supabase
    .from('books')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <Suspense fallback={null}>
      <CatalogClient books={books ?? []} />
    </Suspense>
  )
}
