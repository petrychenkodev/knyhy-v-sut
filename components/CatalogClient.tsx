'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Book } from '@/lib/types'
import { t, categoryLabels, catalogSubtitle, foundBooks } from '@/lib/i18n'
import BookCard from './BookCard'
import { Search, X, SearchX } from 'lucide-react'

interface CatalogClientProps {
  books: Book[]
}

const CATEGORIES = [
  { value: 'all' },
  { value: 'psychology' },
  { value: 'business' },
  { value: 'science' },
  { value: 'philosophy' },
  { value: 'health' },
  { value: 'finance' },
]

export default function CatalogClient({ books }: CatalogClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? 'all')
  const [animating, setAnimating] = useState(false)

  const updateURL = useCallback((q: string, cat: string) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (cat && cat !== 'all') params.set('category', cat)
    const queryString = params.toString()
    router.replace(`/catalog${queryString ? `?${queryString}` : ''}`)
  }, [router])

  function handleSearch(value: string) {
    setSearchQuery(value)
    triggerAnimation()
    updateURL(value, selectedCategory)
  }

  function handleCategory(cat: string) {
    setSelectedCategory(cat)
    triggerAnimation()
    updateURL(searchQuery, cat)
  }

  function triggerAnimation() {
    setAnimating(true)
    setTimeout(() => setAnimating(false), 200)
  }

  function resetFilters() {
    setSearchQuery('')
    setSelectedCategory('all')
    router.replace('/catalog')
  }

  const filtered = books
    .filter(book =>
      selectedCategory === 'all' || book.category === selectedCategory
    )
    .filter(book => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        book.title_ua.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q)
      )
    })

  const countByCategory = (cat: string) =>
    cat === 'all'
      ? books.length
      : books.filter(b => b.category === cat).length

  function categoryLabel(value: string): string {
    if (value === 'all') return t.allCategory
    return categoryLabels[value] ?? value
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Page header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A1A18] mb-1">
          {t.catalogTitle}
        </h1>
        <p className="text-sm text-gray-500">
          {catalogSubtitle(books.length)}
        </p>
      </div>

      {/* Sticky search + filters */}
      <div className="sticky top-16 z-40 bg-[#FAFAF8] border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
          {/* Search */}
          <div className="relative max-w-md">
            <Search size={18} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5016]/40 focus:border-[#2D5016] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const count = countByCategory(cat.value)
              const isActive = selectedCategory === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategory(cat.value)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border whitespace-nowrap
                    ${isActive
                      ? 'bg-[#2D5016] text-white border-[#2D5016]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#2D5016]/40 hover:text-[#2D5016]'
                    }`}
                >
                  {categoryLabel(cat.value)} ({count})
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        <p className="text-sm text-gray-500 mb-5">
          {foundBooks(filtered.length)}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="flex justify-center mb-4">
              <SearchX size={48} className="text-gray-300" strokeWidth={1.5} />
            </div>
            <p className="text-gray-600 mb-4">{t.noResults}</p>
            <button
              onClick={resetFilters}
              className="px-5 py-2 text-sm font-medium text-[#2D5016] border border-[#2D5016] rounded-lg hover:bg-[#2D5016] hover:text-white transition-colors"
            >
              {t.resetFilters}
            </button>
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}
          >
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
