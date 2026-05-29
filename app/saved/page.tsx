'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Book } from '@/lib/types'
import { getFavorites } from '@/lib/favorites'
import BookCard from '@/components/BookCard'
import { BookMarked, ArrowLeft } from 'lucide-react'

export default function SavedPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setBooks(getFavorites())
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1 className="font-playfair text-2xl md:text-3xl font-semibold text-[#1A1A18]">Збережені книги</h1>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="flex justify-center mb-4">
            <BookMarked size={48} className="text-gray-300" strokeWidth={1.5} />
          </div>
          <p className="text-gray-500 text-base max-w-xs mx-auto">
            Ще немає збережених книг. Натисніть на закладку на будь-якій книзі.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}
