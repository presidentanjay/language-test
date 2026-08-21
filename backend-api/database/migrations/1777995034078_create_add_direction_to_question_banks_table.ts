import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'question_banks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('direction').nullable().after('question_text')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('direction')
    })
  }
}