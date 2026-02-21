import GridStatus from '../components/GridStatus'
import Link from 'next/link'

/*
 * Dashboard Page (index.js) — The main landing page
 * 
 * Shows the combined GridStatus component as the primary content.
 * Below it, quick links to other pages for easy exploration.
 * 
 * This is what judges see FIRST — it needs to be clean, impressive,
 * and immediately communicate what GridSync does.
 */
export default function Home() {
  return (
    <main style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px 64px',
    }}>
      {/* Page title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#ededed',
          margin: '0 0 6px',
          letterSpacing: '-1px',
        }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#555', margin: 0 }}>
          Real-time Alberta grid monitoring and ML-powered forecasting
        </p>
      </div>

      {/* Main content: GridStatus */}
      <GridStatus />

      {/* Quick navigation cards to other pages */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginTop: '24px',
      }}>
        {[
          {
            href: '/predictions',
            title: 'View Full Predictions',
            desc: '48-hour hourly breakdown with risk levels',
            icon: '📊',
          },
          {
            href: '/community',
            title: 'Community Impact',
            desc: 'See how Albertans are reducing grid load together',
            icon: '👥',
          },
          {
            href: '/tips',
            title: 'Energy Tips',
            desc: 'Actionable ways to reduce your usage during peaks',
            icon: '💡',
          },
        ].map(({ href, title, desc, icon }) => (
          <Link key={href} href={href} style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '20px 24px',
            textDecoration: 'none',
            transition: 'border-color 0.2s, background 0.2s',
            display: 'block',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.background = '#111'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.background = '#0a0a0a'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#ededed', marginBottom: '4px' }}>
              {title} →
            </div>
            <div style={{ fontSize: '13px', color: '#888' }}>{desc}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}