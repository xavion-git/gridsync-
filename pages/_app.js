import '../styles/globals.css'
import { useRouter } from 'next/router'
import OperatorNav from '../components/OperatorNav'
import ConsumerNav from '../components/ConsumerNav'
import { useUser } from '../hooks/useUser'
import { useEffect } from 'react'

/*
 * _app.js — Layout switcher + auth gate
 * 
 * /login          → no nav, bare login page
 * /operator/*     → requires auth + operator role, sidebar layout
 * everything else → consumer layout with bottom tabs (no auth required to view)
 */

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const { user, role, loading } = useUser()
  const isOperator = router.pathname.startsWith('/operator')
  const isLoginPage = router.pathname === '/login'

  // Redirect to login if trying to access /operator without auth
  useEffect(() => {
    if (!loading && isOperator && !user) {
      router.push('/login')
    }
  }, [loading, isOperator, user])

  // Redirect operators landing on / to /operator dashboard
  useEffect(() => {
    if (!loading && user && role === 'operator' && router.pathname === '/') {
      router.push('/operator')
    }
  }, [loading, user, role, router.pathname])

  // ─── LOGIN PAGE: no nav ───
  if (isLoginPage) {
    return <Component {...pageProps} />
  }

  // ─── OPERATOR LAYOUT ───
  if (isOperator) {
    if (loading) {
      return (
        <div style={{
          minHeight: '100vh', background: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#555', fontFamily: "'Inter', sans-serif",
        }}>
          Loading...
        </div>
      )
    }

    if (!user) return null // redirecting to login

    // Wait for role to load before showing "access required"
    // If role is still null, we're still fetching
    if (role === null) {
      return (
        <div style={{
          minHeight: '100vh', background: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#555', fontFamily: "'Inter', sans-serif",
        }}>
          Checking permissions...
        </div>
      )
    }

    if (role !== 'operator') {
      return (
        <div style={{
          minHeight: '100vh', background: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '16px',
          fontFamily: "'Inter', sans-serif",
        }}>
          <div style={{ fontSize: '40px' }}>🔒</div>
          <div style={{ fontSize: '16px', color: '#ededed' }}>
            Operator access required
          </div>
          <div style={{ fontSize: '13px', color: '#555' }}>
            You are signed in as <strong style={{ color: '#888' }}>{role}</strong>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '8px 20px', background: 'rgba(255,255,255,0.06)',
                color: '#888', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Consumer App
            </button>
            <button
              onClick={async () => {
                const { signOut } = await import('../hooks/useUser').then(m => m)
                // Use supabase directly
                const { supabase } = await import('../lib/supabase')
                await supabase.auth.signOut()
                router.push('/login')
              }}
              style={{
                padding: '8px 20px', background: '#0070f3',
                color: '#fff', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Switch Account
            </button>
          </div>
        </div>
      )
    }

    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#000',
        fontFamily: "'Inter', sans-serif",
        color: '#ededed',
      }}>
        <OperatorNav />
        <main style={{ flex: 1, overflow: 'auto', minHeight: '100vh' }}>
          <Component {...pageProps} />
        </main>
      </div>
    )
  }

  // ─── CONSUMER LAYOUT ───
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      fontFamily: "'Inter', sans-serif",
      color: '#ededed',
      paddingBottom: '80px',
    }}>
      <Component {...pageProps} />
      <ConsumerNav />
    </div>
  )
}

export default MyApp
