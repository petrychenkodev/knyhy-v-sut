'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Book, Article } from '@/lib/types'
import { getFavorites, getSavedArticles, toggleArticle } from '@/lib/favorites'
import BookCard from '@/components/BookCard'
import { BookMarked, Newspaper, ArrowLeft, Bookmark } from 'lucide-react'

function ArticleRow({ article, onRemove }: { article: Article; onRemove: (id: string) => void }) {
  const [imgError, setImgError] = useState(false)

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleArticle(article)
    onRemove(article.id)
  }

  return (
    <div className="relative group">
      <Link href={`/articles/${article.slug}`} className="flex gap-4 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
        <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          {!imgError && article.cover_url ? (
            <Image src={article.cover_url} alt={article.title_ua} fill className="object-cover" sizes="80px" onError={() => setImgError(true)} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2D5016] to-[#4a7a28] flex items-center justify-center">
              <Newspaper size={16} className="text-white" strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#1A1A18] line-clamp-2 text-sm leading-snug">{article.title_ua}</p>
          <p className="text-xs text-gray-400 mt-1">{article.read_time_min} хв читання</p>
        </div>
      </Link>
      <button
        onClick={handleRemove}
        className="absolute top-3 right-3 p-1 text-[#2D5016] hover:text-red-400 transition-colors"
        aria-label="Видалити"
      >
        <Bookmark size={14} strokeWidth={1.5} fill="currentColor" />
      </button>
    </div>
  )
}

export default function SavedPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setBooks(getFavorites())
    setArticles(getSavedArticles())
    setMounted(true)
  }, [])

  if (!mounted) return null

  const hasNothing = books.length === 0 && articles.length === 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1 className="font-playfair text-2xl md:text-3xl font-semibold text-[#1A1A18]">Збережене</h1>
      </div>

      {hasNothing ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="flex justify-center mb-4">
            <BookMarked size={48} className="text-gray-300" strokeWidth={1.5} />
          </div>
          <p className="text-gray-500 text-base max-w-xs mx-auto">
            Ще нічого не збережено. Натисніть на закладку на будь-якій книзі чи статті.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {books.length > 0 && (
            <section>
              <h2 className="font-playfair text-lg font-semibold text-[#1A1A18] mb-4 flex items-center gap-2">
                <BookMarked size={18} strokeWidth={1.5} className="text-[#2D5016]" />
                Книги · {books.length}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          )}

          {articles.length > 0 && (
            <section>
              <h2 className="font-playfair text-lg font-semibold text-[#1A1A18] mb-4 flex items-center gap-2">
                <Newspaper size={18} strokeWidth={1.5} className="text-[#2D5016]" />
                Статті · {articles.length}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {articles.map((article) => (
                  <ArticleRow
                    key={article.id}
                    article={article}
                    onRemove={(id) => setArticles(prev => prev.filter(a => a.id !== id))}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
