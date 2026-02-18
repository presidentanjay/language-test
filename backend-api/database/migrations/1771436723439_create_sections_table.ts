import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sections'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('exam_id').unsigned().references('id').inTable('exams').onDelete('CASCADE')
      table.string('section')
      table.string('title').nullable()
      table.text('description').nullable()
      table.string('audio').nullable()
      table.integer('duration').nullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}