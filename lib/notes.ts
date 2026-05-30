import { createClient } from '@/lib/supabase/client'

export type Note = {
  id: string
  text: string
  comment: string
  sourceType: 'book' | 'article'
  sourceTitle: string
  sourceSlug: string
  createdAt: string
}

const getLocalNotes = (): Note[] => {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem('user_notes') || '[]') }
  catch { return [] }
}

const saveToLocalStorage = (note: Note) => {
  const notes = getLocalNotes()
  localStorage.setItem('user_notes', JSON.stringify([note, ...notes]))
}

export const getNotes = async (): Promise<Note[]> => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data, error } = await supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) { console.error('getNotes error:', error); return getLocalNotes() }
    return (data || []).map(n => ({
      id: n.id, text: n.text, comment: n.comment || '',
      sourceType: n.source_type as 'book' | 'article',
      sourceTitle: n.source_title, sourceSlug: n.source_slug,
      createdAt: n.created_at,
    }))
  }
  return getLocalNotes()
}

export const saveNote = async (note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> => {
  console.log('saveNote called with:', note)
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data, error } = await supabase
      .from('user_notes')
      .insert({
        user_id: user.id,
        text: note.text,
        comment: note.comment || '',
        source_type: note.sourceType,
        source_title: note.sourceTitle,
        source_slug: note.sourceSlug,
      })
      .select()
      .single()
    if (error) {
      console.error('Error saving note to DB:', error)
      const fallback: Note = { ...note, id: Date.now().toString(), createdAt: new Date().toISOString() }
      saveToLocalStorage(fallback)
      return fallback
    }
    return {
      id: data.id, text: data.text, comment: data.comment || '',
      sourceType: data.source_type as 'book' | 'article',
      sourceTitle: data.source_title, sourceSlug: data.source_slug,
      createdAt: data.created_at,
    }
  }

  const newNote: Note = { ...note, id: Date.now().toString(), createdAt: new Date().toISOString() }
  saveToLocalStorage(newNote)
  console.log('Saved to localStorage. Total:', getLocalNotes().length)
  return newNote
}

export const deleteNote = async (id: string): Promise<void> => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('user_notes').delete().eq('id', id).eq('user_id', user.id)
  } else {
    localStorage.setItem('user_notes', JSON.stringify(getLocalNotes().filter(n => n.id !== id)))
  }
}

export const updateNoteComment = async (id: string, comment: string): Promise<void> => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('user_notes').update({ comment }).eq('id', id).eq('user_id', user.id)
  } else {
    localStorage.setItem('user_notes', JSON.stringify(
      getLocalNotes().map(n => n.id === id ? { ...n, comment } : n)
    ))
  }
}
