import { createClient } from '@/lib/supabase/client'
import type { Note } from '@/lib/notes'

export const migrateLocalStorageToServer = async (userId: string) => {
  const supabase = createClient()

  // Migrate saved books (key: 'knyhy_favorites', stored as array of Book objects)
  const savedBooksRaw = localStorage.getItem('knyhy_favorites')
  const savedBooks = savedBooksRaw ? JSON.parse(savedBooksRaw) : []
  for (const book of savedBooks) {
    if (book.id) {
      await supabase.from('saved_books').upsert(
        { user_id: userId, book_id: book.id },
        { onConflict: 'user_id,book_id', ignoreDuplicates: true }
      )
    }
  }

  // Migrate notes (key: 'user_notes', stored as array of Note objects)
  const notesRaw = localStorage.getItem('user_notes')
  const notes: Note[] = notesRaw ? JSON.parse(notesRaw) : []
  if (notes.length > 0) {
    const serverNotes = notes.map(n => ({
      user_id: userId,
      text: n.text,
      comment: n.comment || '',
      source_type: n.sourceType,
      source_title: n.sourceTitle,
      source_slug: n.sourceSlug,
    }))
    await supabase.from('user_notes').insert(serverNotes)
  }

  // Migrate read books (key: 'read_books', stored as string[] of book IDs)
  const readBooksRaw = localStorage.getItem('read_books')
  const readBooks: string[] = readBooksRaw ? JSON.parse(readBooksRaw) : []
  for (const bookId of readBooks) {
    if (bookId && bookId.includes('-')) {
      await supabase.from('reading_history').upsert(
        { user_id: userId, book_id: bookId, is_read: true },
        { onConflict: 'user_id,book_id', ignoreDuplicates: true }
      )
    }
  }

  return {
    books: savedBooks.length,
    notes: notes.length,
    history: readBooks.length,
  }
}

export const getLocalDataSummary = () => {
  const savedBooks = JSON.parse(localStorage.getItem('knyhy_favorites') || '[]')
  const notes = JSON.parse(localStorage.getItem('user_notes') || '[]')
  const readBooks = JSON.parse(localStorage.getItem('read_books') || '[]')
  return {
    books: savedBooks.length,
    notes: notes.length,
    history: readBooks.length,
    hasData: savedBooks.length > 0 || notes.length > 0 || readBooks.length > 0,
  }
}
