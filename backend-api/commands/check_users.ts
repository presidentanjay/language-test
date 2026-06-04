import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class CheckUsers extends BaseCommand {
  static commandName = 'check:users'
  static description = 'Check users'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const { default: User } = await import('#models/user')
    const users = await User.query().limit(10)
    for (const u of users) {
      console.log(`User ID: ${u.id}, Name: ${u.name}, Email: ${u.email}`)
    }
  }
}
