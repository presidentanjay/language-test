import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('exam_code').nullable()
      table.integer('amount').unsigned().defaultTo(0)
      table.string('snap_token').nullable()
      table.string('payment_type').nullable()
      table.string('transaction_id').nullable()
      table.string('description').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('exam_code')
      table.dropColumn('amount')
      table.dropColumn('snap_token')
      table.dropColumn('payment_type')
      table.dropColumn('transaction_id')
      table.dropColumn('description')
    })
  }
}
