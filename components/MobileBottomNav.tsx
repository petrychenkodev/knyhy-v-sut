'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Newspaper, BookMarked, User } from 'lucide-react'

const navItems = [
  { href: '/',         icon: <Home       size={20} strokeWidth={1.5} />, label: 'Головна'   },
  { href: '/catalog',  icon: <BookOpen   size={20} strokeWidth={1.5} />, label: 'Книги'     },
  { href: '/articles', icon: <Newspaper  size={20} strokeWidth={1.5} />, label: 'Статті'    },
  { href: '/saved',    icon: <BookMarked size={20} strokeWidth={1.5} />, label: 'Збережене' },
  { href: '/profile',  icon: <User       size={20} strokeWidth={1.5} />, label: 'Профіль'   },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'white',
        borderTop: '1px solid #f3f4f6',
        boxShadow: '0 -1px 8px rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      <div style={{ display: 'flex', height: '56px', alignItems: 'stretch' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-[#2D5016]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className={`flex items-center justify-center rounded-lg px-1 py-0.5 ${isActive ? 'bg-[#2D5016]/[0.08]' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
