'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Newspaper, BookMarked, FileText, User } from 'lucide-react'
import { getNotes } from '@/lib/notes'

const navItems = [
  { href: '/catalog',  Icon: BookOpen,   label: 'Книги'      },
  { href: '/articles', Icon: Newspaper,  label: 'Статті'     },
  { href: '/saved',    Icon: BookMarked, label: 'Збережене'  },
  { href: '/notes',    Icon: FileText,   label: 'Нотатки'    },
  { href: '/profile',  Icon: User,       label: 'Профіль'    },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [notesCount, setNotesCount] = useState(0)

  useEffect(() => {
    setNotesCount(getNotes().length)
  }, [])

  // Chrome-specific fix: re-anchor nav on scroll/resize
  useEffect(() => {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
    if (!isChrome) return

    const nav = document.querySelector('.mobile-bottom-nav') as HTMLElement | null
    if (!nav) return

    let ticking = false
    const fix = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.style.transform = 'translate3d(0,0,0)'
          nav.style.bottom = '0px'
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', fix, { passive: true })
    window.addEventListener('resize', fix, { passive: true })
    return () => {
      window.removeEventListener('scroll', fix)
      window.removeEventListener('resize', fix)
    }
  }, [])

  const isActive = (href: string) => {
    if (href === '/catalog')  return pathname === '/catalog' || pathname.startsWith('/books/')
    if (href === '/articles') return pathname === '/articles' || (pathname.startsWith('/articles/') && pathname !== '/articles')
    return pathname === href
  }

  return (
    <nav
      className="mobile-bottom-nav md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'white',
        borderTop: '1px solid #f3f4f6',
        boxShadow: '0 -1px 0 0 #f3f4f6',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        minHeight: '56px',
        // GPU compositing layer — prevents iOS/Chrome detachment
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitTransform: 'translate3d(0,0,0)',
        transform: 'translate3d(0,0,0)',
        willChange: 'transform',
        // Chrome: create new stacking/layout context
        isolation: 'isolate' as const,
        contain: 'layout style paint' as const,
      }}
      >
        <div style={{ display: 'flex', height: '56px' }}>
          {navItems.map(({ href, Icon, label }) => {
            const active = isActive(href)
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
                  color: active ? '#2D5016' : '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '10px',
                  fontWeight: 500,
                }}
              >
                <span style={{ position: 'relative', display: 'inline-flex' }}>
                  <Icon size={20} strokeWidth={1.5} />
                  {showBadge && (
                    <span style={{
                      position: 'absolute', top: '-4px', right: '-6px',
                      backgroundColor: '#2D5016', color: 'white',
                      fontSize: '9px', fontWeight: 700, borderRadius: '999px',
                      width: '14px', height: '14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
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
