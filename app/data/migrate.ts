import { fileURLToPath } from 'node:url'

import { createMigrationRunner } from 'remix/data-table/migrations'
import { loadMigrations } from 'remix/data-table/migrations/node'

import { adapter } from './database.ts'

const migrationsDir = fileURLToPath(new URL('../../db/migrations', import.meta.url))

export async function migrate(): Promise<void> {
  const migrations = await loadMigrations(migrationsDir)
  const runner = createMigrationRunner(adapter, migrations)
  await runner.up()
}
