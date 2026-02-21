/*
 * Tips Page — Smart energy reduction recommendations
 * 
 * Placeholder page — SmartRecommendations component will be built in Phase 3.
 * For now, shows a simple message.
 */
export default function TipsPage() {
  return (
    <main style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px 64px',
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#ededed',
          margin: '0 0 6px',
          letterSpacing: '-1px',
        }}>
          Energy Tips
        </h1>
        <p style={{ fontSize: '14px', color: '#555', margin: 0 }}>
          Actionable ways to reduce your usage during peak hours
        </p>
      </div>

      <div style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '48px 32px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>💡</div>
        <div style={{ fontSize: '16px', color: '#888' }}>
          Smart recommendations coming soon
        </div>
        <div style={{ fontSize: '13px', color: '#555', marginTop: '8px' }}>
          Personalized tips based on grid conditions and your usage patterns
        </div>
      </div>
    </main>
  )
}
