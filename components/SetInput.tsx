'use client'

interface SetInputProps {
  setNumber: number
  weight: number | null
  reps: number | null
  skipped: boolean
  unit: string
  onWeightChange: (value: number | null) => void
  onRepsChange: (value: number | null) => void
  onSkipToggle: () => void
  lastSetData?: { weight: number; reps: number } | null
}

export default function SetInput({
  setNumber,
  weight,
  reps,
  skipped,
  unit,
  onWeightChange,
  onRepsChange,
  onSkipToggle,
  lastSetData,
}: SetInputProps) {
  const adjustWeight = (delta: number) => {
    const currentWeight = weight || 0
    const newWeight = Math.max(0, currentWeight + delta)
    onWeightChange(newWeight)
  }

  return (
    <div className={`p-4 rounded-xl ${skipped ? 'bg-gray-800/50' : 'bg-gray-800'}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <h4 className="text-lg font-semibold text-gray-300">Set {setNumber}</h4>
        {lastSetData && !skipped && (
          <span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap border border-blue-800/50">
            Last: {lastSetData.weight}{unit} × {lastSetData.reps}
          </span>
        )}
      </div>

      {!skipped ? (
        <div className="space-y-3">
          {/* Weight Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Weight ({unit})
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustWeight(-5)}
                className="w-14 h-12 flex-shrink-0 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-bold active:scale-95 transition-transform"
              >
                -5
              </button>
              <input
                type="number"
                inputMode="decimal"
                value={weight ?? ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? null : parseFloat(e.target.value)
                  onWeightChange(val)
                }}
                className="flex-1 min-w-0 h-14 px-2 bg-gray-900 border border-gray-700 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
              <button
                type="button"
                onClick={() => adjustWeight(5)}
                className="w-14 h-12 flex-shrink-0 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-bold active:scale-95 transition-transform"
              >
                +5
              </button>
            </div>
          </div>

          {/* Reps Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Reps
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={reps ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : parseInt(e.target.value)
                onRepsChange(val)
              }}
              className="w-full h-14 px-4 bg-gray-900 border border-gray-700 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <button
            type="button"
            onClick={onSkipToggle}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-sm active:scale-95 transition-transform"
          >
            Skip Set
          </button>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-3">Set skipped</p>
          <button
            type="button"
            onClick={onSkipToggle}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm active:scale-95 transition-transform"
          >
            Un-skip
          </button>
        </div>
      )}
    </div>
  )
}
