import PredictionTable from '../../components/PredictionTable'

/*
 * Operator Predictions — Full 48-hour forecast with alert controls
 * PredictionTable component is reused. Alert threshold config is
 * mock UI for now (Phase 2 will add real Supabase logic).
 */

export default function OperatorPredictions() {
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
          48-Hour Forecast
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#555',
          margin: '6px 0 0',
        }}>
          Prophet ML predictions — updated hourly
        </p>
      </div>

      {/* Alert threshold config */}
      <div style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '10px',
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{ fontSize: '13px', color: '#ededed', fontWeight: '600' }}>
            Alert Thresholds
          </div>
          <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
            Auto-trigger consumer alerts when thresholds are exceeded
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255, 149, 0, 0.08)',
            border: '1px solid rgba(255, 149, 0, 0.15)',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '12px',
          }}>
            <span style={{ color: '#ff9500' }}>Warning</span>
            <span style={{ color: '#ff9500', fontFamily: "'SF Mono', monospace", fontWeight: '600' }}>
              &gt; 90%
            </span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255, 59, 48, 0.08)',
            border: '1px solid rgba(255, 59, 48, 0.15)',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '12px',
          }}>
            <span style={{ color: '#ff3b30' }}>Critical</span>
            <span style={{ color: '#ff3b30', fontFamily: "'SF Mono', monospace", fontWeight: '600' }}>
              &gt; 96%
            </span>
          </div>
        </div>
      </div>

      {/* Prediction table */}
      <PredictionTable />
    </div>
  )
}
