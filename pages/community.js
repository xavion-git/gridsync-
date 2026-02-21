import CollectiveImpact from '../components/CollectiveImpact'

/*
 * Community Page — Collective impact and participation
 * 
 * Shows how the community is working together to reduce grid load.
 * This is where the Leaderboard component will also go in Phase 3.
 * 
 * WHY A SEPARATE PAGE:
 * Community engagement is a core differentiator (context.md says this
 * is what turns GridSync from "another prediction app" into a
 * "community-powered solution"). It deserves its own dedicated space.
 */
export default function CommunityPage() {
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
          Community
        </h1>
        <p style={{ fontSize: '14px', color: '#555', margin: 0 }}>
          Real-time coordinated demand reduction across Alberta
        </p>
      </div>

      <CollectiveImpact />
      
      {/* Leaderboard will go here in Phase 3 */}
    </main>
  )
}
