'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Newspaper, BookMarked, FileText, User } from 'lucide-react'

const navItems = [
  { href: '/catalog',  Icon: BookOpen,   label: 'Книги'     },
  { href: '/articles', Icon: Newspaper,  label: 'Статті'    },
  { href: '/saved',    Icon: BookMarked, label: 'Збережене' },
  { href: '/notes',    Icon: FileText,   label: 'Нотатки'   },
  { href: '/profile',  Icon: User,       label: 'Профіль'   },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/catalog')  return pathname === '/catalog' || pathname.startsWith('/books/')
    if (href === '/articles') return pathname === '/articles' || pathname.startsWith('/articles/')
    return pathname === href
  }

  return (
    <nav
      className="md:hidden"
      style={{
        backgroundColor: 'white',
        borderTop: '1px solid #f3f4f6',
        boxShadow: '0 -1px 6px rgba(0,0,0,0.05)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        flexShrink: 0,
        // No position:fixed — sits naturally as grid row 2
      }}
    >
      <div style={{ display: 'flex', height: '56px' }}>
        {navItems.map(({ href, Icon, label }) => {
          const active = isActive(href)
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
                color: active ? '#2D5016' : '#9ca3af',
                textDecoration: 'none',
                fontSize: '10px',
                fontWeight: 500,
              }}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
