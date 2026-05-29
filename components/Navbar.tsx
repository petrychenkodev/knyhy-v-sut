'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, BookMarked, User, Newspaper } from 'lucide-react'

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

          {/* Desktop categories */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/catalog"
              className="text-base font-medium text-gray-700 hover:text-[#2D5016] transition-colors"
            >
              Каталог
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

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            <Link
              href="/catalog"
              className="block px-2 py-3 text-lg font-medium text-gray-700 hover:text-[#2D5016] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Каталог
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

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex h-16">
          {[
            { href: '/', icon: <Home size={20} strokeWidth={1.5} />, label: 'Головна' },
            { href: '/catalog', icon: <LayoutGrid size={20} strokeWidth={1.5} />, label: 'Каталог' },
            { href: '/articles', icon: <Newspaper size={20} strokeWidth={1.5} />, label: 'Статті' },
            { href: '/saved', icon: <BookMarked size={20} strokeWidth={1.5} />, label: 'Збережене' },
            { href: '/profile', icon: <User size={20} strokeWidth={1.5} />, label: 'Профіль' },
          ].map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 font-medium transition-colors ${
                  isActive
                    ? 'text-[#2D5016]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className={`flex items-center justify-center rounded-lg px-1 py-0.5 transition-colors ${isActive ? 'bg-[#2D5016]/[0.08]' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[10px]">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
