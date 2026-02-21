import PredictionTable from '../components/PredictionTable'

/*
 * Predictions Page — Full 48-hour forecast breakdown
 * 
 * Gives the user a detailed table of every hour's predicted usage.
 * This is the "deep dive" view — the dashboard shows the overview,
 * this page shows every data point.
 */
export default function PredictionsPage() {
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
          Predictions
        </h1>
        <p style={{ fontSize: '14px', color: '#555', margin: 0 }}>
          48-hour grid usage forecast powered by Facebook Prophet ML model
        </p>
      </div>

      <PredictionTable />
    </main>
  )
}
