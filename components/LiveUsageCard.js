'use client'
import { useState, useEffect } from 'react'

const MAX_CAPACITY = 11700

export default function LiveUsageCard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/live-usage')
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error('Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const pct = data?.capacity_percent ?? 0
  const status = data?.status ?? 'STABLE'

  const statusColor = {
    STABLE:   'text-green-400',
    WARNING:  'text-amber-400',
    CRITICAL: 'text-red-400 animate-pulse',
  }[status]

  const barColor = pct > 98 ? 'bg-red-500' : pct > 90 ? 'bg-amber-500' : 'bg-green-500'

  if (loading) return (
    <div className="bg-slate-800 rounded-2xl p-8 animate-pulse h-64" />
  )

  return (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
      {data?.is_mock && (
        <div className="text-xs text-amber-400 mb-3">⚠️ Demo mode — cached data</div>
      )}
      <div className="text-slate-400 text-sm mb-1">Alberta Grid — Right Now</div>
      <div className={`text-6xl font-bold mb-1 ${statusColor}`}>
        {data?.usage_mw?.toLocaleString()}
        <span className="text-2xl ml-2">MW</span>
      </div>
      <div className="text-slate-400 mb-4">
        {pct}% of {MAX_CAPACITY.toLocaleString()} MW max capacity
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className={`text-lg font-bold ${statusColor}`}>
        Grid Status: {status}
      </div>
      <div className="text-slate-500 text-xs mt-3">
        Updated: {data?.last_updated
          ? new Date(data.last_updated).toLocaleTimeString()
          : '--'}
      </div>
    </div>
  )
}