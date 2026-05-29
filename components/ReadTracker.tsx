'use client'

import { useEffect, useState } from 'react'
import { Book } from '@/lib/types'
import { addToHistory, markAsRead, isRead } from '@/lib/favorites'
import { CheckCircle } from 'lucide-react'

interface Props {
  book: Book
}

export default function ReadTracker({ book }: Props) {
  const [read, setRead] = useState(false)

  useEffect(() => {
    addToHistory(book)
    setRead(isRead(book.id))

    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (scrolled / total >= 0.8) {
        markAsRead(book.id)
        setRead(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [book])

  if (!read) return null

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2D5016] text-white text-xs font-medium rounded-full">
      <CheckCircle size={14} strokeWidth={1.5} />
      Прочитано
    </div>
  )
}
