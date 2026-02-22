import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../hooks/useUser'
import { supabase } from '../lib/supabase'

/*
 * Profile Page — Shows real user data from Supabase
 * If logged in: shows email, role, stats from profiles table
 * If not logged in: shows sign in prompt
 */

export default function ProfilePage() {
  const { user, role, loading, signOut } = useUser()
  const [profile, setProfile] = useState(null)
  const router = useRouter()

  // Fetch full profile from Supabase
  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data)
      })
  }, [user])

  if (loading) {
    return (
      <div style={{ padding: '32px 20px', textAlign: 'center', color: '#555' }}>
        Loading...
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <div style={{ padding: '32px 20px' }}>
        <h1 style={{
          fontSize: '22px', fontWeight: '700', color: '#ededed',
          margin: '0 0 8px', letterSpacing: '-0.5px',
        }}>
          Profile
        </h1>
        <p style={{ fontSize: '14px', color: '#555', margin: '0 0 24px' }}>
          Sign in to track your energy savings and earn points.
        </p>

        <button
          onClick={() => router.push('/login')}
          style={{
            width: '100%', padding: '14px',
            background: '#0070f3', color: '#fff',
            border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: '600',
            cursor: 'pointer', fontFamily: "'Inter', sans-serif",
          }}
        >
          Sign In / Sign Up
        </button>
      </div>
    )
  }

  const displayName = profile?.display_name ?? user.email?.split('@')[0]
  const points = profile?.points ?? 0
  const streak = profile?.streak ?? 0

  return (
    <div style={{ padding: '32px 20px' }}>
      <h1 style={{
        fontSize: '22px', fontWeight: '700', color: '#ededed',
        margin: '0 0 24px', letterSpacing: '-0.5px',
      }}>
        Profile
      </h1>

      {/* User card */}
      <div style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: role === 'operator'
            ? 'linear-gradient(135deg, #0070f3, #00d4ff)'
            : 'linear-gradient(135deg, #00c853, #00e676)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', marginBottom: '16px',
        }}>
          {role === 'operator' ? '⚡' : '🏠'}
        </div>

        <div style={{ fontSize: '16px', fontWeight: '600', color: '#ededed', marginBottom: '4px' }}>
          {displayName}
        </div>
        <div style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>
          {user.email}
        </div>
        <div style={{
          display: 'inline-block',
          padding: '3px 10px', borderRadius: '6px',
          fontSize: '11px', fontWeight: '600',
          letterSpacing: '0.5px', textTransform: 'uppercase',
          background: role === 'operator' ? 'rgba(0,112,243,0.12)' : 'rgba(0,200,83,0.12)',
          color: role === 'operator' ? '#4d94ff' : '#00c853',
          marginTop: '8px',
        }}>
          {role}
        </div>
      </div>

      {/* Stats — from Supabase */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px', marginBottom: '16px',
      }}>
        {[
          { label: 'Points', value: points.toLocaleString() },
          { label: 'Streak', value: `${streak} day${streak !== 1 ? 's' : ''}` },
          { label: 'Joined', value: profile?.created_at
            ? new Date(profile.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
            : '—'
          },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px', padding: '16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#ededed' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px', overflow: 'hidden',
      }}>
        {role === 'operator' && (
          <button onClick={() => router.push('/operator')} style={actionBtnStyle}>
            <span>⚡ Switch to Operator Dashboard</span>
            <span style={{ color: '#333' }}>→</span>
          </button>
        )}
        <button
          onClick={async () => { await signOut(); router.push('/login') }}
          style={{ ...actionBtnStyle, color: '#ff3b30', borderBottom: 'none' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

const actionBtnStyle = {
  width: '100%', padding: '16px 20px',
  background: 'transparent', border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  color: '#4d94ff', fontSize: '14px',
  cursor: 'pointer', textAlign: 'left',
  fontFamily: "'Inter', sans-serif",
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
}
