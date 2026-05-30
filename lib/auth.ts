import { createClient } from '@/lib/supabase/client'

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = createClient()
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signUpWithEmail = async (email: string, password: string, name?: string) => {
  const supabase = createClient()
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${window.location.origin}/`,
    },
  })
}

export const signOut = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
}

export const getCurrentUser = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
