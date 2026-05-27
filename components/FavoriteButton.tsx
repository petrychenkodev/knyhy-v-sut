'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Book, Locale } from '@/lib/types'
import { isFavorite, toggleFavorite } from '@/lib/favorites'

interface FavoriteButtonProps {
  book: Book
  locale?: Locale
  className?: string
}

const toastLabels = {
  uk: { saved: 'Збережено', removed: 'Видалено зі збережених' },
  en: { saved: 'Saved',     removed: 'Removed from saved' },
}

export default function FavoriteButton({ book, locale = 'uk', className = '' }: FavoriteButtonProps) {
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const labels = toastLabels[locale]

  useEffect(() => {
    setMounted(true)
    setSaved(isFavorite(book.id))
  }, [book.id])

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const nowSaved = toggleFavorite(book)
    setSaved(nowSaved)
    setToast(nowSaved ? labels.saved : labels.removed)
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <>
      <button
        onClick={handleToggle}
        aria-label={saved ? 'Remove from saved' : 'Save book'}
        className={`transition-colors ${className}`}
      >
        {saved ? (
          <svg className="w-5 h-5 text-[#2D5016]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-400 hover:text-[#2D5016]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z" />
          </svg>
        )}
      </button>

      {/* Render toast at document.body to escape any overflow:hidden/transform context */}
      {mounted && toast && createPortal(
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap">
          {toast}
        </div>,
        document.body
      )}
    </>
  )
}
