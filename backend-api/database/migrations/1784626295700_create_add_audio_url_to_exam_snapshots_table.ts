import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exam_snapshots'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('audio_url').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('audio_url')
    })
  }
}