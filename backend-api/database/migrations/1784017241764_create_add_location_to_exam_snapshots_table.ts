import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exam_snapshots'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('latitude').nullable()
      table.string('longitude').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('latitude')
      table.dropColumn('longitude')
    })
  }
}