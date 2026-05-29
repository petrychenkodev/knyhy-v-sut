'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Newspaper, BookMarked, User } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-playfair text-xl font-bold text-[#1A1A18] shrink-0">
            Книги в суть
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/catalog"
              className="text-base font-medium text-gray-700 hover:text-[#2D5016] transition-colors"
            >
              Книги
            </Link>
            <Link
              href="/articles"
              className="text-base font-medium text-gray-700 hover:text-[#2D5016] transition-colors"
            >
              Статті
            </Link>
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

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            <Link
              href="/catalog"
              className="block px-2 py-3 text-lg font-medium text-gray-700 hover:text-[#2D5016] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Книги
            </Link>
            <Link
              href="/articles"
              className="block px-2 py-3 text-lg font-medium text-gray-700 hover:text-[#2D5016] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Статті
            </Link>
          </div>
        )}
      </div>

      {/* Mobile bottom nav is rendered by MobileBottomNav component in layout.tsx */}
    </nav>
  )
}
