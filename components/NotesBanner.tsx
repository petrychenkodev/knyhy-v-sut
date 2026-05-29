'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookmarkPlus, X } from 'lucide-react'

const BANNER_KEY = 'notes_banner_dismissed'

export default function NotesBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(BANNER_KEY)) setShow(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(BANNER_KEY, 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="flex items-center justify-between gap-3 bg-[#f0f4ed] border border-[#2D5016]/20 rounded-xl px-4 py-3 mb-6">
      <BookmarkPlus size={18} className="text-[#2D5016] shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">Виділяйте текст під час читання</p>
        <p className="text-xs text-gray-500 mt-0.5">
          Зберігайте найважливіші думки в особисті{' '}
          <Link href="/notes" className="text-[#2D5016] hover:underline">нотатки</Link>
        </p>
      </div>
      <button onClick={dismiss} aria-label="Закрити" className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
        <X size={16} />
      </button>
    </div>
  )
}
