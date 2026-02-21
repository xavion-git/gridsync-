import LiveUsageCard from '../components/LiveUsageCard'
import PredictionTable from '../components/PredictionTable'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-blue-400">⚡ GridSync</h1>
          <p className="text-slate-400 mt-2">
            Preventing Alberta's next blackout through ML prediction & community action
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LiveUsageCard />
          <PredictionTable />
        </div>

      </div>
    </main>
  )
}