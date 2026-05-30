'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { saveNote, getNotes } from '@/lib/notes'
import { Bookmark, X } from 'lucide-react'

interface Props {
  children: React.ReactNode
  sourceType: 'book' | 'article'
  sourceTitle: string
  sourceSlug: string
}

type Direction = 'up' | 'down' | 'none'

interface PopupState {
  x: number
  y: number
  direction: Direction
}

export default function TextHighlighter({ children, sourceType, sourceTitle, sourceSlug }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const selectedTextRef = useRef('')
  const savedRangeRef = useRef<Range | null>(null)

  const [popup, setPopup] = useState<PopupState | null>(null)
  const [displayText, setDisplayText] = useState('')
  const [toast, setToast] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) { setPopup(null); return }

    const text = selection.toString().trim()
    if (text.length < 10 || text.length > 800) { setPopup(null); return }

    const range = selection.getRangeAt(0)
    const wrapper = wrapperRef.current
    if (!wrapper) return
    if (!wrapper.contains(range.commonAncestorContainer)) { setPopup(null); return }

    // Store text + range in refs so handleSave always reads the latest value
    selectedTextRef.current = text
    savedRangeRef.current = range.cloneRange()
    setDisplayText(text)

    const rect = range.getBoundingClientRect()
    const isMobile = window.innerWidth < 768
    const popupHeight = 44
    const popupWidth = 160
    const margin = 12

    const x = Math.min(
      Math.max(popupWidth / 2 + margin, rect.left + rect.width / 2),
      window.innerWidth - popupWidth / 2 - margin
    )

    let y: number
    let direction: Direction

    if (isMobile) {
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      if (spaceBelow >= popupHeight + margin) {
        y = rect.bottom + margin
        direction = 'down'
      } else if (spaceAbove >= popupHeight + margin) {
        y = rect.top - margin
        direction = 'up'
      } else {
        y = window.innerHeight / 2
        direction = 'none'
      }
    } else {
      y = rect.top - margin
      direction = 'up'
    }

    setPopup({ x, y, direction })
  }, [])

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('touchend', handleSelection)
    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('touchend', handleSelection)
    }
  }, [handleSelection])

  useEffect(() => {
    const hide = () => setPopup(null)
    const scrollEl = document.getElementById('scroll-container') ?? window
    scrollEl.addEventListener('scroll', hide, { passive: true })
    return () => scrollEl.removeEventListener('scroll', hide)
  }, [])

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    console.log('handleSave called')

    const textToSave = selectedTextRef.current || displayText
    console.log('textToSave:', textToSave)
    console.log('sourceTitle:', sourceTitle)
    console.log('sourceSlug:', sourceSlug)

    if (!textToSave) {
      console.log('No text — aborting')
      return
    }

    try {
      const note = { text: textToSave, comment: '', sourceType, sourceTitle, sourceSlug }
      console.log('Saving note:', note)
      saveNote(note)
      console.log('Saved. All notes:', getNotes().length)
    } catch (err) {
      console.error('saveNote error:', err)
    }

    // Visual highlight
    try {
      const range = savedRangeRef.current
      if (range) {
        const span = document.createElement('span')
        span.className = 'saved-highlight'
        span.style.backgroundColor = '#FFF9C4'
        span.style.borderRadius = '2px'
        span.style.padding = '0 1px'
        range.surroundContents(span)
      }
    } catch {
      // spans across element boundaries — ignore
    }

    window.getSelection()?.removeAllRanges()
    selectedTextRef.current = ''
    savedRangeRef.current = null
    setPopup(null)
    setDisplayText('')
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPopup(null)
  }

  const getTransform = (direction: Direction) => {
    if (direction === 'up')   return 'translateX(-50%) translateY(-100%)'
    if (direction === 'down') return 'translateX(-50%)'
    return 'translateX(-50%) translateY(-50%)'
  }

  const arrowUp = (
    <div style={{
      position: 'absolute', bottom: '-6px', left: '50%',
      transform: 'translateX(-50%)',
      width: 0, height: 0,
      borderLeft: '7px solid transparent',
      borderRight: '7px solid transparent',
      borderTop: '7px solid #1A1A18',
    }} />
  )

  const arrowDown = (
    <div style={{
      position: 'absolute', top: '-6px', left: '50%',
      transform: 'translateX(-50%)',
      width: 0, height: 0,
      borderLeft: '7px solid transparent',
      borderRight: '7px solid transparent',
      borderBottom: '7px solid #1A1A18',
    }} />
  )

  return (
    <div ref={wrapperRef} className="highlightable-content">
      {children}

      {mounted && popup && createPortal(
        <div style={{
          position: 'fixed',
          left: `${popup.x}px`,
          top: `${popup.y}px`,
          transform: getTransform(popup.direction),
          zIndex: 9999,
        }}>
          {popup.direction === 'down' && arrowDown}
          <div
            className="flex items-center gap-2 bg-[#1A1A18] rounded-lg px-3 py-2 shadow-lg select-none"
            style={{ cursor: 'pointer' }}
            onClick={handleSave}
            onMouseDown={e => e.preventDefault()} // prevent selection loss on click
          >
            <Bookmark size={14} strokeWidth={1.5} className="text-white/70 shrink-0" />
            <span className="text-white text-sm font-medium whitespace-nowrap">Зберегти</span>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <X
              size={14}
              className="text-white/50 hover:text-white shrink-0"
              onClick={handleDismiss}
            />
          </div>
          {popup.direction === 'up' && arrowUp}
        </div>,
        document.body
      )}

      {mounted && toast && createPortal(
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#2D5016',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 9999,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          Збережено в нотатки ✓
        </div>,
        document.body
      )}
    </div>
  )
}
