import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'submissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('enroll_id').unsigned().references('id').inTable('enrolls').onDelete('CASCADE')
      table.bigInteger('question_id').unsigned().references('id').inTable('questions').onDelete('CASCADE')
      table.bigInteger('answer_id').unsigned().references('id').inTable('answers').onDelete('CASCADE')
      table.enum('is_correct', ['yes', 'no']).defaultTo('no')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}