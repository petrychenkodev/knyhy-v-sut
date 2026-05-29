'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { saveNote } from '@/lib/notes'

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

  const handleDismiss = () => {
    setPopup(null)
    window.getSelection()?.removeAllRanges()
  }

  return (
    <div ref={containerRef}>
      {children}

      {mounted && popup && createPortal(
        <div
          style={{
            position: 'absolute',
            left: popup.x,
            top: popup.y - 8,
            transform: 'translateX(-50%) translateY(-100%)',
            zIndex: 1000,
          }}
          className="bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 flex items-center gap-2"
        >
          <button
            onClick={handleSave}
            className="bg-[#2D5016] text-white px-3 py-1.5 rounded text-sm whitespace-nowrap hover:bg-[#3a6b1e] transition-colors"
          >
            📌 Зберегти в нотатки
          </button>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
            aria-label="Закрити"
          >
            ✕
          </button>
          {/* Triangle arrow */}
          <span
            style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #e5e7eb',
            }}
          />
          <span
            style={{
              position: 'absolute',
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid white',
            }}
          />
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
