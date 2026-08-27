import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Enroll from './enroll.js'
import Question from './question.js'
import Answer from './answer.js'

export default class Submission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare enrollId: number

  @column()
  declare questionId: number

  @column()
  declare answerId: number

  @column()
  declare isCorrect: 'yes' | 'no'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Enroll)
  declare enroll: BelongsTo<typeof Enroll>

  @belongsTo(() => Question)
  declare question: BelongsTo<typeof Question>

  @belongsTo(() => Answer)
  declare answer: BelongsTo<typeof Answer>
}
