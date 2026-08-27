import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exam_snapshots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table
        .bigInteger('enroll_id')
        .unsigned()
        .references('id')
        .inTable('enrolls')
        .onDelete('CASCADE')
      table.string('photo_url').notNullable()
      table.enum('snapshot_type', ['initial', 'periodic']).notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
