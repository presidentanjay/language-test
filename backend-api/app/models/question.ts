import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Section from './section.js'
import Answer from './answer.js'

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sectionId: number

  @column()
  declare question: string

  @column()
  declare audio: string | null

  @column()
  declare direction: string | null

  @column()
  declare ordering: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Section)
  declare section: BelongsTo<typeof Section>

  @hasMany(() => Answer)
  declare answers: HasMany<typeof Answer>
}
