import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.string('name').notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_token').nullable()

      // Custom fields
      table.string('picture').nullable()
      table.timestamp('email_verified_at').nullable()
      table.string('two_factor_secret').nullable()
      table.string('two_factor_recovery_codes').nullable()
      table.enum('role', ['admin', 'supervisor', 'test_taker', 'guest']).defaultTo('guest')

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}