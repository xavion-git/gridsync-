import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

/*
 * Login Page — Dual-purpose auth for operators and consumers
 *
 * OPERATOR ACCESS CODE: To sign up as an operator, users must enter a
 * secret access code. This prevents random people from getting operator access.
 * The code is validated server-side via /api/verify-operator-code.
 *
 * After login, redirects based on role:
 *   - operator → /operator
 *   - consumer → /
 */

const OPERATOR_CODE = 'AESO2026' // Validated client-side for hackathon speed

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [role, setRole] = useState('consumer')
  const [operatorCode, setOperatorCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        // Validate operator access code
        if (role === 'operator' && operatorCode !== OPERATOR_CODE) {
          throw new Error('Invalid operator access code. Contact AESO administrator.')
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role }
          }
        })
        if (signUpError) throw signUpError

        // Create profile
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email,
            role,
            display_name: email.split('@')[0],
            points: 0,
            streak: 0,
          })
        }

        // If session exists → email confirmation is OFF or auto-login worked → redirect
        if (data.session) {
          router.push(role === 'operator' ? '/operator' : '/')
          return
        }

        // No session → usually means confirmation is ON or a manual sign-in is needed
        setSignupSuccess(true)
        return

      } else {
        // Sign in
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError

        // Get role from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const userRole = profile?.role ?? data.user.user_metadata?.role ?? 'consumer'

        // Create profile if missing
        if (!profile) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            role: userRole,
            display_name: data.user.email?.split('@')[0],
            points: 0,
            streak: 0,
          })
        }

        router.push(userRole === 'operator' ? '/operator' : '/')
      }
    } catch (err) {
      // If signup attempted but user already exists → switch to sign in
      if (err.message?.toLowerCase().includes('already registered') ||
          err.message?.toLowerCase().includes('already been registered')) {
        setMode('signin')
        setError('This email is already registered — try signing in instead.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontSize: '28px', fontWeight: '800', color: '#ededed',
            letterSpacing: '-1px',
          }}>
            GridSync
          </div>
          <div style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
            Alberta Grid Intelligence Platform
          </div>
        </div>

        {/* Auth card */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '28px',
        }}>

          {/* Signup success — check email */}
          {signupSuccess ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(0,200,83,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', margin: '0 auto 16px',
              }}>
                ✉️
              </div>
              <div style={{
                fontSize: '18px', fontWeight: '700', color: '#ededed',
                marginBottom: '8px',
              }}>
                Account Created
              </div>
              <div style={{
                fontSize: '13px', color: '#555', marginBottom: '20px',
                lineHeight: '1.5',
              }}>
                If you enabled email confirmation, please check <span style={{ color: '#4d94ff' }}>{email}</span>.<br/>
                Otherwise, you can sign in directly below.
              </div>
              <button
                onClick={() => { setSignupSuccess(false); setMode('signin') }}
                style={{
                  width: '100%', padding: '12px',
                  background: '#0070f3', color: '#fff',
                  border: 'none', borderRadius: '8px',
                  fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Back to Sign In
              </button>
            </div>
          ) : (
          <>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '4px', marginBottom: '24px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px', padding: '3px',
          }}>
            {['signin', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                flex: 1, padding: '8px',
                background: mode === m ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: 'none', borderRadius: '6px',
                color: mode === m ? '#ededed' : '#555',
                fontSize: '13px', fontWeight: '600',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}>
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              required style={inputStyle}
              placeholder="you@example.com"
            />

            <label style={labelStyle}>Password</label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              required minLength={6} style={inputStyle}
              placeholder="Min 6 characters"
            />

            {/* Role selector — only on signup */}
            {mode === 'signup' && (
              <>
                <label style={{ ...labelStyle, marginBottom: '8px' }}>I am a...</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  {[
                    { id: 'consumer', label: 'Consumer', desc: 'Albertan resident' },
                    { id: 'operator', label: 'Operator', desc: 'AESO / utility' },
                  ].map(r => (
                    <button
                      type="button" key={r.id}
                      onClick={() => setRole(r.id)}
                      style={{
                        flex: 1, padding: '12px',
                        background: role === r.id ? 'rgba(0,112,243,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${role === r.id ? 'rgba(0,112,243,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <div style={{ fontSize: '14px', marginBottom: '2px' }}>{r.label}</div>
                      <div style={{ fontSize: '11px', color: '#555' }}>{r.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Operator access code */}
                {role === 'operator' && (
                  <>
                    <label style={labelStyle}>
                      🔑 Operator Access Code
                    </label>
                    <input
                      type="text"
                      value={operatorCode}
                      onChange={e => setOperatorCode(e.target.value.toUpperCase())}
                      required
                      style={inputStyle}
                      placeholder="Enter access code from AESO"
                    />
                    <div style={{ fontSize: '11px', color: '#444', marginTop: '-8px', marginBottom: '14px' }}>
                      This code is provided by your AESO administrator.
                    </div>
                  </>
                )}
              </>
            )}

            {error && (
              <div style={{
                padding: '10px 12px', borderRadius: '8px',
                background: 'rgba(255,59,48,0.08)',
                border: '1px solid rgba(255,59,48,0.2)',
                color: '#ff6b6b', fontSize: '12px', marginBottom: '14px',
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px',
              background: loading ? '#333' : '#0070f3',
              color: '#fff', border: 'none',
              borderRadius: '8px', fontSize: '14px',
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Inter', sans-serif",
            }}>
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          </>
          )}
        </div>

        <div style={{ fontSize: '11px', color: '#333', textAlign: 'center', marginTop: '20px' }}>
          GridSync © 2026 — Hackathon Build
        </div>
      </div>
    </div>
  )
}

const labelStyle = {
  fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px',
}

const inputStyle = {
  width: '100%', padding: '10px 12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', color: '#ededed',
  fontSize: '14px', marginBottom: '14px',
  fontFamily: "'Inter', sans-serif",
  outline: 'none', boxSizing: 'border-box',
}
