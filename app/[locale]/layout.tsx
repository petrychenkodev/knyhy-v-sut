import type { Metadata } from 'next'
import { Locale } from '@/lib/types'
import Navbar from '@/components/Navbar'
import MobileBottomNav from '@/components/MobileBottomNav'

export const metadata: Metadata = {
  title: 'Книги в суть',
  description: 'Головні ідеї кращих книг — за 15 хвилин',
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  const locale = (params.locale === 'en' ? 'en' : 'uk') as Locale

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar locale={locale} />
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      <MobileBottomNav locale={locale} />
    </div>
  )
}
