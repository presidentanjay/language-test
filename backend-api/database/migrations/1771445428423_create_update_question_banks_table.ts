import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'question_banks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('category')
      table.dropColumn('package_name')
      table.dropColumn('duration')
      table.integer('bank_package_id').unsigned().references('id').inTable('bank_packages').onDelete('CASCADE').after('id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('bank_package_id')
      table.dropColumn('bank_package_id')
      table.enum('category', ['listening', 'structure', 'reading']).notNullable()
      table.string('package_name').notNullable()
      table.integer('duration').nullable()
    })
  }
}