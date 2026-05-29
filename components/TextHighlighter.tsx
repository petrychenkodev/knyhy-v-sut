'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
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
  direction: 'up' | 'down'
  range: Range
}

export default function TextHighlighter({ children, sourceType, sourceTitle, sourceSlug }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [popup, setPopup] = useState<PopupState | null>(null)
  const [toast, setToast] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) { setPopup(null); return }

    const text = selection.toString().trim()
    if (text.length < 10 || text.length > 800) { setPopup(null); return }

    if (!containerRef.current) return
    const range = selection.getRangeAt(0)
    if (!containerRef.current.contains(range.commonAncestorContainer)) { setPopup(null); return }

    const rect = range.getBoundingClientRect()
    const isMobile = window.innerWidth < 768
    const clampX = (raw: number) => Math.min(window.innerWidth - 90, Math.max(90, raw))
    const cx = clampX(rect.left + rect.width / 2)

    setPopup(isMobile
      ? { x: cx, y: rect.bottom + 8, text, direction: 'down', range: range.cloneRange() }
      : { x: cx, y: rect.top - 8,    text, direction: 'up',   range: range.cloneRange() }
    )
  }, [])

  // Use capture phase so events bubble through nested elements (lists, etc.)
  useEffect(() => {
    document.addEventListener('mouseup', handleSelection, true)
    document.addEventListener('touchend', handleSelection, true)
    return () => {
      document.removeEventListener('mouseup', handleSelection, true)
      document.removeEventListener('touchend', handleSelection, true)
    }
  }, [handleSelection])

  useEffect(() => {
    const hide = () => setPopup(null)
    const scrollEl = document.getElementById('scroll-container') ?? window
    scrollEl.addEventListener('scroll', hide, { passive: true })
    return () => scrollEl.removeEventListener('scroll', hide)
  }, [])

  const handleSave = () => {
    if (!popup) return
    saveNote({ text: popup.text, comment: '', sourceType, sourceTitle, sourceSlug })

    // Visual highlight in DOM (resets on reload)
    try {
      const highlightSpan = document.createElement('span')
      highlightSpan.className = 'saved-highlight'
      highlightSpan.style.backgroundColor = '#FFF9C4'
      highlightSpan.style.borderRadius = '2px'
      highlightSpan.style.padding = '0 1px'
      popup.range.surroundContents(highlightSpan)
    } catch {
      // surroundContents fails across element boundaries — ignore
    }

    window.getSelection()?.removeAllRanges()
    setPopup(null)
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  const arrowUp = (
    <div style={{
      position: 'absolute', top: '-6px', left: '50%',
      transform: 'translateX(-50%)',
      width: 0, height: 0,
      borderLeft: '7px solid transparent',
      borderRight: '7px solid transparent',
      borderBottom: '7px solid #1A1A18',
    }} />
  )

  const arrowDown = (
    <div style={{
      position: 'absolute', bottom: '-6px', left: '50%',
      transform: 'translateX(-50%)',
      width: 0, height: 0,
      borderLeft: '7px solid transparent',
      borderRight: '7px solid transparent',
      borderTop: '7px solid #1A1A18',
    }} />
  )

  return (
    <div ref={containerRef} className="highlightable-content">
      {children}

      {mounted && popup && createPortal(
        <div style={{
          position: 'fixed',
          left: `${popup.x}px`,
          top: `${popup.y}px`,
          transform: popup.direction === 'up'
            ? 'translateX(-50%) translateY(-100%)'
            : 'translateX(-50%)',
          zIndex: 9999,
        }}>
          {popup.direction === 'down' && arrowUp}
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
          {popup.direction === 'up' && arrowDown}
        </div>,
        document.body
      )}

      {mounted && toast && createPortal(
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#2D5016] text-white px-4 py-2 rounded-lg shadow-lg z-[9999] text-sm pointer-events-none">
          Збережено ✓
        </div>,
        document.body
      )}
    </div>
  )
}
