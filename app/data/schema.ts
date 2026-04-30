import { column as c, table } from 'remix/data-table'
import type { TableRow } from 'remix/data-table'

export const users = table({
  name: 'users',
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    username: c.text().notNull(),
    username_lower: c.text().notNull().unique(),
    name: c.text().notNull(),
    password_hash: c.text().notNull(),
    created_at: c.integer().notNull(),
  },
})

export type User = TableRow<typeof users>
