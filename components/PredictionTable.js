'use client'
import { useState, useEffect } from 'react'

export default function PredictionTable() {
  const [predictions, setPredictions] = useState([])

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(d => setPredictions(d.predictions?.slice(0, 24) ?? []))
  }, [])

  const riskStyle = {
    safe:     'bg-green-900 text-green-300',
    warning:  'bg-amber-900 text-amber-300',
    critical: 'bg-red-900 text-red-300 animate-pulse',
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4">48-Hour Forecast</h2>
      <div className="overflow-y-auto max-h-72">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-xs border-b border-slate-700">
              <th className="text-left pb-2">Time</th>
              <th className="text-right pb-2">MW</th>
              <th className="text-right pb-2">Cap%</th>
              <th className="text-right pb-2">Risk</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((p, i) => (
              <tr key={i} className="border-b border-slate-700/50">
                <td className="py-2 text-slate-300">
                  {new Date(p.timestamp).toLocaleString('en-CA', {
                    weekday: 'short', hour: 'numeric', hour12: true
                  })}
                </td>
                <td className="py-2 text-right text-white font-mono">
                  {p.predicted_mw.toLocaleString()}
                </td>
                <td className="py-2 text-right text-slate-400">
                  {p.capacity_pct}%
                </td>
                <td className="py-2 text-right">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${riskStyle[p.risk_level]}`}>
                    {p.risk_level.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}