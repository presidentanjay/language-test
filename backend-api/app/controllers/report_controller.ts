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

    async exportCsv({ response }: HttpContext) {
        const enrolls = await Enroll.query()
            .whereIn('status', ['finish', 'good'])
            .preload('exam')
            .preload('user')
            .orderBy('created_at', 'desc')

        let csv = 'ID,Nama Peserta,Email,Paket Ujian,Kategori,Tanggal Ujian,Skor Akhir,Status\n'
        for (const enroll of enrolls) {
            const name = enroll.user?.name || '-'
            const email = enroll.user?.email || '-'
            const examTitle = enroll.exam?.title || '-'
            const category = enroll.exam?.category || '-'
            const score = enroll.score || 0
            const status = enroll.status === 'good' ? 'FINISH' : enroll.status.toUpperCase()
            const date = enroll.date || '-'
            
            const safeName = `"${name.replace(/"/g, '""')}"`
            const safeTitle = `"${examTitle.replace(/"/g, '""')}"`
            
            csv += `${enroll.id},${safeName},${email},${safeTitle},${category},${date},${score},${status}\n`
        }

        response.header('Content-Type', 'text/csv')
        response.header('Content-Disposition', 'attachment; filename="report-ujian.csv"')
        return response.send(csv)
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
