import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { workoutSessions, setLogs, exercises } from '@/lib/schema'
import { desc, eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, dayType, sets } = body

    if (!date || !dayType || !sets) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert workout session (unit is kept as 'lbs' for backward compatibility)
    const [session] = await db
      .insert(workoutSessions)
      .values({
        date,
        dayType,
        unit: 'lbs', // Default, actual units are per-set now
      })
      .returning()

    // Insert all set logs
    if (sets.length > 0) {
      const setLogsToInsert = sets.map((set: any) => ({
        sessionId: session.id,
        exerciseId: set.exerciseId,
        setNumber: set.setNumber,
        weight: set.skipped ? null : set.weight,
        reps: set.skipped ? null : set.reps,
        skipped: set.skipped,
        side: set.side || null,
        unit: set.unit || 'lbs', // Per-set unit
      }))

      await db.insert(setLogs).values(setLogsToInsert)
    }

    return NextResponse.json({ success: true, sessionId: session.id })
  } catch (error) {
    console.error('Error saving workout:', error)
    return NextResponse.json(
      { error: 'Failed to save workout' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')

    const sessions = await db
      .select()
      .from(workoutSessions)
      .orderBy(desc(workoutSessions.date), desc(workoutSessions.createdAt))
      .limit(limit)

    // For each session, get the set logs with exercise info
    const sessionsWithLogs = await Promise.all(
      sessions.map(async (session) => {
        const logs = await db
          .select({
            setLog: setLogs,
            exercise: exercises,
          })
          .from(setLogs)
          .innerJoin(exercises, eq(setLogs.exerciseId, exercises.id))
          .where(eq(setLogs.sessionId, session.id))

        return {
          ...session,
          sets: logs,
        }
      })
    )

    return NextResponse.json(sessionsWithLogs)
  } catch (error) {
    console.error('Error fetching workouts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      )
    }

    // Delete the session (cascade will delete all set logs)
    await db
      .delete(workoutSessions)
      .where(eq(workoutSessions.id, parseInt(sessionId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting workout:', error)
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    )
  }
}
