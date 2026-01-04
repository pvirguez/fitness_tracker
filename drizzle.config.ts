import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: process.env.TURSO_DATABASE_URL
    ? {
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        url: 'file:local.db',
      },
} satisfies Config
