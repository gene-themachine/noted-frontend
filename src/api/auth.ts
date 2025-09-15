import { supabase } from '@/lib/supabase'
import { setBearerToken, removeBearerToken } from '@/utils/localStorage'

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  if (data.session?.access_token) setBearerToken(data.session.access_token)
  return { data }
}

export async function register(
  email: string,
  password: string,
  username: string,
  firstName: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, firstName } },
  })
  if (error) throw error
  return { data: { userId: data.user?.id } }
}

export async function logout() {
  await supabase.auth.signOut()
  removeBearerToken()
}

export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return { data }
}
