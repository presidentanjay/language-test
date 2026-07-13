import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('face_photo').nullable().after('program_study')
      table.string('ktm_photo').nullable().after('face_photo')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('face_photo')
      table.dropColumn('ktm_photo')
    })
  }
}
