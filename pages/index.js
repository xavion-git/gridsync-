import GridStatus from '../components/GridStatus'

/*
 * Consumer Home — Simple grid status for everyday Albertans
 * Shows the GridStatus panel (live MW + predictions graph).
 * Navigation is handled by the bottom tab bar (ConsumerNav),
 * so this page focuses purely on content.
 */

export default function Home() {
  return (
    <div style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', paddingTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#ededed',
            letterSpacing: '-0.3px',
          }}>
            GridSync
          </span>
          <span style={{
            fontSize: '9px',
            padding: '2px 7px',
            background: 'rgba(0, 200, 83, 0.1)',
            color: '#00c853',
            borderRadius: '4px',
            fontWeight: '700',
            letterSpacing: '0.5px',
          }}>BETA</span>
        </div>
        <p style={{
          fontSize: '13px',
          color: '#666',
          margin: 0,
        }}>
          Helping Albertans prevent blackouts together
        </p>
      </div>

      {/* Grid Status — the main content */}
      <GridStatus />
    </div>
  )
}