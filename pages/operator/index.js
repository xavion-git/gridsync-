import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import GridStatus from '../../components/GridStatus'
import DemandGauge from '../../components/DemandGauge'

// Leaflet needs the browser window object — disable SSR
const AlbertaMap = dynamic(() => import('../../components/AlbertaMap'), { ssr: false })

/*
 * Operator Dashboard — Main command center for AESO operators
 * Shows real-time grid status + quick operational metrics + Alberta risk map + gauge.
 */

export default function OperatorDashboard() {
  const [accuracy, setAccuracy] = useState(null)
  const [liveStats, setLiveStats] = useState(null)

  useEffect(() => {
    fetch('/accuracy.json')
      .then(r => r.json())
      .then(d => setAccuracy(d))
      .catch(() => {})
  }, [])

  const headlineAccuracy = accuracy?.mae_mw != null
    ? (100 - (accuracy.mae_mw / 11700) * 100).toFixed(1) + '%'
    : '--'

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '24px', fontWeight: '700', color: '#ededed',
          margin: 0, letterSpacing: '-0.5px',
        }}>
          Grid Overview
        </h1>
        <p style={{ fontSize: '13px', color: '#555', margin: '6px 0 0' }}>
          Real-time Alberta grid status and demand forecast
        </p>
      </div>

      {/* Quick stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px', marginBottom: '28px',
      }}>
        {[
          { label: 'Active Users', value: '12,847', change: '+3.2%', up: true },
          { label: 'MW Saved Today', value: '16.5', change: '+1.8 MW', up: true },
          { label: 'Alerts Sent', value: '3', change: 'Last 24h', up: null },
          { label: 'Model Accuracy', value: headlineAccuracy, change: 'From accuracy.json', up: null },
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px', padding: '20px',
          }}>
            <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              {stat.label}
            </div>
            <div style={{
              fontSize: '28px', fontWeight: '700',
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              color: '#ededed', letterSpacing: '-1px',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '11px', marginTop: '6px',
              color: stat.up === true ? '#00c853' : stat.up === false ? '#ff3b30' : '#444',
            }}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Two-column layout: chart left, map + gauge right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* Grid Status chart */}
        <GridStatus onReady={(stats) => setLiveStats(stats)} />

        {/* Right column: map on top, gauge below */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Alberta risk map */}
          <div style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <AlbertaMap />
          </div>

          {/* Demand gauge — taller to match chart height */}
          <div style={{ minHeight: '320px' }}>
            <DemandGauge
              pct={liveStats?.pct ?? 0}
              status={liveStats?.status ?? 'STABLE'}
              usageMw={liveStats?.usageMw}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

