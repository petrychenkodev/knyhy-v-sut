'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Article, Locale } from '@/lib/types'
import { Clock } from 'lucide-react'

interface ArticleCardProps {
  article: Article
  locale: Locale
}

export default function ArticleCard({ article, locale }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false)
  const title = locale === 'uk' ? article.title_ua : article.title_en
  const excerpt = locale === 'uk' ? article.excerpt_ua : article.excerpt_en
  const date = new Date(article.created_at).toLocaleDateString(
    locale === 'uk' ? 'uk-UA' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <Link href={`/${locale}/articles/${article.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-50 h-full flex flex-col">
        {/* Cover — 16:9 */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          {!imgError && article.cover_url ? (
            <Image
              src={article.cover_url}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2D5016] to-[#4a7a28] p-6">
              <p className="font-playfair text-white font-semibold text-lg text-center leading-snug line-clamp-3">
                {title}
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-playfair text-lg font-semibold text-[#1A1A18] leading-snug mb-2 group-hover:text-[#2D5016] transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">{excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{date}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} strokeWidth={1.5} />
              {article.read_time_min} хв
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
