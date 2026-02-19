import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bank_answers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('question_bank_id').unsigned().references('id').inTable('question_banks').onDelete('CASCADE')
      table.text('answer_text').notNullable()
      table.enum('is_correct', ['yes', 'no']).defaultTo('no')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}