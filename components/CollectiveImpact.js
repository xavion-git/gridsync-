import { useState, useEffect } from 'react'

const GOAL_MW = 50

/*
 * CollectiveImpact — Community Grid Defense Dashboard
 * 
 * THIS IS THE DIFFERENTIATOR (from context.md):
 * This feature turns GridSync from "another prediction app" into
 * "a community-powered solution that actually prevents blackouts."
 * 
 * HOW IT WORKS:
 * Currently uses SIMULATED data to demonstrate the concept:
 * - Participant count slowly increases (simulating users joining)
 * - MW saved slowly increases (simulating collective energy reduction)
 * - All impact metrics (money, CO₂, homes) are derived from savedMW
 * 
 * WHEN CONNECTED TO SUPABASE:
 * Replace the simulated values with real queries:
 *   const { data } = await supabase.from('participation_events').select('*')
 * The component structure stays identical — just swap the data source.
 */
export default function CollectiveImpact() {
  const [participants, setParticipants] = useState(11240)
  const [savedMW, setSavedMW] = useState(32.4)

  // Simulate live updates — increment slowly for demo effect
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants(p => p + Math.floor(Math.random() * 3))
      setSavedMW(s => Math.min(GOAL_MW, +(s + Math.random() * 0.2).toFixed(1)))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const progress = Math.min((savedMW / GOAL_MW) * 100, 100)

  // Derived impact metrics — calculated from the simulated savedMW
  const metrics = [
    {
      label: 'Money Saved',
      value: `$${Math.round(savedMW * 3 * 1000).toLocaleString()}`,
      desc: 'Avoided peak pricing',
      icon: '💰',
    },
    {
      label: 'CO₂ Avoided',
      value: `${Math.round(savedMW * 3 * 0.5)} tons`,
      desc: 'Gas peakers not fired up',
      icon: '🌱',
    },
    {
      label: 'Homes Powered',
      value: Math.round(savedMW * 500).toLocaleString(),
      desc: 'Equivalent capacity freed',
      icon: '🏠',
    },
    {
      label: 'Blackout Risk',
      value: `${Math.round(progress * 0.4)}%  ↓`,
      desc: 'Reduction from baseline',
      icon: '🛡️',
    },
  ]

  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '32px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#ededed', margin: '0 0 4px' }}>
        ⚡ Community Grid Defense
      </h2>
      <p style={{ fontSize: '13px', color: '#555', margin: '0 0 32px' }}>
        Real-time coordinated demand reduction
      </p>

      {/* Participant counter */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          fontSize: '48px',
          fontWeight: '700',
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          background: 'linear-gradient(135deg, #0070f3, #00d4ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-2px',
        }}>
          {participants.toLocaleString()}
        </div>
        <div style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
          Albertans currently participating
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#555' }}>Goal: {GOAL_MW} MW</span>
          <span style={{ fontSize: '13px', color: '#00c853', fontWeight: '600', fontFamily: "'SF Mono', monospace" }}>
            {savedMW} MW saved
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: '#1a1a1a',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #0070f3, #00d4ff)',
            borderRadius: '4px',
            transition: 'width 1s ease',
          }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#555', marginTop: '4px' }}>
          {Math.round(progress)}% of goal
        </div>
      </div>

      {/* Your contribution */}
      <div style={{
        background: '#111',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#00c853' }}>
            You&apos;re saving 2.3 kW right now
          </div>
          <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>
            Top 15% of participants
          </div>
        </div>
        <div style={{
          padding: '4px 12px',
          background: 'rgba(0, 200, 83, 0.08)',
          border: '1px solid rgba(0, 200, 83, 0.2)',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#00c853',
        }}>
          Active
        </div>
      </div>

      {/* Impact metrics grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
      }}>
        {metrics.map(({ label, value, desc, icon }) => (
          <div key={label} style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#ededed',
              fontFamily: "'SF Mono', monospace",
              marginBottom: '2px',
            }}>
              {value}
            </div>
            <div style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>{label}</div>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}