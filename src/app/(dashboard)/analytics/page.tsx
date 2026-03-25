import { BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Analytics</h1>
      <p className="mb-8 text-sm text-gray-500">Feedback analytics and insights</p>
      <div className="rounded-lg bg-white p-12 text-center">
        <BarChart3 className="mx-auto mb-3 h-8 w-8 text-gray-400" />
        <p className="text-gray-500">Analytics dashboards coming in Phase 6.</p>
        <p className="mt-1 text-sm text-gray-400">
          Skill radar charts, team heatmaps, and feedback health metrics.
        </p>
      </div>
    </div>
  )
}
