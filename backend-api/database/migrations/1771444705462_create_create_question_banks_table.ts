import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'question_banks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('category', ['listening', 'structure', 'reading']).notNullable()
      table.string('package_name').notNullable() // e.g., 'Paket A'
      table.text('question_text').notNullable()
      table.string('audio').nullable()
      table.integer('duration').nullable() // Duration in minutes if needed per bank item/package

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}