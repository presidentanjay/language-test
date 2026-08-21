import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class FixUserIdType extends BaseCommand {
  static commandName = 'fix:userid'
  static description = 'Fix user_id type in enrolls table'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const db = await import('@adonisjs/lucid/services/db')
    await db.default.rawQuery('ALTER TABLE enrolls MODIFY user_id BIGINT UNSIGNED;')
    this.logger.success('Altered table successfully')
  }
}
