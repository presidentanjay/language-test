import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Section from './section.js'

export default class Exam extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare category: 'ept' | 'toeic'

  @column()
  declare title: string

  @column()
  declare firstDate: string | null

  @column()
  declare secondDate: string | null

  @column()
  declare thirdDate: string | null

  @column()
  declare fourthDate: string | null

  @column()
  declare firstTime: string | null

  @column()
  declare secondTime: string | null

  @column()
  declare thirdTime: string | null

  @column()
  declare fourthTime: string | null

  @column()
  declare conferenceLink: string | null

  @column()
  declare activated: 'yes' | 'no'

  @column()
  declare status: 'publish' | 'progress'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Section)
  declare sections: HasMany<typeof Section>

}