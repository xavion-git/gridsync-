import { useState, useEffect } from 'react'

/*
 * Operator Analytics — System performance and engagement metrics
 * Now reads real data from /accuracy.json (Prophet model output).
 * Engagement metrics remain mock until Phase 5 (Supabase).
 */

const impactMetrics = [
  { label: 'Total MW Saved', value: '847', unit: 'MW', desc: 'Since platform launch' },
  { label: 'Blackouts Prevented', value: '12', unit: '', desc: 'Critical events averted' },
  { label: 'Cost Savings', value: '$1.2M', unit: '', desc: 'Peak pricing avoided' },
  { label: 'CO₂ Avoided', value: '423', unit: 'tons', desc: 'Emission reduction' },
]

export default function OperatorAnalytics() {
  const [accuracy, setAccuracy] = useState(null)

  useEffect(() => {
    fetch('/accuracy.json')
      .then(r => r.json())
      .then(d => setAccuracy(d))
      .catch(() => {})
  }, [])

  // Derive headline accuracy: 100 - (MAE / MAX_CAPACITY * 100)
  const maeMW = accuracy?.mae_mw ?? null
  const headlineAccuracy = maeMW !== null ? (100 - (maeMW / 11700) * 100).toFixed(1) : '--'
  const trainedAt = accuracy?.trained_at
    ? new Date(accuracy.trained_at).toLocaleDateString('en-CA', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : '--'

  const accuracyBreakdown = [
    {
      period: 'Within ±200 MW',
      accuracy: accuracy ? `${accuracy.accuracy_200mw}%` : '--%',
      desc: 'High precision predictions',
    },
    {
      period: 'Within ±500 MW',
      accuracy: accuracy ? `${accuracy.accuracy_500mw}%` : '--%',
      desc: 'Moderate precision predictions',
    },
    {
      period: 'Mean Abs Error',
      accuracy: maeMW !== null ? `±${maeMW.toLocaleString()} MW` : '--',
      desc: 'Average prediction offset',
    },
  ]

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#ededed',
          margin: 0,
          letterSpacing: '-0.5px',
        }}>
          System Analytics
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#555',
          margin: '6px 0 0',
        }}>
          Platform performance and community engagement metrics
        </p>
      </div>

      {/* Prediction accuracy — now from real accuracy.json */}
      <div style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '10px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: '24px',
        }}>
          <div>
            <div style={{ fontSize: '14px', color: '#ededed', fontWeight: '600' }}>
              Prediction Accuracy
            </div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
              Prophet model performance vs actual AESO data
            </div>
            <div style={{ fontSize: '11px', color: '#333', marginTop: '6px' }}>
              {accuracy?.has_temperature && '🌡️ Weather data included • '}
              Trained: {trainedAt}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '36px',
              fontWeight: '700',
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              color: '#00c853',
              letterSpacing: '-2px',
              lineHeight: '1',
            }}>
              {headlineAccuracy}%
            </div>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>overall accuracy</div>
          </div>
        </div>

        {/* Accuracy breakdown */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {accuracyBreakdown.map((row, i) => (
            <div key={i} style={{
              flex: 1,
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px' }}>{row.period}</div>
              <div style={{
                fontSize: '18px', fontWeight: '700', color: '#ededed',
                fontFamily: "'SF Mono', monospace",
              }}>
                {row.accuracy}
              </div>
              <div style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>
                {row.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Note about model improvement */}
        <div style={{
          marginTop: '16px',
          padding: '10px 14px',
          background: 'rgba(0,112,243,0.05)',
          border: '1px solid rgba(0,112,243,0.12)',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.5',
        }}>
          <span style={{ color: '#4d94ff', fontWeight: '600' }}>ℹ </span>
          Model accuracy improves with more historical training data. Current model trained on
          initial AESO dataset. Re-training with 6+ months of data typically reduces MAE by 40-60%.
        </div>
      </div>

      {/* Impact metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {impactMetrics.map((metric, i) => (
          <div key={i} style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px',
            padding: '20px',
          }}>
            <div style={{
              fontSize: '11px', color: '#555',
              textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px',
            }}>
              {metric.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{
                fontSize: '28px', fontWeight: '700',
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                color: '#ededed', letterSpacing: '-1px',
              }}>
                {metric.value}
              </span>
              {metric.unit && (
                <span style={{ fontSize: '14px', color: '#555' }}>{metric.unit}</span>
              )}
            </div>
            <div style={{ fontSize: '11px', color: '#444', marginTop: '6px' }}>
              {metric.desc}
            </div>
          </div>
        ))}
      </div>

      {/* User engagement */}
      <div style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '10px',
        padding: '24px',
      }}>
        <div style={{ fontSize: '14px', color: '#ededed', fontWeight: '600', marginBottom: '20px' }}>
          Consumer Engagement
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {[
            { label: 'Registered Users', value: '23,412', trend: '+847 this week' },
            { label: 'Active (7d)', value: '12,847', trend: '54.8% of registered' },
            { label: 'Avg Participation Rate', value: '62%', trend: 'Per alert event' },
            { label: 'Avg kW Saved / User', value: '1.8', trend: 'During peak hours' },
          ].map((stat, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px' }}>{stat.label}</div>
              <div style={{
                fontSize: '22px', fontWeight: '700', color: '#ededed',
                fontFamily: "'SF Mono', monospace", letterSpacing: '-0.5px',
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>{stat.trend}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
