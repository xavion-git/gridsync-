/*
 * DemandGauge — Animated SVG arc gauge showing Alberta grid load %
 *
 * Like a speedometer for the grid. Green → Amber → Red as load rises.
 * Completely self-contained SVG animation, no external libs needed.
 */

// Maps percentage (0-100) to a position on the arc path
function describeArc(cx, cy, r, startAngle, endAngle) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const x1 = cx + r * Math.cos(toRad(startAngle))
  const y1 = cy + r * Math.sin(toRad(startAngle))
  const x2 = cx + r * Math.cos(toRad(endAngle))
  const y2 = cy + r * Math.sin(toRad(endAngle))
  const large = endAngle - startAngle > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

export default function DemandGauge({ pct = 0, status = 'STABLE', usageMw, maxMw = 11700 }) {
  const START = 140   // arc start angle in degrees
  const END = 400     // arc end angle → 260° sweep
  const SWEEP = END - START

  // Filled arc goes from START → START + (pct/100 * SWEEP)
  const fillEnd = START + (Math.min(pct, 100) / 100) * SWEEP

  const color = status === 'CRITICAL'
    ? '#ff3b30'
    : status === 'WARNING'
    ? '#ff9500'
    : '#00c853'

  const glowColor = status === 'CRITICAL'
    ? 'rgba(255,59,48,0.35)'
    : status === 'WARNING'
    ? 'rgba(255,149,0,0.35)'
    : 'rgba(0,200,83,0.25)'

  const cx = 100, cy = 100, r = 72

  // Needle angle
  const needleAngle = START + (Math.min(pct, 100) / 100) * SWEEP
  const toRad = (deg) => (deg * Math.PI) / 180
  const nx = cx + r * 0.75 * Math.cos(toRad(needleAngle))
  const ny = cy + r * 0.75 * Math.sin(toRad(needleAngle))

  // Tick marks at 25%, 50%, 75%, 100%
  const ticks = [0, 25, 50, 75, 100].map(v => {
    const angle = START + (v / 100) * SWEEP
    const inner = r - 10
    const outer = r + 2
    return {
      x1: cx + inner * Math.cos(toRad(angle)),
      y1: cy + inner * Math.sin(toRad(angle)),
      x2: cx + outer * Math.cos(toRad(angle)),
      y2: cy + outer * Math.sin(toRad(angle)),
      label: v,
      lx: cx + (r + 16) * Math.cos(toRad(angle)),
      ly: cy + (r + 16) * Math.sin(toRad(angle)),
    }
  })

  return (
    <div style={{
      background: '#0a0a0a',
      border: `1px solid rgba(255,255,255,0.08)`,
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ fontSize: '11px', fontWeight: '600', color: '#444', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
        Grid Load Gauge
      </div>

      <svg viewBox="0 0 200 150" width="100%" style={{ maxWidth: '300px', display: 'block', margin: '0 auto', overflow: 'visible' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track arc */}
        <path
          d={describeArc(cx, cy, r, START, END)}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Filled arc with animation */}
        <path
          d={describeArc(cx, cy, r, START, fillEnd)}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ transition: 'all 0.8s ease' }}
        />

        {/* Tick marks */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="#333" strokeWidth="1.5"
            />
            <text
              x={t.lx} y={t.ly}
              fill="#444" fontSize="7" textAnchor="middle" dominantBaseline="middle"
            >
              {t.label}%
            </text>
          </g>
        ))}

        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={nx} y2={ny}
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ transition: 'all 0.8s ease' }}
        />
        {/* Needle pivot */}
        <circle cx={cx} cy={cy} r="4.5" fill={color} style={{ transition: 'fill 0.5s' }} />
        <circle cx={cx} cy={cy} r="2.5" fill="#000" />

        {/* Center text: percentage */}
        <text x={cx} y={cy + 26} textAnchor="middle" fill={color} fontSize="18" fontWeight="700"
          fontFamily="'SF Mono', 'Fira Code', monospace" style={{ transition: 'fill 0.5s' }}>
          {pct}%
        </text>

        {/* MW reading below */}
        {usageMw && (
          <text x={cx} y={cy + 38} textAnchor="middle" fill="#444" fontSize="7.5"
            fontFamily="'SF Mono', monospace">
            {usageMw.toLocaleString()} / {maxMw.toLocaleString()} MW
          </text>
        )}

        {/* Status label below needle */}
        <text x={cx} y={cy + 52} textAnchor="middle" fill={color} fontSize="8"
          fontWeight="700" letterSpacing="1" style={{ transition: 'fill 0.5s' }}>
          {status === 'STABLE' ? 'STABLE' : status === 'WARNING' ? 'ELEVATED' : 'CRITICAL'}
        </text>
      </svg>
    </div>
  )
}
