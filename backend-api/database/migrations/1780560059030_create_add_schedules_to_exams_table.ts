import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exams'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('first_date')
      table.dropColumn('first_time')
      table.dropColumn('second_date')
      table.dropColumn('second_time')
      table.dropColumn('third_date')
      table.dropColumn('third_time')
      table.dropColumn('fourth_date')
      table.dropColumn('fourth_time')
      
      table.json('schedules').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('schedules')
      
      table.string('first_date').nullable()
      table.string('first_time').nullable()
      table.string('second_date').nullable()
      table.string('second_time').nullable()
      table.string('third_date').nullable()
      table.string('third_time').nullable()
      table.string('fourth_date').nullable()
      table.string('fourth_time').nullable()
    })
  }
}