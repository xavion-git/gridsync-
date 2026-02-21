import GridStatus from '../../components/GridStatus'

/*
 * Operator Dashboard — Main command center for AESO operators
 * Shows real-time grid status + quick operational metrics.
 * GridStatus component is reused from the consumer side (same data, different context).
 */

export default function OperatorDashboard() {
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
          Grid Overview
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#555',
          margin: '6px 0 0',
        }}>
          Real-time Alberta grid status and demand forecast
        </p>
      </div>

      {/* Quick stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '28px',
      }}>
        {[
          { label: 'Active Users', value: '12,847', change: '+3.2%', up: true },
          { label: 'MW Saved Today', value: '16.5', change: '+1.8 MW', up: true },
          { label: 'Alerts Sent', value: '3', change: 'Last 24h', up: null },
          { label: 'Model Accuracy', value: '94.3%', change: '30-day avg', up: null },
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px',
            padding: '20px',
          }}>
            <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              {stat.label}
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              color: '#ededed',
              letterSpacing: '-1px',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '11px',
              marginTop: '6px',
              color: stat.up === true ? '#00c853' : stat.up === false ? '#ff3b30' : '#444',
            }}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Grid Status — the main chart panel */}
      <GridStatus />
    </div>
  )
}
