import { Book, Article } from './types'
import { createClient } from '@/lib/supabase/client'

const STORAGE_KEY = 'knyhy_favorites'

// ── Local helpers ──────────────────────────────────────────────────────────────

const getLocalFavorites = (): Book[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// ── Async Book favorites (Supabase-first) ──────────────────────────────────────

export async function getFavorites(): Promise<Book[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data, error } = await supabase
      .from('saved_books')
      .select('books(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) { console.error('getFavorites error:', error); return getLocalFavorites() }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []).map((d: any) => d.books as Book | null).filter(Boolean) as Book[]
  }
  return getLocalFavorites()
}

export async function isFavorite(id: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data } = await supabase
      .from('saved_books')
      .select('id')
      .eq('user_id', user.id)
      .eq('book_id', id)
      .maybeSingle()
    return !!data
  }
  return getLocalFavorites().some(b => b.id === id)
}

export async function saveFavorite(book: Book): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.from('saved_books').upsert({ user_id: user.id, book_id: book.id })
    return
  }
  const favs = getLocalFavorites().filter(b => b.id !== book.id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favs, book]))
}

export async function removeFavorite(id: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.from('saved_books').delete().eq('user_id', user.id).eq('book_id', id)
    return
  }
  const favs = getLocalFavorites().filter(b => b.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs))
}

export async function toggleFavorite(book: Book): Promise<boolean> {
  const faved = await isFavorite(book.id)
  if (faved) {
    await removeFavorite(book.id)
    return false
  } else {
    await saveFavorite(book)
    return true
  }
}

// ── Reading history (localStorage only) ───────────────────────────────────────

export const getHistory = (): Book[] => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('reading_history') || '[]')
  } catch { return [] }
}

export const addToHistory = (book: Book) => {
  const history = getHistory()
  const filtered = history.filter(b => b.id !== book.id)
  localStorage.setItem('reading_history', JSON.stringify([book, ...filtered].slice(0, 50)))
}

// ── Async read-status (Supabase-first) ────────────────────────────────────────

export const getReadBooks = (): string[] => getLocalReadBooks()

const getLocalReadBooks = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('read_books') || '[]')
  } catch { return [] }
}

export const markAsRead = async (bookId: string): Promise<void> => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.from('reading_history').upsert({
      user_id: user.id,
      book_id: bookId,
      is_read: true,
      last_read_at: new Date().toISOString(),
    })
    return
  }
  const read = getLocalReadBooks()
  if (!read.includes(bookId)) {
    localStorage.setItem('read_books', JSON.stringify([...read, bookId]))
  }
}

export const isRead = async (bookId: string): Promise<boolean> => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data } = await supabase
      .from('reading_history')
      .select('is_read')
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .maybeSingle()
    return !!(data?.is_read)
  }
  return getLocalReadBooks().includes(bookId)
}

export const getFirstVisit = (): string => {
  if (typeof window === 'undefined') return new Date().toISOString()
  const stored = localStorage.getItem('first_visit')
  if (stored) return stored
  const now = new Date().toISOString()
  localStorage.setItem('first_visit', now)
  return now
}

// ── Sync Article favorites (localStorage only) ────────────────────────────────

export const getSavedArticles = (): Article[] => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('saved_articles') || '[]')
  } catch { return [] }
}

export const saveArticle = (article: Article): void => {
  const saved = getSavedArticles().filter(a => a.id !== article.id)
  localStorage.setItem('saved_articles', JSON.stringify([article, ...saved]))
}

export const removeArticle = (id: string): void => {
  localStorage.setItem('saved_articles', JSON.stringify(getSavedArticles().filter(a => a.id !== id)))
}

export const isArticleSaved = (id: string): boolean => {
  return getSavedArticles().some(a => a.id === id)
}

export const toggleArticle = (article: Article): boolean => {
  if (isArticleSaved(article.id)) {
    removeArticle(article.id)
    return false
  } else {
    saveArticle(article)
    return true
  }
}
