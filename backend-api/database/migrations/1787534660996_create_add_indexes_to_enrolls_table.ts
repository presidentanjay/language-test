import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrolls'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['exam_code'])
      table.index(['status'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['exam_code'])
      table.dropIndex(['status'])
    })
  }
}