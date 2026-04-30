import { createMigration } from 'remix/data-table/migrations'

import { users } from '../../app/data/schema.ts'

export default createMigration({
  async up({ schema }) {
    await schema.createTable(users)
    await schema.createIndex(users, 'username_lower', {
      name: 'users_username_lower_idx',
      unique: true,
    })
  },

  async down({ schema }) {
    await schema.dropTable('users')
  },
})
