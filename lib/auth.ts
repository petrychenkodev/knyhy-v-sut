import { createClient } from '@/lib/supabase/client'

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = createClient()
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signUpWithEmail = async (email: string, password: string, name?: string) => {
  const supabase = createClient()

  console.log('Attempting signup with:', { email, hasPassword: !!password, name })

  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name || '' },
    },
  })

  console.log('Signup result:', result)
  return result
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
