import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, hasOne, beforeSave } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Profile from './profile.js'

export default class User extends BaseModel {
  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare picture: string | null

  @column()
  declare role: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile> | null

  static async verifyCredentials(email: string, password: string) {
    const user = await this.findBy('email', email)
    if (!user) throw new Error('E_INVALID_CREDENTIALS')

    const isMatch = await hash.verify(user.password, password)
    if (!isMatch) throw new Error('E_INVALID_CREDENTIALS')
    return user
  }

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
