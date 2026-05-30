'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { migrateLocalStorageToServer, getLocalDataSummary } from '@/lib/sync'

interface Props {
  userId: string
  onClose: () => void
}

export default function MigrationModal({ userId, onClose }: Props) {
  const [summary, setSummary] = useState({ books: 0, notes: 0, history: 0, hasData: false })
  const [migrating, setMigrating] = useState(false)
  const [done, setDone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSummary(getLocalDataSummary())
  }, [])

  if (!mounted || !summary.hasData) return null

  const handleMigrate = async () => {
    setMigrating(true)
    await migrateLocalStorageToServer(userId)
    localStorage.removeItem('knyhy_favorites')
    localStorage.removeItem('user_notes')
    localStorage.removeItem('read_books')
    localStorage.setItem('migration_done', '1')
    setDone(true)
    setTimeout(onClose, 1500)
  }

  const handleSkip = () => {
    localStorage.setItem('migration_skipped', '1')
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        {done ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">✓</div>
            <p className="font-medium text-[#1A1A18]">Перенесено успішно!</p>
          </div>
        ) : (
          <>
            <h2 className="font-playfair text-xl font-semibold text-[#1A1A18] mb-2">
              Перенести ваші дані?
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Ми знайшли в цьому браузері:
            </p>
            <ul className="space-y-2 mb-6 text-sm text-gray-700">
              {summary.books > 0 && <li>📚 {summary.books} збережених книг</li>}
              {summary.notes > 0 && <li>📝 {summary.notes} нотаток</li>}
              {summary.history > 0 && <li>✓ {summary.history} прочитаних книг</li>}
            </ul>
            <p className="text-sm text-gray-500 mb-6">
              Перенесіть в акаунт щоб мати доступ з будь-якого пристрою.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleMigrate}
                disabled={migrating}
                className="flex-1 bg-[#2D5016] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#234010] transition-colors disabled:opacity-50"
              >
                {migrating ? 'Переносимо...' : 'Перенести дані'}
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Пропустити
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}
