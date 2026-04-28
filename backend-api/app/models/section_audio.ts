import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Section from './section.js'

export default class SectionAudio extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sectionId: number

  @column()
  declare audioUrl: string

  @column()
  declare fromQuestion: number

  @column()
  declare toQuestion: number

  @column()
  declare ordering: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Section)
  declare section: BelongsTo<typeof Section>
}
