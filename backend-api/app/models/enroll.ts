import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Submission from './submission.js'

export default class Enroll extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: string

  @column()
  declare examCode: string

  @column()
  declare for: 'ept' | 'toeic'

  @column()
  declare date: string

  @column()
  declare time: string

  @column()
  declare status: 'enrolled' | 'working' | 'finish' | 'kick' | 'out' | 'closed' | 'good'

  @column()
  declare expired: 'yes' | 'no'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Submission)
  declare submissions: HasMany<typeof Submission>
}