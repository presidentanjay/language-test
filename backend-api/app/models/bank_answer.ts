import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import QuestionBank from './question_bank.js'

export default class BankAnswer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare questionBankId: number

  @column()
  declare answerText: string

  @column()
  declare isCorrect: 'yes' | 'no'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => QuestionBank)
  declare questionBank: BelongsTo<typeof QuestionBank>
}
