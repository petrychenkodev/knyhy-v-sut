import { Book, Article } from './types'

const STORAGE_KEY = 'knyhy_favorites'

export function getFavorites(): Book[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().some((b) => b.id === id)
}

export function saveFavorite(book: Book): void {
  const favs = getFavorites().filter((b) => b.id !== book.id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favs, book]))
}

export function removeFavorite(id: string): void {
  const favs = getFavorites().filter((b) => b.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs))
}

export function toggleFavorite(book: Book): boolean {
  if (isFavorite(book.id)) {
    removeFavorite(book.id)
    return false
  } else {
    saveFavorite(book)
    return true
  }
}

// Reading history
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

// Read books
export const getReadBooks = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('read_books') || '[]')
  } catch { return [] }
}

export const markAsRead = (bookId: string) => {
  const read = getReadBooks()
  if (!read.includes(bookId)) {
    localStorage.setItem('read_books', JSON.stringify([...read, bookId]))
  }
}

export const isRead = (bookId: string): boolean => {
  return getReadBooks().includes(bookId)
}

export const getFirstVisit = (): string => {
  if (typeof window === 'undefined') return new Date().toISOString()
  const stored = localStorage.getItem('first_visit')
  if (stored) return stored
  const now = new Date().toISOString()
  localStorage.setItem('first_visit', now)
  return now
}

// Article favorites
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
