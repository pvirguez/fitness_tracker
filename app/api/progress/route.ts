import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { workoutSessions, setLogs, exercises } from '@/lib/schema'
import { eq, desc, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const exerciseId = searchParams.get('exerciseId')

    if (!exerciseId) {
      return NextResponse.json(
        { error: 'exerciseId is required' },
        { status: 400 }
      )
    }

    // Get all sessions that include this exercise, ordered by date
    const progressData = await db
      .select({
        date: workoutSessions.date,
        weight: setLogs.weight,
        reps: setLogs.reps,
        setNumber: setLogs.setNumber,
        unit: workoutSessions.unit,
      })
      .from(setLogs)
      .innerJoin(workoutSessions, eq(setLogs.sessionId, workoutSessions.id))
      .where(eq(setLogs.exerciseId, parseInt(exerciseId)))
      .orderBy(desc(workoutSessions.date))
      .limit(50) // Last 50 entries

    // Group by date and calculate max weight and total volume
    const groupedByDate = progressData.reduce((acc: any, curr) => {
      if (!curr.weight || !curr.reps) return acc

      const dateKey = curr.date
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          maxWeight: curr.weight,
          totalVolume: 0,
          unit: curr.unit,
        }
      }

      acc[dateKey].maxWeight = Math.max(acc[dateKey].maxWeight, curr.weight)
      acc[dateKey].totalVolume += curr.weight * curr.reps

      return acc
    }, {})

    const chartData = Object.values(groupedByDate).reverse() // Oldest to newest for chart

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}
