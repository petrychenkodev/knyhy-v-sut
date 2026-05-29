'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Newspaper, BookMarked, FileText, User } from 'lucide-react'
import { getNotes } from '@/lib/notes'

const navItems = [
  { href: '/catalog',  Icon: BookOpen,   label: 'Книги',      match: (p: string) => p === '/catalog' || p.startsWith('/books/') },
  { href: '/articles', Icon: Newspaper,  label: 'Статті',     match: (p: string) => p === '/articles' || p.startsWith('/articles/') },
  { href: '/saved',    Icon: BookMarked, label: 'Збережене',  match: (p: string) => p === '/saved' },
  { href: '/notes',    Icon: FileText,   label: 'Нотатки',    match: (p: string) => p === '/notes' },
  { href: '/profile',  Icon: User,       label: 'Профіль',    match: (p: string) => p === '/profile' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [notesCount, setNotesCount] = useState(0)

  useEffect(() => {
    setNotesCount(getNotes().length)
  }, [])

  return (
    <nav
      className="md:hidden"
      style={{
        backgroundColor: 'white',
        borderTop: '1px solid #f3f4f6',
        boxShadow: '0 -1px 8px rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', height: '56px' }}>
        {navItems.map(({ href, Icon, label, match }) => {
          const isActive = match(pathname)
          const showBadge = href === '/notes' && notesCount > 0
          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                color: isActive ? '#2D5016' : '#9ca3af',
                textDecoration: 'none',
                fontSize: '10px',
                fontWeight: 500,
                position: 'relative',
              }}
            >
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <Icon size={20} strokeWidth={1.5} />
                {showBadge && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-6px',
                    backgroundColor: '#2D5016',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 700,
                    borderRadius: '999px',
                    width: '14px',
                    height: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}>
                    {notesCount > 9 ? '9+' : notesCount}
                  </span>
                )}
              </span>
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
