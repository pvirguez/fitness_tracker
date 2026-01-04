# Gym Workout Tracker

A mobile-first personal gym workout tracker built with Next.js 14, SQLite (Turso), and Tailwind CSS. Designed for use in the gym with large touch targets, high contrast, and minimal taps required.

## Features

- **Two-Day Split Program**: Pre-configured Day A (Back, Arms, Rear Delts + Abs) and Day B (Glutes, Chest, Shoulders, Arms + Abs)
- **Smart Workout Logging**:
  - Large, tappable inputs for weight and reps
  - Quick +5/-5 buttons for weight adjustments
  - Pre-filled with last workout data
  - "Last time" reference for each exercise
  - Skip/DNF tracking for incomplete sets
- **Unit Toggle**: Switch between lbs and kg with persistent preference
- **Date Picker**: Log workouts for any date
- **Progress Tracking**:
  - Visual charts showing weight progression over time
  - Workout history with detailed set logs
  - Statistics for peak weight, average volume, and session count
- **Mobile-Optimized**:
  - Dark mode by default
  - High contrast for gym lighting
  - Large fonts and touch targets
  - Sticky header for easy navigation

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Database**: SQLite via Turso (edge database)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Turso account (free tier works great) - [Sign up here](https://turso.tech)

### Local Development

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database**:

   For local development, the app uses a local SQLite file by default (`file:local.db`).

   ```bash
   # Push schema to create tables
   npm run db:push

   # Seed with exercises
   npm run db:seed
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

### Production Deployment (Vercel + Turso)

1. **Create a Turso database**:
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash

   # Login
   turso auth login

   # Create database
   turso db create gym-tracker

   # Get database URL
   turso db show gym-tracker --url

   # Create auth token
   turso db tokens create gym-tracker
   ```

2. **Set up environment variables**:

   Create a `.env` file (or add to Vercel environment variables):
   ```env
   TURSO_DATABASE_URL=libsql://your-database.turso.io
   TURSO_AUTH_TOKEN=your-auth-token
   ```

3. **Push schema to Turso**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

   Or connect your GitHub repo to Vercel and deploy automatically.

## Project Structure

```
fitness_tracker/
├── app/
│   ├── api/              # API routes
│   │   ├── exercises/    # GET exercises by day
│   │   ├── workouts/     # POST/GET workouts
│   │   └── progress/     # GET progress data
│   ├── history/          # History & progress page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main workout logger
│   └── globals.css       # Global styles
├── components/
│   ├── ExerciseCard.tsx  # Exercise with sets
│   ├── SetInput.tsx      # Individual set input
│   ├── WorkoutLogger.tsx # Main logger component
│   └── ProgressChart.tsx # Progress visualization
├── lib/
│   ├── db.ts             # Database client
│   ├── schema.ts         # Drizzle schema
│   ├── exercises.ts      # Hardcoded workout data
│   └── seed.ts           # Seed script
└── public/
    └── manifest.json     # PWA manifest
```

## Database Schema

### `exercises`
- Exercise definitions (name, day, sets, rep ranges)
- Pre-seeded with your workout program

### `workout_sessions`
- Each workout session (date, day type, unit)

### `set_logs`
- Individual set data (weight, reps, skipped status)
- Linked to workout sessions and exercises

## Workout Program

### Day A - Back, Arms, Rear Delts + Abs
1. Chest-Supported Machine Row — 4×8-12
2. Neutral-Grip Lat Pulldown — 3×10-12
3. Single-Arm Cable Row — 3×12/side
4. Rear Delt Fly — 3×12-15
5. Straight-Arm Cable Pulldown — 3×12-15
6. Incline Dumbbell Curl — 3×10-12
7. Rope Triceps Pushdown — 3×10-12
8. Standing Calf Raise — 4×12-15
9. Hanging Leg Raises — 3×8-12

### Day B - Glutes, Chest, Shoulders, Arms + Abs
1. Bulgarian Split Squat — 4×8/leg
2. Dumbbell Step-Back Lunge — 3×10/leg
3. Seated or Lying Leg Curl — 3×10-12
4. Dumbbell Chest Press — 3×8-10
5. Seated Dumbbell Lateral Raise — 3×12-15
6. Face Pulls or Reverse Pec Deck — 3×12-15
7. Preacher Curl — 3×10-12
8. Overhead Rope Triceps Extension — 3×10-12
9. Seated Calf Raise — 4×12-15
10. Machine Crunch — 3×12-15

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:seed` - Seed database with exercises

## Future Enhancements

- [ ] Rest timer with notifications
- [ ] Offline support with service worker
- [ ] Export data to CSV/JSON
- [ ] Custom exercise editor
- [ ] Body weight tracking
- [ ] Personal records (PRs) highlighting
- [ ] Workout templates and variations

## License

MIT

---

Built with 💪 for tracking gains
