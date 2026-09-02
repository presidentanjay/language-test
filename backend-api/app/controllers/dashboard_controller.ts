import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Exam from '#models/exam'
import Enroll from '#models/enroll'

export default class DashboardController {
  /**
   * Get dashboard statistics
   */
  async stats({ response }: HttpContext) {
    // 1. Total Participants (role: test_taker)
    const totalParticipants = await User.query().where('role', 'test_taker').count('* as total')

    // 2. Active/Total Exams
    const totalExams = await Exam.query().count('* as total')

    // 3. Completed Tests (status: finish)
    const totalCompleted = await Enroll.query().where('status', 'finish').count('* as total')

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
      recentActivity,
    })
  }

  async analytics({ response }: HttpContext) {
    // Score Distribution
    const scoreDistribution = await db.rawQuery(`
      SELECT 
        CASE 
          WHEN score < 400 THEN '0-399'
          WHEN score BETWEEN 400 AND 449 THEN '400-449'
          WHEN score BETWEEN 450 AND 499 THEN '450-499'
          WHEN score BETWEEN 500 AND 549 THEN '500-549'
          WHEN score BETWEEN 550 AND 599 THEN '550-599'
          ELSE '600+'
        END as score_range,
        COUNT(*) as count
      FROM enrolls 
      WHERE status IN ('finish', 'good') AND score > 0
      GROUP BY score_range
      ORDER BY MIN(score)
    `)

    // Monthly Trend (last 6 months)
    const monthlyTrend = await db.rawQuery(`
      SELECT 
        DATE_FORMAT(created_at, '%b %Y') as month,
        COUNT(*) as participants,
        ROUND(AVG(score)) as avg_score
      FROM enrolls 
      WHERE status IN ('finish', 'good') 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY YEAR(created_at), MONTH(created_at), DATE_FORMAT(created_at, '%b %Y')
      ORDER BY YEAR(created_at), MONTH(created_at)
    `)

    // Overall Performance Stats
    const perfStats = await db.rawQuery(`
      SELECT 
        ROUND(AVG(score)) as avg_score,
        MAX(score) as highest_score,
        MIN(score) as lowest_score,
        COUNT(*) as total_finished,
        ROUND(SUM(CASE WHEN score >= 450 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as pass_rate
      FROM enrolls 
      WHERE status IN ('finish', 'good') AND score > 0
    `)

    // Top 5 Performers
    const topPerformers = await Enroll.query()
      .whereIn('status', ['finish', 'good'])
      .where('score', '>', 0)
      .orderBy('score', 'desc')
      .limit(5)
      .preload('user')

    return response.ok({
      scoreDistribution: scoreDistribution[0],
      monthlyTrend: monthlyTrend[0],
      performanceStats: perfStats[0]?.[0] || {},
      topPerformers: topPerformers.map(e => ({
        name: e.user?.name || 'Unknown',
        score: e.score,
        examCode: e.examCode,
        date: e.date || e.createdAt?.toFormat?.('yyyy-MM-dd') || '-',
      })),
    })
  }
}
