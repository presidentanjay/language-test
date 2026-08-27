import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrolls'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('user_id')
      table.string('exam_code')
      table.enum('for', ['ept', 'toeic'])
      table.string('date')
      table.string('time')
      table.enum('status', ['enrolled', 'working', 'finish', 'kick', 'out', 'closed', 'good'])
      table.enum('expired', ['yes', 'no'])
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
