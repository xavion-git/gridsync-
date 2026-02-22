import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/*
 * useUser — Auth hook for GridSync
 *
 * Returns { user, role, loading, signOut }
 * Role is fetched from profiles table, with fallback to user_metadata.
 */
export function useUser() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fetchRole(u)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null
        setUser(u)
        if (u) fetchRole(u)
        else {
          setRole(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchRole(authUser) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single()
      
      // Use profiles table role, fallback to metadata, then default to consumer
      setRole(data?.role ?? authUser.user_metadata?.role ?? 'consumer')
    } catch {
      // If profiles query fails entirely, use metadata
      setRole(authUser.user_metadata?.role ?? 'consumer')
    }
    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
  }

  return { user, role, loading, signOut }
}
