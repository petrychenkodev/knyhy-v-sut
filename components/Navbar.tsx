'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Locale } from '@/lib/types'
import { t } from '@/lib/i18n'
import { Home, LayoutGrid, BookMarked, User } from 'lucide-react'

interface NavbarProps {
  locale: Locale
}

export default function Navbar({ locale }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const tr = t[locale]
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    return segments.join('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="font-playfair text-xl font-bold text-[#1A1A18] shrink-0">
            {tr.heroTitle}
          </Link>

          {/* Desktop categories */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href={`/${locale}/catalog`}
              className="text-sm text-gray-600 hover:text-[#2D5016] transition-colors font-medium"
            >
              {locale === 'uk' ? 'Каталог' : 'Catalog'}
            </Link>
            <Link
              href={`/${locale}/articles`}
              className="text-sm text-gray-600 hover:text-[#2D5016] transition-colors font-medium"
            >
              {locale === 'uk' ? 'Статті' : 'Articles'}
            </Link>
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm font-medium">
              <Link href={switchLocale('uk')} className={`px-2 py-1 rounded transition-colors ${locale === 'uk' ? 'text-[#2D5016] font-semibold' : 'text-gray-400 hover:text-gray-600'}`}>UA</Link>
              <span className="text-gray-300">|</span>
              <Link href={switchLocale('en')} className={`px-2 py-1 rounded transition-colors ${locale === 'en' ? 'text-[#2D5016] font-semibold' : 'text-gray-400 hover:text-gray-600'}`}>EN</Link>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <Link
              href={`/${locale}/catalog`}
              className="block px-2 py-2 text-sm text-gray-700 hover:text-[#2D5016] font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {locale === 'uk' ? 'Каталог' : 'Catalog'}
            </Link>
            <Link
              href={`/${locale}/articles`}
              className="block px-2 py-2 text-sm text-gray-700 hover:text-[#2D5016] font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {locale === 'uk' ? 'Статті' : 'Articles'}
            </Link>
            <div className="flex items-center gap-3 px-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1 text-sm font-medium">
                <Link href={switchLocale('uk')} className={locale === 'uk' ? 'text-[#2D5016] font-semibold' : 'text-gray-400'}>UA</Link>
                <span className="text-gray-300 mx-1">|</span>
                <Link href={switchLocale('en')} className={locale === 'en' ? 'text-[#2D5016] font-semibold' : 'text-gray-400'}>EN</Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
        <div className="grid grid-cols-4 h-16">
          {[
            { href: `/${locale}`, icon: <Home size={20} strokeWidth={1.5} />, label: locale === 'uk' ? 'Головна' : 'Home' },
            { href: `/${locale}/catalog`, icon: <LayoutGrid size={20} strokeWidth={1.5} />, label: locale === 'uk' ? 'Каталог' : 'Catalog' },
            { href: `/${locale}/saved`, icon: <BookMarked size={20} strokeWidth={1.5} />, label: locale === 'uk' ? 'Збережене' : 'Saved' },
            { href: `/${locale}/profile`, icon: <User size={20} strokeWidth={1.5} />, label: locale === 'uk' ? 'Профіль' : 'Profile' },
          ].map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                  isActive ? 'text-[#2D5016]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
