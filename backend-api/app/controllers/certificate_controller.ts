import type { HttpContext } from '@adonisjs/core/http'
import Enroll from '#models/enroll'
import ScoreCalculationService from '#services/score_calculation_service'

export default class CertificateController {
  async show({ params, response }: HttpContext) {
    const enroll = await Enroll.query()
      .where('id', params.id)
      .preload('user', (u) => {
        u.preload('profile')
      })
      .preload('exam')
      .firstOrFail()

    if (enroll.status !== 'finish' && enroll.status !== 'good') {
      // 'good' might be a legacy completed status
      return response.badRequest({ message: 'Exam not finished yet' })
    }

    const sectionalScores = await ScoreCalculationService.calculate(enroll)
    const scores = {
      listening: sectionalScores.listening,
      structure: sectionalScores.structure,
      reading: sectionalScores.reading,
      overall: sectionalScores.overall,
    }

    return response.ok({
      participant: {
        name: enroll.user.name,
        email: enroll.user.email,
        npm: enroll.user.profile?.npm || '-',
        program_study: enroll.user.profile?.programStudy || '-',
        faculty: enroll.user.profile?.faculty || '-',
      },
      exam: {
        title: enroll.exam.title,
        date: enroll.date,
        category: enroll.exam.category,
      },
      scores,
    })
  }
}
