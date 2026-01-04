'use client'

import { useState, useEffect } from 'react'
import { Exercise } from '@/lib/schema'
import ExerciseCard from './ExerciseCard'

interface SetData {
  setNumber: number
  weight: number | null
  reps: number | null
  skipped: boolean
  side?: string | null
}

interface ExerciseData {
  exercise: Exercise
  sets: SetData[]
  lastSets: Array<{ weight: number; reps: number }>
  unit: 'lbs' | 'kg'
}

export default function WorkoutLogger() {
  const [dayType, setDayType] = useState<'A' | 'B'>('A')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [exercises, setExercises] = useState<ExerciseData[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Load exercises when day or date changes
  useEffect(() => {
    loadExercises()
  }, [dayType, date])

  const loadExercises = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/exercises?day=${dayType}`)
      const exerciseList: Exercise[] = await response.json()

      // Initialize set data for each exercise
      const exerciseData: ExerciseData[] = await Promise.all(
        exerciseList.map(async (exercise) => {
          // Fetch last sets for this exercise
          const lastSetsResponse = await fetch(
            `/api/workouts/last-sets?exerciseId=${exercise.id}&beforeDate=${date}`
          )
          const lastSetsData = await lastSetsResponse.json()
          const lastSets = lastSetsData.sets || []
          const lastUnit = lastSetsData.unit || 'lbs'

          // Initialize sets with last workout data if available
          const sets: SetData[] = Array.from({ length: exercise.sets }, (_, i) => {
            const lastSet = lastSets.find((s: any) => s.setNumber === i + 1)
            return {
              setNumber: i + 1,
              weight: lastSet?.weight ?? null,
              reps: lastSet?.reps ?? null,
              skipped: false,
              side: exercise.isUnilateral ? 'both' : null,
            }
          })

          // Format last sets for display
          const lastSetsFormatted = lastSets.map((s: any) => ({
            weight: s.weight,
            reps: s.reps,
          }))

          return {
            exercise,
            sets,
            lastSets: lastSetsFormatted,
            unit: lastUnit,
          }
        })
      )

      setExercises(exerciseData)
    } catch (error) {
      console.error('Error loading exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetChange = (
    exerciseId: number,
    setIndex: number,
    field: 'weight' | 'reps',
    value: number | null
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.exercise.id === exerciseId) {
          const newSets = [...ex.sets]
          newSets[setIndex] = {
            ...newSets[setIndex],
            [field]: value,
          }
          return { ...ex, sets: newSets }
        }
        return ex
      })
    )
  }

  const handleSkipToggle = (exerciseId: number, setIndex: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.exercise.id === exerciseId) {
          const newSets = [...ex.sets]
          newSets[setIndex] = {
            ...newSets[setIndex],
            skipped: !newSets[setIndex].skipped,
          }
          return { ...ex, sets: newSets }
        }
        return ex
      })
    )
  }

  const handleUnitChange = (exerciseId: number, newUnit: 'lbs' | 'kg') => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.exercise.id === exerciseId) {
          return { ...ex, unit: newUnit }
        }
        return ex
      })
    )
  }

  const handleSaveWorkout = async () => {
    setSaving(true)
    try {
      // Flatten all sets into a single array, including per-exercise unit
      const allSets = exercises.flatMap((ex) =>
        ex.sets.map((set) => ({
          exerciseId: ex.exercise.id,
          setNumber: set.setNumber,
          weight: set.weight,
          reps: set.reps,
          skipped: set.skipped,
          side: set.side,
          unit: ex.unit, // Per-exercise unit
        }))
      )

      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          dayType,
          sets: allSets,
        }),
      })

      if (response.ok) {
        alert('Workout saved successfully! 💪')
        // Reload exercises to get fresh "last time" data
        await loadExercises()
      } else {
        alert('Failed to save workout')
      }
    } catch (error) {
      console.error('Error saving workout:', error)
      alert('Error saving workout')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-400">Loading workout...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {/* Header with Menu */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">PV Gym Tracker</h1>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all active:scale-95"
                aria-label="Menu"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                  <a
                    href="/history"
                    className="block px-4 py-4 text-white hover:bg-gray-700 transition-all font-medium text-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    View History & Progress
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Day Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setDayType('A')}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all active:scale-95 ${
                dayType === 'A'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Day A
            </button>
            <button
              onClick={() => setDayType('B')}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all active:scale-95 ${
                dayType === 'B'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Day B
            </button>
          </div>

          {/* Date Picker */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </div>

      {/* Exercise List */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {exercises.map((exerciseData) => (
          <ExerciseCard
            key={exerciseData.exercise.id}
            exercise={exerciseData.exercise}
            sets={exerciseData.sets}
            unit={exerciseData.unit}
            lastSets={exerciseData.lastSets}
            onSetChange={handleSetChange}
            onSkipToggle={handleSkipToggle}
            onUnitChange={handleUnitChange}
          />
        ))}

        {/* Save Button */}
        <button
          onClick={handleSaveWorkout}
          disabled={saving}
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Workout 💪'}
        </button>
      </div>
    </div>
  )
}
