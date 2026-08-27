import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import BankAnswer from './bank_answer.js'
import BankPackage from './bank_package.js'

export default class QuestionBank extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare bankPackageId: number

  @column()
  declare questionText: string

  @column()
  declare direction: string | null

  @column()
  declare audio: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => BankAnswer)
  declare answers: HasMany<typeof BankAnswer>

  @belongsTo(() => BankPackage)
  declare package: BelongsTo<typeof BankPackage>
}
