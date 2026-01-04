'use client'

import { Exercise } from '@/lib/schema'
import SetInput from './SetInput'

interface SetData {
  setNumber: number
  weight: number | null
  reps: number | null
  skipped: boolean
  side?: string | null
}

interface LastSetData {
  weight: number
  reps: number
}

interface ExerciseCardProps {
  exercise: Exercise
  sets: SetData[]
  unit: string
  lastSets: LastSetData[]
  onSetChange: (exerciseId: number, setIndex: number, field: 'weight' | 'reps', value: number | null) => void
  onSkipToggle: (exerciseId: number, setIndex: number) => void
  onUnitChange: (exerciseId: number, unit: 'lbs' | 'kg') => void
}

export default function ExerciseCard({
  exercise,
  sets,
  unit,
  lastSets,
  onSetChange,
  onSkipToggle,
  onUnitChange,
}: ExerciseCardProps) {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800">
      {/* Exercise Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-2xl font-bold text-white flex-1 min-w-0">{exercise.name}</h3>
          {/* Unit Toggle per Exercise */}
          <div className="flex bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
            <button
              onClick={() => onUnitChange(exercise.id, 'lbs')}
              className={`px-3 py-1.5 font-bold text-sm transition-all ${
                unit === 'lbs'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              lbs
            </button>
            <button
              onClick={() => onUnitChange(exercise.id, 'kg')}
              className={`px-3 py-1.5 font-bold text-sm transition-all ${
                unit === 'kg'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              kg
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
          <span className="bg-gray-800 px-3 py-1 rounded-full">
            {exercise.sets} sets
          </span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">
            Target: {exercise.repRangeMin}
            {exercise.repRangeMax !== exercise.repRangeMin && `-${exercise.repRangeMax}`} reps
          </span>
          {exercise.notes && (
            <span className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full">
              {exercise.notes}
            </span>
          )}
        </div>
      </div>

      {/* Sets */}
      <div className="space-y-4">
        {sets.map((set, index) => (
          <SetInput
            key={index}
            setNumber={set.setNumber}
            weight={set.weight}
            reps={set.reps}
            skipped={set.skipped}
            unit={unit}
            onWeightChange={(value) => onSetChange(exercise.id, index, 'weight', value)}
            onRepsChange={(value) => onSetChange(exercise.id, index, 'reps', value)}
            onSkipToggle={() => onSkipToggle(exercise.id, index)}
            lastSetData={lastSets[index]}
          />
        ))}
      </div>
    </div>
  )
}
