import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Submission from './submission.js'
import User from './user.js'
import Exam from './exam.js'

export default class Enroll extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'exam_code' })
  declare examCode: string

  @column()
  declare for: 'ept' | 'toeic'

  @column()
  declare date: string

  @column()
  declare time: string

  @column()
  declare score: number

  @column()
  declare status: 'enrolled' | 'working' | 'finish' | 'kick' | 'out' | 'closed' | 'good'

  @column()
  declare expired: 'yes' | 'no'
 
  @column.dateTime()
  declare startedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Submission)
  declare submissions: HasMany<typeof Submission>

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Exam, {
    foreignKey: 'examCode',
    localKey: 'code'
  })
  declare exam: BelongsTo<typeof Exam>
}