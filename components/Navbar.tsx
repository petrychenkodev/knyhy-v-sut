'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, LogIn, LogOut, UserPlus, User, BookMarked, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/lib/auth'
import NavbarActions from './NavbarActions'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const initial = displayName[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="font-playfair text-xl font-bold text-[#1A1A18] shrink-0">
              Книги в суть
            </Link>

            {/* Desktop nav - center */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/catalog" className="text-base font-medium text-gray-700 hover:text-[#2D5016] transition-colors">
                Книги
              </Link>
              <Link href="/articles" className="text-base font-medium text-gray-700 hover:text-[#2D5016] transition-colors">
                Статті
              </Link>
            </div>

            {/* Desktop nav - right */}
            <NavbarActions />

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen overlay — rendered outside nav so it overlays everything */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-white flex flex-col"
          style={{ top: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
            <Link href="/" className="font-playfair text-xl font-bold text-[#1A1A18]" onClick={closeMenu}>
              Книги в суть
            </Link>
            <button onClick={closeMenu} className="p-2 text-gray-600" aria-label="Close menu">
              <X size={24} />
            </button>
          </div>

          {/* Menu content */}
          <div className="flex-1 overflow-y-auto">
            {user ? (
              /* Logged-in menu */
              <div className="flex flex-col px-5 pt-4">
                {/* User info */}
                <div className="flex items-center gap-3 py-4 border-b border-gray-100 mb-2">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#2D5016] flex items-center justify-center text-white font-medium shrink-0">
                      {initial}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{displayName}</div>
                    <div className="text-sm text-gray-500 truncate">{user.email}</div>
                  </div>
                </div>

                <Link href="/profile" onClick={closeMenu}
                  className="flex items-center gap-3 py-3.5 text-base text-gray-700 border-b border-gray-50">
                  <User size={18} className="text-gray-400 shrink-0" />
                  Мій профіль
                </Link>
                <Link href="/saved" onClick={closeMenu}
                  className="flex items-center gap-3 py-3.5 text-base text-gray-700 border-b border-gray-50">
                  <BookMarked size={18} className="text-gray-400 shrink-0" />
                  Збережені книги
                </Link>
                <Link href="/notes" onClick={closeMenu}
                  className="flex items-center gap-3 py-3.5 text-base text-gray-700 border-b border-gray-100">
                  <FileText size={18} className="text-gray-400 shrink-0" />
                  Мої нотатки
                </Link>

                <button
                  onClick={async () => { await signOut(); closeMenu() }}
                  className="flex items-center gap-3 py-3.5 text-base text-red-500 mt-2"
                >
                  <LogOut size={18} className="shrink-0" />
                  Вийти
                </button>
              </div>
            ) : (
              /* Logged-out menu */
              <div className="flex flex-col px-5 pt-4">
                <Link href="/login" onClick={closeMenu}
                  className="flex items-center gap-3 py-4 text-lg font-medium border-b border-gray-100">
                  <LogIn size={20} className="text-[#2D5016] shrink-0" />
                  Увійти
                </Link>
                <Link href="/register" onClick={closeMenu}
                  className="flex items-center gap-3 py-4 text-lg font-medium border-b border-gray-100">
                  <UserPlus size={20} className="text-[#2D5016] shrink-0" />
                  Зареєструватись
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
