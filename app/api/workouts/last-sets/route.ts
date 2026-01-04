import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { workoutSessions, setLogs } from '@/lib/schema'
import { desc, eq, and, lt } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const exerciseId = searchParams.get('exerciseId')
    const beforeDate = searchParams.get('beforeDate') // ISO date string

    if (!exerciseId) {
      return NextResponse.json(
        { error: 'exerciseId is required' },
        { status: 400 }
      )
    }

    // Find the most recent session that includes this exercise
    const recentSessions = await db
      .select({
        sessionId: workoutSessions.id,
        date: workoutSessions.date,
      })
      .from(workoutSessions)
      .innerJoin(setLogs, eq(setLogs.sessionId, workoutSessions.id))
      .where(
        and(
          eq(setLogs.exerciseId, parseInt(exerciseId)),
          beforeDate ? lt(workoutSessions.date, beforeDate) : undefined
        )
      )
      .orderBy(desc(workoutSessions.date))
      .limit(1)

    if (recentSessions.length === 0) {
      return NextResponse.json({ sets: [], unit: 'lbs' })
    }

    const lastSession = recentSessions[0]

    // Get all sets for this exercise from that session
    const lastSets = await db
      .select()
      .from(setLogs)
      .where(
        and(
          eq(setLogs.sessionId, lastSession.sessionId),
          eq(setLogs.exerciseId, parseInt(exerciseId))
        )
      )

    // Get unit from the first set (all sets for same exercise should have same unit)
    const unit = lastSets.length > 0 ? lastSets[0].unit : 'lbs'

    return NextResponse.json({
      sets: lastSets,
      date: lastSession.date,
      unit: unit,
    })
  } catch (error) {
    console.error('Error fetching last sets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch last sets' },
      { status: 500 }
    )
  }
}
