/*
 * Consumer Profile — Your stats, badges, and streak
 * Shows personal impact tracking + gamification progress.
 * All mock data — Phase 5 (Supabase) makes it real.
 */

const badges = [
  { icon: '🥇', name: 'First Alert', desc: 'Participated in first grid alert', earned: true },
  { icon: '🔥', name: 'Week Warrior', desc: '7-day participation streak', earned: true },
  { icon: '⚡', name: 'Blackout Preventer', desc: 'Part of a successful community event', earned: true },
  { icon: '🌍', name: 'Top 10%', desc: 'Ranked in top 10% of savers', earned: false },
  { icon: '💎', name: 'Month Master', desc: '30-day unbroken streak', earned: false },
  { icon: '🏆', name: 'Community Hero', desc: 'Saved over 100 kW total', earned: false },
]

export default function Profile() {
  return (
    <div style={{ padding: '24px 20px', maxWidth: '500px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px', paddingTop: '12px' }}>
        {/* Avatar */}
        <div style={{
          width: '72px', height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0070f3, #00c853)',
          margin: '0 auto 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px',
        }}>
          👤
        </div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#ededed' }}>
          Your Profile
        </div>
        <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
          Edmonton, AB
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {[
          { value: '1,247', label: 'Points', color: '#ff9500' },
          { value: '5 🔥', label: 'Day Streak' },
          { value: '#342', label: 'Edmonton Rank' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '22px',
              fontWeight: '700',
              fontFamily: "'SF Mono', monospace",
              color: stat.color || '#ededed',
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Impact card */}
      <div style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#ededed', marginBottom: '16px' }}>
          Your Impact
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {[
            { value: '47.2', unit: 'kW', label: 'Total Saved' },
            { value: '12', unit: '', label: 'Alerts Joined' },
            { value: '$8.40', unit: '', label: 'Money Saved' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '2px' }}>
                <span style={{
                  fontSize: '20px', fontWeight: '700', color: '#00c853',
                  fontFamily: "'SF Mono', monospace",
                }}>
                  {stat.value}
                </span>
                {stat.unit && <span style={{ fontSize: '12px', color: '#555' }}>{stat.unit}</span>}
              </div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#ededed', marginBottom: '16px' }}>
          Badges
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {badges.map((badge, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: '14px 8px',
              borderRadius: '10px',
              background: badge.earned ? 'rgba(255,255,255,0.02)' : 'transparent',
              border: badge.earned
                ? '1px solid rgba(255,255,255,0.06)'
                : '1px dashed rgba(255,255,255,0.06)',
              opacity: badge.earned ? 1 : 0.4,
            }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>{badge.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#ccc' }}>
                {badge.name}
              </div>
              <div style={{ fontSize: '9px', color: '#555', marginTop: '2px' }}>
                {badge.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
