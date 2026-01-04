import { db } from './db'
import { exercises } from './schema'
import { WORKOUT_EXERCISES } from './exercises'

async function seed() {
  console.log('Seeding database...')

  try {
    // Insert all exercises
    await db.insert(exercises).values(WORKOUT_EXERCISES)
    console.log(`✅ Seeded ${WORKOUT_EXERCISES.length} exercises`)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }

  console.log('✅ Database seeded successfully!')
}

seed()
  .catch((error) => {
    console.error('Fatal error during seeding:', error)
    process.exit(1)
  })
