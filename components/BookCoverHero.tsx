'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Book, Locale } from '@/lib/types'
import { t, categoryLabels } from '@/lib/i18n'
import FavoriteButton from './FavoriteButton'

interface BookCoverHeroProps {
  book: Book
  locale: Locale
}

export default function BookCoverHero({ book, locale }: BookCoverHeroProps) {
  const tr = t[locale]
  const title = locale === 'uk' ? book.title_ua : book.title_en
  const categoryLabel = categoryLabels[book.category]?.[locale] ?? book.category
  const [imgError, setImgError] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-8">
        {/* Cover */}
        <div className="flex justify-center md:block">
          <div className="relative w-[160px] md:w-[200px] aspect-[2/3] rounded-lg overflow-hidden shadow-md">
            {/* Fallback always behind */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#2D5016] to-[#4a7c28] p-4 text-center">
              <p className="font-playfair text-white font-semibold text-sm leading-snug line-clamp-4 mb-2">
                {title}
              </p>
              <p className="text-white/70 text-xs">{book.author}</p>
            </div>

            {/* Real image on top */}
            {!imgError && book.cover_url && (
              <Image
                src={book.cover_url}
                alt={title}
                fill
                className="object-cover relative z-10"
                sizes="200px"
                priority
                onError={() => setImgError(true)}
              />
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-col justify-center">
          <div className="flex items-start justify-between gap-3 mb-3">
            <span className="inline-flex w-fit text-xs font-medium px-3 py-1 rounded-full border border-[#2D5016]/30 text-[#2D5016]">
              {categoryLabel}
            </span>
            <FavoriteButton book={book} locale={locale} className="shrink-0" />
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A1A18] leading-tight mb-3">
            {title}
          </h1>
          <p className="text-lg text-gray-500 mb-4">{book.author}</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2D5016]/10 text-[#2D5016] text-sm font-medium rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {book.read_time_min} {tr.minutesRead}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
