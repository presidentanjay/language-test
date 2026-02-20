import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ScoreMapping extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare category: 'ept' | 'toeic'

  @column()
  declare sectionType: string

  @column()
  declare rawScore: number

  @column()
  declare scaledScore: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}