import { supabase } from './supabase'

const KEY = 'authToken'
let currentToken = localStorage.getItem(KEY) || ''

// Prime from current session on startup
supabase.auth.getSession().then(({ data }) => {
  const tok = data.session?.access_token
  if (tok) {
    currentToken = tok
    localStorage.setItem(KEY, tok)
  }
})

// Keep token fresh on auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  const tok = session?.access_token || ''
  currentToken = tok
  if (tok) {
    localStorage.setItem(KEY, tok)
  } else {
    localStorage.removeItem(KEY)
  }
})

export function getAccessTokenSync() {
  return currentToken
}

