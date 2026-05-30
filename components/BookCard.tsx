'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Book } from '@/lib/types'
import { categoryLabels } from '@/lib/i18n'
import { isRead } from '@/lib/favorites'
import FavoriteButton from './FavoriteButton'
import { CheckCircle } from 'lucide-react'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  const title = book.title_ua
  const categoryLabel = categoryLabels[book.category] ?? book.category
  const [imgError, setImgError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [read, setRead] = useState(false)

  useEffect(() => {
    setMounted(true)
    isRead(book.id).then(setRead)
  }, [book.id])

  return (
    <Link href={`/books/${book.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-50">
        {/* Cover */}
        <div className="relative aspect-[2/3] bg-gray-100 overflow-hidden">
          {/* Fallback always rendered behind */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#2D5016] to-[#4a7c28] p-6 text-center">
            <p className="font-playfair text-white font-semibold text-[1.1rem] leading-snug line-clamp-3 mb-2">
              {title}
            </p>
            <p className="text-white/70 text-[0.85rem] mt-2">{book.author}</p>
          </div>

          {/* Real image on top */}
          {!imgError && book.cover_url && (
            <Image
              src={book.cover_url}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300 relative z-10"
              sizes="(max-width: 768px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
          )}

          {/* Favorite button overlay */}
          <div className="absolute top-2 right-2 z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
              <FavoriteButton book={book} />
            </div>
          </div>

          {/* Read badge */}
          {mounted && read && (
            <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 bg-[#2D5016] text-white text-xs px-2 py-1 rounded-full">
              <CheckCircle size={12} strokeWidth={1.5} />
              <span>Прочитано</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#2D5016]/10 text-[#2D5016]">
              {categoryLabel}
            </span>
            <span className="text-xs text-gray-400">
              {book.read_time_min} хв
            </span>
          </div>
          <h3 className="font-playfair text-base font-semibold text-[#1A1A18] leading-snug mb-1 group-hover:text-[#2D5016] transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{book.author}</p>
        </div>
      </div>
    </Link>
  )
}
