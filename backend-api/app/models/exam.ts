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

  @column({
    prepare: (value: any) => (value ? JSON.stringify(value) : null),
    consume: (value: any) => {
      if (!value) return null
      return typeof value === 'string' ? JSON.parse(value) : value
    },
  })
  declare schedules: { date: string; time: string }[] | null

  @column()
  declare conferenceLink: string | null

  @column()
  declare activated: 'yes' | 'no'

  @column()
  declare status: 'publish' | 'progress'

  @column()
  declare price: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Section)
  declare sections: HasMany<typeof Section>
}
