'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Article } from '@/lib/types'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false)
  const title = article.title_ua
  const excerpt = article.excerpt_ua
  const date = new Date(article.created_at).toLocaleDateString('uk-UA', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div
        className="bg-white rounded-2xl overflow-hidden border border-gray-50 h-full flex flex-col
          shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
      >
        {/* Cover — 16:9 */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden rounded-t-2xl">
          {!imgError && article.cover_url ? (
            <Image
              src={article.cover_url}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2D5016] to-[#4a7a28] p-6">
              <p className="font-playfair text-white font-semibold text-lg text-center leading-snug line-clamp-3">
                {title}
              </p>
            </div>
          )}

          {/* Read time badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
            {article.read_time_min} хв
          </div>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-playfair text-xl font-semibold text-[#1A1A18] leading-snug mb-2 group-hover:text-[#2D5016] transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1 leading-relaxed">{excerpt}</p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
      </div>
    </Link>
  )
}
