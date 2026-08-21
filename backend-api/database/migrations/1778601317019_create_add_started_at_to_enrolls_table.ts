import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrolls'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('started_at', { useTz: true }).nullable().after('time')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('started_at')
    })
  }
}