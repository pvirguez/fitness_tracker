import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { exercises } from '@/lib/schema'
import { eq, asc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const day = searchParams.get('day') // 'A' or 'B'

    if (!day || (day !== 'A' && day !== 'B')) {
      return NextResponse.json(
        { error: 'Invalid day parameter. Must be A or B.' },
        { status: 400 }
      )
    }

    const exerciseList = await db
      .select()
      .from(exercises)
      .where(eq(exercises.day, day))
      .orderBy(asc(exercises.order))

    return NextResponse.json(exerciseList)
  } catch (error) {
    console.error('Error fetching exercises:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    )
  }
}
