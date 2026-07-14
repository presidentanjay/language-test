import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Enroll from './enroll.js'

export default class ExamSnapshot extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'enroll_id' })
  declare enrollId: number

  @column({ columnName: 'photo_url' })
  declare photoUrl: string

  @column({ columnName: 'snapshot_type' })
  declare snapshotType: 'initial' | 'periodic'

  @column()
  declare latitude: string | null

  @column()
  declare longitude: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Enroll)
  declare enroll: BelongsTo<typeof Enroll>
}
