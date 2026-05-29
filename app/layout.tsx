import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import Navbar from '@/components/Navbar'
import MobileBottomNav from '@/components/MobileBottomNav'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://knyhy-v-sut.vercel.app'
  ),
  title: {
    default: 'Книги в суть — Самарі найкращих книг',
    template: '%s | Книги в суть',
  },
  description:
    'Читайте самарі найкращих книг з психології, бізнесу, філософії та науки. Головні ідеї за 15 хвилин.',
  keywords: [
    'книги самарі',
    'книги українською',
    'психологія книги',
    'бізнес книги',
    'філософія книги',
    'короткий зміст книг',
    'книги огляд',
    'нонфікшн',
    'саморозвиток',
  ],
  authors: [{ name: 'Книги в суть' }],
  creator: 'Книги в суть',
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
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
  },
  verification: {
    google: '5KcR6eyXM7JSwUtaS_cubVoAaFf8h7oK2RlPzbFodY4',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className={`${playfair.variable} ${dmSans.variable} font-sans antialiased bg-[#FAFAF8]`}>
        <Analytics />
        <Navbar />
        <main
          className="md:pb-0"
          style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0px))' }}
        >
          {children}
        </main>
        <MobileBottomNav />
      </body>
    </html>
  )
}
