import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('user_id')
      table.string('order_id')
      table.string('for')
      table.enum('status_pay', ['capture', 'settlement', 'pending', 'deny', 'cancel', 'expire', 'refund', 'partial_refund', 'authorize'])
      table.string('used')
      table.string('deleted')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}