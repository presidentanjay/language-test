import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import Exam from '#models/exam'
import Enroll from '#models/enroll'
import NotificationsController from '#controllers/notifications_controller'
import { DateTime } from 'luxon'

export default class SendReminders extends BaseCommand {
  static commandName = 'send:reminders'
  static description = 'Send exam reminders to enrolled participants (H-1)'
  static options: CommandOptions = { startApp: true }

  async run() {
    this.logger.info('Checking for exams scheduled tomorrow...')

    const tomorrow = DateTime.now().plus({ days: 1 }).toFormat('yyyy-MM-dd')
    const exams = await Exam.query().where('activated', 'yes')

    let totalSent = 0

    for (const exam of exams) {
      if (!exam.schedules || exam.schedules.length === 0) continue

      // Check if any schedule is tomorrow
      const tomorrowSchedule = exam.schedules.find((s: any) => s.date === tomorrow)
      if (!tomorrowSchedule) continue

      this.logger.info(`Found exam: ${exam.title} scheduled for ${tomorrow}`)

      const enrolls = await Enroll.query()
        .where('exam_code', exam.code)
        .whereIn('status', ['enrolled', 'ready'])
        .preload('user')

      for (const enroll of enrolls) {
        await NotificationsController.sendExamReminder(
          { name: enroll.user.name, email: enroll.user.email },
          {
            title: exam.title,
            code: exam.code,
            scheduleDate: tomorrowSchedule.date,
            scheduleTime: tomorrowSchedule.time || 'TBD',
          }
        )
        totalSent++
      }
    }

    this.logger.info(`Done! Sent ${totalSent} reminder(s).`)
  }
}
