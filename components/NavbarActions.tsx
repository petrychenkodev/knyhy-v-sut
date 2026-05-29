'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookMarked, FileText, User } from 'lucide-react'
import { getFavorites, getSavedArticles } from '@/lib/favorites'
import { getNotes } from '@/lib/notes'

export default function NavbarActions() {
  const pathname = usePathname()
  const [savedCount, setSavedCount] = useState(0)
  const [notesCount, setNotesCount] = useState(0)

  useEffect(() => {
    setSavedCount(getFavorites().length + getSavedArticles().length)
    setNotesCount(getNotes().length)
  }, [])

  const items = [
    { href: '/saved', icon: <BookMarked size={18} strokeWidth={1.5} />, label: 'Збережене', count: savedCount },
    { href: '/notes', icon: <FileText size={18} strokeWidth={1.5} />, label: 'Нотатки', count: notesCount },
    { href: '/profile', icon: <User size={18} strokeWidth={1.5} />, label: 'Профіль', count: 0 },
  ]

  return (
    <div className="hidden md:flex items-center gap-5">
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex items-center gap-1.5 text-sm transition-colors ${
              isActive ? 'text-[#2D5016]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.count > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#2D5016] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {item.count > 9 ? '9+' : item.count}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
