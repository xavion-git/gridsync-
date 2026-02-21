import { useState, useEffect } from 'react'
import CollectiveImpact from '../components/CollectiveImpact'

/*
 * Community Page — Collective impact + leaderboard
 * Dark theme matching the rest of the consumer app.
 * Two sections:
 *   1. CollectiveImpact component (existing, untouched)
 *   2. Leaderboard — city-tabbed, top savers with rank + streak
 */

const leaderboardData = {
  edmonton: [
    { rank: 1,   name: 'Sarah K.',  pts: 2847, kw: 58.2, streak: 12, badge: '🥇' },
    { rank: 2,   name: 'Mike T.',   pts: 2634, kw: 54.1, streak: 9,  badge: '🥈' },
    { rank: 3,   name: 'Lisa M.',   pts: 2401, kw: 49.3, streak: 8,  badge: '🥉' },
    { rank: 4,   name: 'James R.',  pts: 2188, kw: 44.8, streak: 7,  badge: null },
    { rank: 5,   name: 'Priya S.',  pts: 1954, kw: 40.2, streak: 6,  badge: null },
    { rank: 6,   name: 'Omar A.',   pts: 1721, kw: 35.4, streak: 5,  badge: null },
    { rank: 342, name: 'You',       pts: 1247, kw: 25.8, streak: 5,  badge: null, isYou: true },
  ],
  calgary: [
    { rank: 1,   name: 'Ben W.',    pts: 3102, kw: 63.7, streak: 15, badge: '🥇' },
    { rank: 2,   name: 'Aisha N.',  pts: 2891, kw: 59.4, streak: 11, badge: '🥈' },
    { rank: 3,   name: 'Carlos M.', pts: 2644, kw: 54.3, streak: 10, badge: '🥉' },
    { rank: 4,   name: 'Emma P.',   pts: 2301, kw: 47.2, streak: 8,  badge: null },
    { rank: 5,   name: 'Noah F.',   pts: 2089, kw: 42.9, streak: 7,  badge: null },
    { rank: 291, name: 'You',       pts: 1247, kw: 25.8, streak: 5,  badge: null, isYou: true },
  ],
  alberta: [
    { rank: 1,    name: 'Ben W.',    pts: 3102, kw: 63.7, streak: 15, badge: '🥇' },
    { rank: 2,    name: 'Sarah K.',  pts: 2847, kw: 58.2, streak: 12, badge: '🥈' },
    { rank: 3,    name: 'Aisha N.',  pts: 2891, kw: 59.4, streak: 11, badge: '🥉' },
    { rank: 4,    name: 'Mike T.',   pts: 2634, kw: 54.1, streak: 9,  badge: null },
    { rank: 5,    name: 'Carlos M.', pts: 2644, kw: 54.3, streak: 10, badge: null },
    { rank: 1203, name: 'You',       pts: 1247, kw: 25.8, streak: 5,  badge: null, isYou: true },
  ],
}

export default function CommunityPage() {
  const [city, setCity] = useState('edmonton')
  const board = leaderboardData[city]

  return (
    <main style={{
      maxWidth: '640px',
      margin: '0 auto',
      padding: '32px 20px 80px',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '26px', fontWeight: '700',
          color: '#ededed', margin: '0 0 6px', letterSpacing: '-0.5px',
        }}>
          Community
        </h1>
        <p style={{ fontSize: '14px', color: '#555', margin: 0 }}>
          Real-time coordinated demand reduction across Alberta
        </p>
      </div>

      {/* Existing collective impact component */}
      <CollectiveImpact />

      {/* ── Leaderboard ── */}
      <div style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        overflow: 'hidden',
        marginTop: '24px',
      }}>
        {/* Header + city tabs */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
          }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#ededed' }}>
              Top Savers 🏆
            </div>
            {/* City tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['edmonton', 'calgary', 'alberta'].map(c => (
                <button key={c} onClick={() => setCity(c)} style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  border: city === c
                    ? '1px solid rgba(0,112,243,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                  background: city === c ? 'rgba(0,112,243,0.12)' : 'transparent',
                  color: city === c ? '#4d94ff' : '#666',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.15s',
                }}>
                  {c === 'alberta' ? 'All AB' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr auto auto',
          gap: '12px',
          padding: '8px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          {['#', 'Name', 'Streak', 'Points'].map(h => (
            <div key={h} style={{ fontSize: '10px', color: '#333', fontWeight: '600',
              textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {board.map((person, idx) => {
          const isYou = !!person.isYou
          const showGap = idx > 0 && person.rank - board[idx - 1].rank > 1
          return (
            <div key={person.rank}>
              {showGap && (
                <div style={{
                  padding: '4px 20px', fontSize: '11px',
                  color: '#222', textAlign: 'center', letterSpacing: '3px',
                }}>
                  · · ·
                </div>
              )}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr auto auto',
                gap: '12px',
                alignItems: 'center',
                padding: '13px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                background: isYou ? 'rgba(0,200,83,0.04)' : 'transparent',
              }}>
                {/* Rank / badge */}
                <div style={{
                  fontSize: person.badge ? '16px' : '12px',
                  fontWeight: '700',
                  color: person.badge ? undefined : '#333',
                  fontFamily: person.badge ? undefined : "'SF Mono', monospace",
                }}>
                  {person.badge ?? `#${person.rank}`}
                </div>

                {/* Name + kW */}
                <div>
                  <div style={{
                    fontSize: '13px', fontWeight: isYou ? '700' : '500',
                    color: isYou ? '#00c853' : '#ccc',
                  }}>
                    {person.name}{isYou && <span style={{ color: '#444', fontWeight: '400' }}> ← you</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: '#444', marginTop: '1px' }}>
                    {person.kw} kW saved
                  </div>
                </div>

                {/* Streak */}
                <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
                  🔥<span style={{ marginLeft: '4px', fontFamily: "'SF Mono', monospace" }}>
                    {person.streak}d
                  </span>
                </div>

                {/* Points */}
                <div style={{
                  fontSize: '13px', fontWeight: '700',
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  color: isYou ? '#00c853' : '#ededed',
                  textAlign: 'right',
                }}>
                  {person.pts.toLocaleString()}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
