import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class ResetEnroll extends BaseCommand {
  static commandName = 'reset:enroll'
  static description = 'Reset an enrollment status back to working'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string()
  declare enrollId: string

  async run() {
    const { default: Enroll } = await import('#models/enroll')
    const enroll = await Enroll.findOrFail(Number(this.enrollId))
    enroll.status = 'working'
    await enroll.save()
    this.logger.success(`Enroll #${enroll.id} status reset to: ${enroll.status}`)
  }
}
