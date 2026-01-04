'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProgressChart from '@/components/ProgressChart'
import { Exercise } from '@/lib/schema'

interface WorkoutSession {
  id: number
  date: string
  dayType: string
  unit: string
  createdAt: string
  sets: any[]
}

export default function HistoryPage() {
  const [view, setView] = useState<'list' | 'charts'>('list')
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [progressData, setProgressData] = useState<{ [key: number]: any[] }>({})
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<'all' | 'A' | 'B'>('all')

  useEffect(() => {
    loadHistory()
    loadAllExercises()
  }, [])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/workouts?limit=50')
      const data = await response.json()
      setSessions(data)
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWorkout = async (sessionId: number) => {
    if (!confirm('Are you sure you want to delete this workout? This cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/workouts?sessionId=${sessionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove the session from the list
        setSessions((prev) => prev.filter((s) => s.id !== sessionId))
        alert('Workout deleted successfully')
      } else {
        alert('Failed to delete workout')
      }
    } catch (error) {
      console.error('Error deleting workout:', error)
      alert('Error deleting workout')
    }
  }

  const loadAllExercises = async () => {
    try {
      const [dayAResponse, dayBResponse] = await Promise.all([
        fetch('/api/exercises?day=A'),
        fetch('/api/exercises?day=B'),
      ])
      const dayA = await dayAResponse.json()
      const dayB = await dayBResponse.json()
      const allExercises = [...dayA, ...dayB]
      setExercises(allExercises)

      // Load progress data for all exercises
      const progressPromises = allExercises.map(async (ex: Exercise) => {
        const response = await fetch(`/api/progress?exerciseId=${ex.id}`)
        const data = await response.json()
        return { id: ex.id, data }
      })

      const progressResults = await Promise.all(progressPromises)
      const progressMap = progressResults.reduce((acc, curr) => {
        acc[curr.id] = curr.data
        return acc
      }, {} as { [key: number]: any[] })

      setProgressData(progressMap)
    } catch (error) {
      console.error('Error loading exercises:', error)
    }
  }

  const filteredSessions =
    selectedDay === 'all'
      ? sessions
      : sessions.filter((s) => s.dayType === selectedDay)

  const filteredExercises =
    selectedDay === 'all'
      ? exercises
      : exercises.filter((e) => e.day === selectedDay)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-xl text-gray-400">Loading history...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Progress & History</h1>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-all active:scale-95"
            >
              ← Back
            </Link>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setView('list')}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all active:scale-95 ${
                view === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Workout List
            </button>
            <button
              onClick={() => setView('charts')}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all active:scale-95 ${
                view === 'charts'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Progress Charts
            </button>
          </div>

          {/* Day Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDay('all')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all active:scale-95 ${
                selectedDay === 'all'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedDay('A')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all active:scale-95 ${
                selectedDay === 'A'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Day A
            </button>
            <button
              onClick={() => setSelectedDay('B')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all active:scale-95 ${
                selectedDay === 'B'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Day B
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {view === 'list' ? (
          <div className="space-y-4">
            {filteredSessions.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                No workouts recorded yet. Start logging!
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-gray-900 rounded-xl p-5 border border-gray-800"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Day {session.dayType}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {new Date(session.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteWorkout(session.id)}
                      className="p-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-all active:scale-95"
                      aria-label="Delete workout"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {/* Group sets by exercise */}
                    {Object.entries(
                      session.sets.reduce((acc: any, curr: any) => {
                        const exerciseName = curr.exercise.name
                        if (!acc[exerciseName]) {
                          acc[exerciseName] = []
                        }
                        acc[exerciseName].push(curr.setLog)
                        return acc
                      }, {})
                    ).map(([exerciseName, sets]: [string, any]) => {
                      // Get unit from first set (all sets for same exercise should have same unit)
                      const exerciseUnit = sets.length > 0 ? sets[0].unit : 'lbs'
                      return (
                        <div key={exerciseName} className="bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-white">{exerciseName}</div>
                            <div className="bg-gray-900 px-2 py-0.5 rounded text-xs text-gray-400 font-medium">
                              {exerciseUnit}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {sets
                              .filter((s: any) => !s.skipped)
                              .map((set: any, idx: number) => (
                                <span
                                  key={idx}
                                  className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-sm"
                                >
                                  {set.weight}×{set.reps}
                                </span>
                              ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredExercises.map((exercise) => (
              <ProgressChart
                key={exercise.id}
                data={progressData[exercise.id] || []}
                exerciseName={exercise.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
