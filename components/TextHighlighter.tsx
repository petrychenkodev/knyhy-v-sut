'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { saveNote } from '@/lib/notes'
import { Bookmark, X } from 'lucide-react'

interface Props {
  children: React.ReactNode
  sourceType: 'book' | 'article'
  sourceTitle: string
  sourceSlug: string
}

interface PopupState {
  x: number
  y: number
  text: string
}

export default function TextHighlighter({ children, sourceType, sourceTitle, sourceSlug }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [popup, setPopup] = useState<PopupState | null>(null)
  const [toast, setToast] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      setPopup(null)
      return
    }

    const text = selection.toString().trim()
    if (text.length < 10 || text.length > 500) {
      setPopup(null)
      return
    }

    // Check if selection is inside our container
    if (!containerRef.current) return
    const range = selection.getRangeAt(0)
    if (!containerRef.current.contains(range.commonAncestorContainer)) {
      setPopup(null)
      return
    }

    const rect = range.getBoundingClientRect()
    setPopup({
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY,
      text,
    })
  }, [])

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('touchend', handleSelection)
    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('touchend', handleSelection)
    }
  }, [handleSelection])

  const handleSave = () => {
    if (!popup) return
    saveNote({
      text: popup.text,
      comment: '',
      sourceType,
      sourceTitle,
      sourceSlug,
    })
    setPopup(null)
    window.getSelection()?.removeAllRanges()
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  return (
    <div ref={containerRef}>
      {children}

      {mounted && popup && createPortal(
        <div
          style={{
            position: 'fixed',
            left: popup.x,
            top: popup.y,
            transform: 'translateX(-50%) translateY(-100%)',
            zIndex: 1000,
            marginTop: '-8px',
          }}
        >
          <div
            className="flex items-center gap-2 bg-[#1A1A18] rounded-lg px-3 py-2 shadow-lg cursor-pointer select-none"
            onClick={handleSave}
          >
            <Bookmark size={14} strokeWidth={1.5} className="text-white/70 shrink-0" />
            <span className="text-white text-sm font-medium whitespace-nowrap">Зберегти</span>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <X
              size={14}
              className="text-white/50 hover:text-white shrink-0"
              onClick={(e) => { e.stopPropagation(); setPopup(null) }}
            />
          </div>
          {/* Triangle arrow pointing down */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-1.5 overflow-hidden">
            <div className="w-3 h-3 bg-[#1A1A18] rotate-45 translate-y-[-50%]" />
          </div>
        </div>,
        document.body
      )}

      {mounted && toast && createPortal(
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-[#2D5016] text-white px-4 py-2 rounded-lg shadow-lg z-[1001] text-sm">
          Збережено ✓
        </div>,
        document.body
      )}
    </div>
  )
}
