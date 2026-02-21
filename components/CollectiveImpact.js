import { useState, useEffect } from 'react'

const GOAL_MW = 50

export default function CollectiveImpact() {
  const [participants, setParticipants] = useState(11240)
  const [savedMW, setSavedMW] = useState(32.4)

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants(p => p + Math.floor(Math.random() * 3))
      setSavedMW(s => Math.min(GOAL_MW, +(s + Math.random() * 0.2).toFixed(1)))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const progress = Math.min((savedMW / GOAL_MW) * 100, 100)
  const moneySaved = Math.round(savedMW * 3 * 1000)
  const co2Avoided = Math.round(savedMW * 3 * 0.5)
  const homesPowered = Math.round(savedMW * 500)

  return (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-6">⚡ Community Grid Defense</h2>

      {/* Participant counter */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-blue-400">
          {participants.toLocaleString()}
        </div>
        <div className="text-slate-400 mt-1">Albertans currently participating</div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Goal: {GOAL_MW} MW</span>
          <span className="text-green-400 font-bold">{savedMW} MW saved</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-6 relative">
          <div
            className="h-6 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 flex items-center justify-end pr-2"
            style={{ width: `${progress}%` }}
          >
            <span className="text-xs font-bold text-white">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Your contribution */}
      <div className="bg-slate-700 rounded-xl p-4 mb-6">
        <div className="text-green-400 font-bold text-lg">You're saving 2.3 kW right now</div>
        <div className="text-slate-400 text-sm">You're in the top 15% of participants!</div>
      </div>

      {/* Impact grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Money Saved',    value: `$${moneySaved.toLocaleString()}`, icon: '💰' },
          { label: 'CO₂ Avoided',   value: `${co2Avoided} tons`,              icon: '🌱' },
          { label: 'Homes Powered', value: homesPowered.toLocaleString(),      icon: '🏠' },
          { label: 'Blackout Risk', value: `${Math.round(progress * 0.4)}% ↓`, icon: '🛡️' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-slate-700 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-xs text-slate-400">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}