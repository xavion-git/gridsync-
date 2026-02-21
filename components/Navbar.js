import Link from 'next/link'
import { useRouter } from 'next/router'

/*
 * Navbar — Persistent navigation across all pages
 * 
 * HOW IT WORKS:
 * - Sits at the top of every page (rendered in _app.js)
 * - Uses Next.js <Link> for instant client-side navigation (no full page reload)
 * - useRouter() detects which page we're on to highlight the active link
 * 
 * WHY CLIENT-SIDE NAV:
 * Next.js Pages Router pre-fetches linked pages in the background.
 * When a user clicks "Predictions", the page loads instantly because
 * the JS bundle was already downloaded. This feels like a native app.
 */

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard' },
  { href: '/predictions', label: 'Predictions' },
  { href: '/community', label: 'Community' },
  { href: '/tips', label: 'Tips' },
]

export default function Navbar() {
  const router = useRouter()

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
        }}>
          <span style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#ededed',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '-0.5px',
          }}>
            GridSync
          </span>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            background: 'rgba(0, 112, 243, 0.1)',
            border: '1px solid rgba(0, 112, 243, 0.2)',
            borderRadius: '4px',
            color: '#0070f3',
            fontWeight: '500',
            fontFamily: "'Inter', sans-serif",
          }}>
            BETA
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = router.pathname === href
            return (
              <Link key={href} href={href} style={{
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: "'Inter', sans-serif",
                color: isActive ? '#ededed' : '#888',
                background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                textDecoration: 'none',
                transition: 'color 0.15s, background 0.15s',
              }}>
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
