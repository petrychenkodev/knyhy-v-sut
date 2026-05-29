export type Note = {
  id: string
  text: string
  comment: string
  sourceType: 'book' | 'article'
  sourceTitle: string
  sourceSlug: string
  createdAt: string
}

export const getNotes = (): Note[] => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('user_notes') || '[]')
  } catch { return [] }
}

export const saveNote = (note: Omit<Note, 'id' | 'createdAt'>): Note => {
  const notes = getNotes()
  const newNote: Note = { ...note, id: Date.now().toString(), createdAt: new Date().toISOString() }
  localStorage.setItem('user_notes', JSON.stringify([newNote, ...notes]))
  return newNote
}

export const deleteNote = (id: string) => {
  localStorage.setItem('user_notes', JSON.stringify(getNotes().filter(n => n.id !== id)))
}

export const updateNoteComment = (id: string, comment: string) => {
  localStorage.setItem('user_notes', JSON.stringify(getNotes().map(n => n.id === id ? { ...n, comment } : n)))
}
