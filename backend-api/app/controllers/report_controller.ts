import type { HttpContext } from '@adonisjs/core/http'
import Enroll from '#models/enroll'
import User from '#models/user'
import ScoreCalculationService from '#services/score_calculation_service'

export default class ReportController {
    async getParticipantScores({ request, response }: HttpContext) {
        const page = request.input('page', 1)
        const limit = request.input('limit', 50)
        
        const enrolls = await Enroll.query()
            .whereIn('status', ['finish', 'good'])
            .preload('exam')
            .preload('user', (u) => u.preload('profile'))
            .orderBy('created_at', 'desc')
            .paginate(page, limit)

        return response.ok(enrolls)
    }

    // Helper for internal recalculation
    async recalculateScoreInternal(enroll: Enroll) {
        const sectionalScores = await ScoreCalculationService.calculate(enroll)
        enroll.score = sectionalScores.overall
        await enroll.save()
    }

    async recalculateScore({ params, response }: HttpContext) {
        const enroll = await Enroll.findOrFail(params.id)
        const oldScore = enroll.score

        const sectionalScores = await ScoreCalculationService.calculate(enroll)
        enroll.score = sectionalScores.overall
        await enroll.save()

        return response.ok({
            id: enroll.id,
            oldScore,
            newScore: enroll.score,
            message: 'Recalculation successful'
        })
    }
    async getMyScores({ auth, response }: HttpContext) {
        const user = auth.getUserOrFail()
        const enrolls = await Enroll.query()
            .where('userId', user.id.toString())
            .whereIn('status', ['finish', 'good'])
            .preload('exam')
            .orderBy('created_at', 'desc')

        return response.ok(enrolls)
    }
}
