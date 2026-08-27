import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class CheckEnrolls extends BaseCommand {
  static commandName = 'check:enrolls'
  static description = 'Check enrolls with users'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const { default: Enroll } = await import('#models/enroll')
    const enrolls = await Enroll.query().preload('user').orderBy('id', 'desc').limit(5)
    for (const e of enrolls) {
      console.log(
        `Enroll ID: ${e.id}, User ID: ${e.userId}, User:`,
        e.user ? e.user.serialize() : null
      )
    }
  }
}
