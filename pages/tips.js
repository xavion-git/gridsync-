/*
 * Tips Page — Energy saving information for Albertans
 * Dark theme, informational cards grouped by category.
 * No checklist — just clean, readable tips with kW context.
 */

const tipCategories = [
  {
    icon: '🌡️',
    label: 'Heating & Cooling',
    desc: 'Your furnace is the biggest load in your home.',
    tips: [
      { text: 'Pre-heat your home to 22°C before a peak period starts', savings: '~1.5 kW' },
      { text: 'Drop thermostat to 19°C during the alert window (6–9 PM)', savings: '~2.0 kW' },
      { text: 'Close blinds to retain heat — reduces furnace cycling', savings: '~0.5 kW' },
    ],
  },
  {
    icon: '🍽️',
    label: 'Appliances',
    desc: 'Shift high-draw appliances outside peak hours.',
    tips: [
      { text: 'Delay dishwasher until after 9 PM', savings: '~1.2 kW' },
      { text: 'Delay laundry (washer + dryer) until after 9 PM', savings: '~0.9 kW' },
      { text: 'Use microwave instead of oven — 70% less energy', savings: '~1.0 kW' },
    ],
  },
  {
    icon: '🚗',
    label: 'Electric Vehicles',
    desc: 'EV charging is the single biggest thing you can shift.',
    tips: [
      { text: 'Charge before 6 PM or after 9 PM using your car\'s schedule feature', savings: '~7.2 kW' },
      { text: 'Most EV apps let you set a departure time — use it', savings: '~7.2 kW' },
    ],
  },
  {
    icon: '💡',
    label: 'Lighting & Electronics',
    desc: 'Small changes that add up across thousands of homes.',
    tips: [
      { text: 'Turn off lights in unoccupied rooms', savings: '~0.3 kW' },
      { text: 'Lower monitor brightness during evening hours', savings: '~0.1 kW' },
      { text: 'Unplug device chargers and power strips not in use', savings: '~0.2 kW' },
    ],
  },
]

export default function TipsPage() {
  return (
    <main style={{
      maxWidth: '640px',
      margin: '0 auto',
      padding: '32px 20px 80px',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: '#ededed',
          margin: '0 0 6px',
          letterSpacing: '-0.5px',
        }}>
          Energy Tips
        </h1>
        <p style={{ fontSize: '14px', color: '#555', margin: 0 }}>
          How to reduce your load during Alberta grid peaks
        </p>
      </div>

      {/* Why it matters banner */}
      <div style={{
        background: 'rgba(0, 112, 243, 0.06)',
        border: '1px solid rgba(0, 112, 243, 0.15)',
        borderRadius: '12px',
        padding: '16px 18px',
        marginBottom: '24px',
        fontSize: '13px',
        color: '#888',
        lineHeight: '1.6',
      }}>
        <span style={{ color: '#4d94ff', fontWeight: '600' }}>Why does this matter? </span>
        When 10,000 households each save 2 kW, that's 20 MW — enough to prevent a rolling blackout.
        Small actions at scale make a real difference.
      </div>

      {/* Tip categories */}
      {tipCategories.map((cat, ci) => (
        <div key={ci} style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '14px',
        }}>
          {/* Category header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}>
            <span style={{ fontSize: '22px', marginTop: '1px' }}>{cat.icon}</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#ededed' }}>
                {cat.label}
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
                {cat.desc}
              </div>
            </div>
          </div>

          {/* Tips */}
          {cat.tips.map((tip, ti) => (
            <div key={ti} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              padding: '14px 20px',
              borderBottom: ti < cat.tips.length - 1
                ? '1px solid rgba(255,255,255,0.03)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
                <span style={{
                  color: '#0070f3', fontSize: '14px', marginTop: '1px', flexShrink: 0,
                }}>›</span>
                <span style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.5' }}>
                  {tip.text}
                </span>
              </div>
              <span style={{
                fontSize: '11px',
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                color: '#00c853',
                background: 'rgba(0, 200, 83, 0.06)',
                border: '1px solid rgba(0, 200, 83, 0.15)',
                padding: '3px 8px',
                borderRadius: '5px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                {tip.savings}
              </span>
            </div>
          ))}
        </div>
      ))}
    </main>
  )
}
