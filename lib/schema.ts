import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core'

export const exercises = sqliteTable('exercises', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  day: text('day').notNull(), // 'A' or 'B'
  order: integer('order').notNull(),
  sets: integer('sets').notNull(),
  repRangeMin: integer('rep_range_min').notNull(),
  repRangeMax: integer('rep_range_max').notNull(),
  isUnilateral: integer('is_unilateral', { mode: 'boolean' }).notNull().default(false),
  notes: text('notes'), // e.g., "per leg", "AB FINISHER"
})

export const workoutSessions = sqliteTable('workout_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(), // ISO date string YYYY-MM-DD
  dayType: text('day_type').notNull(), // 'A' or 'B'
  unit: text('unit').notNull().default('lbs'), // 'lbs' or 'kg'
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const setLogs = sqliteTable('set_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: integer('session_id').notNull().references(() => workoutSessions.id, { onDelete: 'cascade' }),
  exerciseId: integer('exercise_id').notNull().references(() => exercises.id),
  setNumber: integer('set_number').notNull(),
  weight: real('weight'), // null if skipped
  reps: integer('reps'), // null if skipped
  skipped: integer('skipped', { mode: 'boolean' }).notNull().default(false),
  side: text('side'), // 'left' or 'right' for unilateral exercises, null otherwise
  unit: text('unit').notNull().default('lbs'), // 'lbs' or 'kg' - per exercise
})

export type Exercise = typeof exercises.$inferSelect
export type WorkoutSession = typeof workoutSessions.$inferSelect
export type SetLog = typeof setLogs.$inferSelect

export type NewExercise = typeof exercises.$inferInsert
export type NewWorkoutSession = typeof workoutSessions.$inferInsert
export type NewSetLog = typeof setLogs.$inferInsert
