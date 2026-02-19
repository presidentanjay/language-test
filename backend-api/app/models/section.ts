import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Exam from './exam.js'
import Question from './question.js'

export default class Section extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare examId: number

  @column()
  declare section: string

  @column()
  declare title: string | null

  @column()
  declare description: string | null

  @column()
  declare audio: string | null

  @column()
  declare duration: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Exam)
  declare exam: BelongsTo<typeof Exam>

  @hasMany(() => Question)
  declare questions: HasMany<typeof Question>

}