import '../styles/globals.css'
import { useRouter } from 'next/router'
import OperatorNav from '../components/OperatorNav'
import ConsumerNav from '../components/ConsumerNav'

/*
 * _app.js — The layout switcher
 * 
 * HOW IT WORKS:
 * Detects the current URL path using Next.js router.
 * If the path starts with /operator → renders the AESO operator layout (sidebar)
 * Otherwise → renders the consumer layout (bottom tabs)
 * 
 * This means the same Next.js app serves BOTH interfaces.
 * The only difference is the URL you visit.
 */

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const isOperator = router.pathname.startsWith('/operator')

  // ─── OPERATOR LAYOUT: sidebar + dark bg ───
  if (isOperator) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#000',
        fontFamily: "'Inter', sans-serif",
        color: '#ededed',
      }}>
        <OperatorNav />
        <main style={{
          flex: 1,
          overflow: 'auto',
          minHeight: '100vh',
        }}>
          <Component {...pageProps} />
        </main>
      </div>
    )
  }

  // ─── CONSUMER LAYOUT: bottom tabs + dark bg (Phase 3 will brighten) ───
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      fontFamily: "'Inter', sans-serif",
      color: '#ededed',
      paddingBottom: '80px',  /* space for bottom tab bar */
    }}>
      <Component {...pageProps} />
      <ConsumerNav />
    </div>
  )
}

export default MyApp
