'use client'

import { useState, useEffect } from 'react'

export default function ReadingProgress() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight

      if (docHeight <= 0) return

      const progress = (scrollTop / docHeight) * 100
      setWidth(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => window.removeEventListener('scroll', updateProgress)
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
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        willChange: 'width',
      }}
    />
  )
}
