import "@/styles/globals.css";
import Navbar from '../components/Navbar'

/*
 * _app.js — The root wrapper for every page in the app
 * 
 * HOW NEXT.JS PAGES ROUTER WORKS:
 * Every page component (index.js, predictions.js, etc.) gets wrapped by this component.
 * The <Component> prop is the actual page content, and {pageProps} are any props passed to it.
 * 
 * We add <Navbar /> here so it appears on EVERY page without duplicating it.
 * When you navigate between pages, the Navbar stays in place and only the
 * <Component> part re-renders — this is why navigation feels instant.
 */
export default function App({ Component, pageProps }) {
  return (
    <div style={{
      background: '#000',
      minHeight: '100vh',
      color: '#ededed',
      fontFamily: "'Inter', sans-serif",
    }}>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}
