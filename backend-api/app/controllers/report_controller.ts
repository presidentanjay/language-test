import type { HttpContext } from '@adonisjs/core/http'
import Enroll from '#models/enroll'

export default class ReportController {
    async getParticipantScores({ response }: HttpContext) {
        const enrolls = await Enroll.query()
            .whereIn('status', ['finish', 'good', 'working', 'enrolled'])
            .preload('user')
            .preload('exam')
            .orderBy('created_at', 'desc')

        return response.ok(enrolls)
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
