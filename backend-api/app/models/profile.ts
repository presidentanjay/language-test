import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare registrant: string

  @column()
  declare npm: string

  @column()
  declare faculty: string

  @column()
  declare programStudy: string

  @column({ columnName: 'face_photo' })
  declare facePhoto: string | null

  @column({ columnName: 'ktm_photo' })
  declare ktmPhoto: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

}