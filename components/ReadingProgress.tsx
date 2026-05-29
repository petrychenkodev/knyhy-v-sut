'use client'

import { useState, useEffect } from 'react'

export default function ReadingProgress() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // In CSS Grid layout, page scrolls inside <main id="scroll-container">,
    // not on window — so we listen to the container, not window.scroll
    const container = document.getElementById('scroll-container') ?? document.documentElement

    const updateProgress = () => {
      const scrollTop = container.scrollTop
      const docHeight = container.scrollHeight - container.clientHeight
      if (docHeight <= 0) return
      setWidth(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)))
    }

    container.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => container.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${width}%`,
        backgroundColor: '#2D5016',
        zIndex: 9999,
        transition: 'width 0.1s linear',
        pointerEvents: 'none',
      }}
    />
  )
}
