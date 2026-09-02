import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrolls'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('certificate_number').nullable().unique()
      table.string('certificate_token').nullable().unique()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('certificate_number')
      table.dropColumn('certificate_token')
    })
  }
}
