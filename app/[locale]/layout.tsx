import type { Metadata } from 'next'
import { Locale } from '@/lib/types'
import Navbar from '@/components/Navbar'
import MobileBottomNav from '@/components/MobileBottomNav'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://knyhy-v-sut.vercel.app'
  ),
  title: {
    default: 'Книги в суть — Самарі найкращих книг',
    template: '%s | Книги в суть',
  },
  description:
    'Читайте самарі найкращих книг з психології, бізнесу, філософії та науки. Головні ідеї за 15 хвилин. Books to the Core — best book summaries in Ukrainian and English.',
  keywords: [
    'книги самарі',
    'book summaries',
    'книги українською',
    'психологія книги',
    'бізнес книги',
    'філософія книги',
    'короткий зміст книг',
    'книги огляд',
    'нонфікшн',
    'саморозвиток',
    'self development books',
    'thinking fast and slow',
    'atomic habits',
  ],
  authors: [{ name: 'Книги в суть' }],
  creator: 'Книги в суть',
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    alternateLocale: 'en_US',
    siteName: 'Книги в суть',
    title: 'Книги в суть — Самарі найкращих книг',
    description: 'Головні ідеї кращих книг за 15 хвилин',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Книги в суть' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Книги в суть — Самарі найкращих книг',
    description: 'Головні ідеї кращих книг за 15 хвилин',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
    languages: {
      uk: '/uk',
      en: '/en',
    },
  },
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
