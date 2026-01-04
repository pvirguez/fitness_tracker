'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface ProgressChartProps {
  data: Array<{
    date: string
    maxWeight: number
    totalVolume: number
    unit: string
  }>
  exerciseName: string
}

export default function ProgressChart({ data, exerciseName }: ProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 text-center text-gray-500">
        No workout data yet for this exercise
      </div>
    )
  }

  const unit = data[0]?.unit || 'lbs'

  // Format date for display
  const chartData = data.map((d) => ({
    ...d,
    dateFormatted: new Date(d.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">{exerciseName}</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="dateFormatted"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              label={{ value: `Weight (${unit})`, angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
              }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Legend wrapperStyle={{ color: '#9ca3af' }} />
            <Line
              type="monotone"
              dataKey="maxWeight"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
              name={`Max Weight (${unit})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {Math.max(...data.map((d) => d.maxWeight))}
          </div>
          <div className="text-xs text-gray-400 mt-1">Peak Weight ({unit})</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">
            {Math.round(
              data.reduce((sum, d) => sum + d.totalVolume, 0) / data.length
            ).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">Avg Volume</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">{data.length}</div>
          <div className="text-xs text-gray-400 mt-1">Sessions</div>
        </div>
      </div>
    </div>
  )
}
