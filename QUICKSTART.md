# Quick Start Guide

## Run Locally (5 minutes)

The app is already set up with a local SQLite database. Just run these commands:

```bash
# The database is already initialized and seeded!
# Just start the dev server:
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start logging workouts!

## Deploy to Production (15 minutes)

### Step 1: Create a Turso Database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login to Turso
turso auth login

# Create your database
turso db create gym-tracker

# Get your database URL
turso db show gym-tracker --url
# Copy this URL

# Create an auth token
turso db tokens create gym-tracker
# Copy this token
```

### Step 2: Set Environment Variables in Vercel

1. Go to [vercel.com](https://vercel.com) and create a new project
2. Import your GitHub repository
3. Add these environment variables:
   - `TURSO_DATABASE_URL`: Your Turso database URL from Step 1
   - `TURSO_AUTH_TOKEN`: Your Turso auth token from Step 1

### Step 3: Initialize Production Database

```bash
# Set your Turso credentials in .env
echo "TURSO_DATABASE_URL=your-url-here" >> .env
echo "TURSO_AUTH_TOKEN=your-token-here" >> .env

# Push schema and seed exercises
npm run db:push
npm run db:seed
```

### Step 4: Deploy

```bash
# Using Vercel CLI
vercel

# Or just push to your GitHub repo and Vercel will auto-deploy
```

That's it! Your gym tracker is live.

## Tips

- **PWA**: Add the app to your home screen on mobile for a native app experience
- **Data Backup**: Export your Turso database regularly with `turso db dump gym-tracker`
- **Local Testing**: The app works offline with the local SQLite database
- **Multiple Users**: Create separate Turso databases for each user

## Customizing Your Workout

To modify exercises, edit [lib/exercises.ts](lib/exercises.ts) and run `npm run db:seed` again.
