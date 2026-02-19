import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Exam from '#models/exam'
import Enroll from '#models/enroll'

export default class DashboardController {
    /**
     * Get dashboard statistics
     */
    async stats({ response }: HttpContext) {
        // 1. Total Participants (role: test_taker)
        const totalParticipants = await User.query()
            .where('role', 'test_taker')
            .count('* as total')

        // 2. Active/Total Exams
        const totalExams = await Exam.query()
            .count('* as total')

        // 3. Completed Tests (status: finish)
        const totalCompleted = await Enroll.query()
            .where('status', 'finish')
            .count('* as total')

        // 4. Recent Activity (Last 5 enrollments)
        const recentActivity = await Enroll.query()
            .orderBy('created_at', 'desc')
            .limit(5)
            .preload('submissions') // Or any other relevant info

        return response.ok({
            stats: {
                total_participants: totalParticipants[0].$extras.total,
                total_exams: totalExams[0].$extras.total,
                total_completed: totalCompleted[0].$extras.total,
            },
            recentActivity
        })
    }
}
