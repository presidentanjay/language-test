import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrolls'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('score').nullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('score')
    })
  }
}
