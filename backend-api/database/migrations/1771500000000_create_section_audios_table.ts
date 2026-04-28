import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'section_audios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('section_id').unsigned().references('id').inTable('sections').onDelete('CASCADE')
      table.string('audio_url').notNullable()
      table.integer('from_question').notNullable()
      table.integer('to_question').notNullable()
      table.integer('ordering').defaultTo(0)
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
