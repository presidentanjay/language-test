import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: string

  @column()
  declare orderId: string

  @column()
  declare for: string

  @column()
  declare statusPay:
    | 'capture'
    | 'settlement'
    | 'pending'
    | 'deny'
    | 'cancel'
    | 'expire'
    | 'refund'
    | 'partial_refund'
    | 'authorize'

  @column()
  declare used: string

  @column()
  declare deleted: string

  @column()
  declare examCode: string | null

  @column()
  declare amount: number

  @column()
  declare snapToken: string | null

  @column()
  declare paymentType: string | null

  @column()
  declare transactionId: string | null

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
