import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exams'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('code')
      table.enum('category', ['ept', 'toeic'])
      table.string('title')
      table.string('first_date').nullable()
      table.string('second_date').nullable()
      table.string('third_date').nullable()
      table.string('fourth_date').nullable()
      table.string('first_time').nullable()
      table.string('second_time').nullable()
      table.string('third_time').nullable()
      table.string('fourth_time').nullable()
      table.text('conference_link').nullable()
      table.enum('activated', ['yes', 'no']).defaultTo('no')
      table.enum('status', ['publish', 'progress']).defaultTo('progress')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}