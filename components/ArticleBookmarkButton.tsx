'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { Article } from '@/lib/types'
import { isArticleSaved, toggleArticle } from '@/lib/favorites'

export default function ArticleBookmarkButton({ article }: { article: Article }) {
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSaved(isArticleSaved(article.id))
  }, [article.id])

  if (!mounted) return null

  const handleToggle = () => {
    const next = toggleArticle(article)
    setSaved(next)
  }

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border
        ${saved
          ? 'bg-[#2D5016] text-white border-[#2D5016]'
          : 'bg-white text-gray-600 border-gray-200 hover:border-[#2D5016] hover:text-[#2D5016]'
        }`}
      aria-label={saved ? 'Видалити зі збережених' : 'Зберегти статтю'}
    >
      <Bookmark size={15} strokeWidth={1.5} fill={saved ? 'currentColor' : 'none'} />
      {saved ? 'Збережено' : 'Зберегти'}
    </button>
  )
}
