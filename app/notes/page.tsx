'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Newspaper, FileText, Trash2 } from 'lucide-react'
import { getNotes, deleteNote, updateNoteComment, type Note } from '@/lib/notes'

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'щойно'
  if (minutes < 60) return `${minutes} хв тому`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} год тому`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} дн тому`
  return new Date(isoString).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })
}

function exportNotes(notes: Note[]) {
  const lines = notes.map(n =>
    `[${n.sourceType === 'book' ? 'Книга' : 'Стаття'}] ${n.sourceTitle}\n` +
    `«${n.text}»\n` +
    (n.comment ? `Коментар: ${n.comment}\n` : '') +
    `${new Date(n.createdAt).toLocaleDateString('uk-UA')}\n` +
    '---'
  )
  const blob = new Blob([lines.join('\n\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'my-notes.txt'
  a.click()
  URL.revokeObjectURL(url)
}

type Filter = 'all' | 'book' | 'article'

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setNotes(getNotes())
  }, [])

  const handleDelete = (id: string) => {
    if (!window.confirm('Видалити цю нотатку?')) return
    deleteNote(id)
    setNotes(getNotes())
  }

  const handleCommentBlur = (id: string, comment: string) => {
    updateNoteComment(id, comment)
    setNotes(getNotes())
  }

  const filtered = filter === 'all' ? notes : notes.filter(n => n.sourceType === filter)

  if (!mounted) return null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-[#1A1A18]">Мої нотатки</h1>
          <p className="text-sm text-gray-500 mt-1">{notes.length} нотаток</p>
        </div>
        {notes.length > 0 && (
          <button
            onClick={() => exportNotes(notes)}
            className="mt-1 text-sm text-[#2D5016] border border-[#2D5016] px-3 py-1.5 rounded-lg hover:bg-[#2D5016]/5 transition-colors"
          >
            Експорт
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 mt-4">
        {(['all', 'book', 'article'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-[#2D5016] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'Всі' : f === 'book' ? 'Книги' : 'Статті'}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center text-center py-20 gap-4">
          <FileText size={48} strokeWidth={1} className="text-gray-300" />
          <p className="text-gray-500 text-sm max-w-xs">
            Ще немає нотаток. Виділіть текст під час читання.
          </p>
          <Link href="/catalog" className="text-[#2D5016] text-sm hover:underline">
            Перейти до каталогу →
          </Link>
        </div>
      )}

      {/* Notes list */}
      <div className="space-y-4">
        {filtered.map(note => (
          <div
            key={note.id}
            className="bg-white rounded-xl shadow-sm border-l-[3px] border-[#2D5016] p-5"
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            {/* Source line */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
              {note.sourceType === 'book'
                ? <BookOpen size={14} strokeWidth={1.5} />
                : <Newspaper size={14} strokeWidth={1.5} />
              }
              <span className="font-medium text-gray-600 truncate">{note.sourceTitle}</span>
              <span className="ml-auto shrink-0">{timeAgo(note.createdAt)}</span>
            </div>

            {/* Highlighted text */}
            <p className="font-playfair italic text-gray-800 text-base leading-relaxed mb-3">
              «{note.text}»
            </p>

            {/* Comment */}
            <textarea
              defaultValue={note.comment}
              placeholder="Додати коментар..."
              rows={2}
              onBlur={e => handleCommentBlur(note.id, e.target.value)}
              className="w-full text-sm text-gray-600 placeholder-gray-300 resize-none outline-none border-0 border-b border-transparent focus:border-gray-200 transition-colors bg-transparent"
            />

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <Link
                href={`/${note.sourceType === 'book' ? 'books' : 'articles'}/${note.sourceSlug}`}
                className="text-xs text-[#2D5016] hover:underline"
              >
                Перейти →
              </Link>
              <button
                onClick={() => handleDelete(note.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
                aria-label="Видалити"
              >
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
