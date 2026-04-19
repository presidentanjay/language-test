import type { HttpContext } from '@adonisjs/core/http'
import Enroll from '#models/enroll'
import User from '#models/user'
import Submission from '#models/submission'
import ScoreMapping from '#models/score_mapping'
import db from '@adonisjs/lucid/services/db'

export default class ReportController {
    async getParticipantScores({ response }: HttpContext) {
        const enrolls = await Enroll.query()
            .whereIn('status', ['finish', 'good'])
            .preload('exam')
            .orderBy('created_at', 'desc')

        const userIds = [...new Set(enrolls.map(e => e.userId))]
        const users = await User.query().whereIn('id', userIds)
        const userMap = new Map(users.map(u => [u.id.toString(), u]))

        const formatted = enrolls.map(e => {
            const user = userMap.get(e.userId.toString())
            return {
                ...e.toJSON(),
                user: user ? user.toJSON() : null
            }
        })

        return response.ok(formatted)
    }

    // Helper for internal recalculation
    async recalculateScoreInternal(enroll: Enroll) {
        const submissions = await Submission.query()
            .where('enroll_id', enroll.id)
            .where('is_correct', 'yes')
            .preload('question', (q) => { q.preload('section') })

        let score = 0
        if (enroll.for === 'ept') {
            const counts = { listening: 0, structure: 0, reading: 0 }
            for (const sub of submissions) {
                if (!sub.question || !sub.question.section) continue
                const sectionBadge = sub.question.section.section.toLowerCase()
                const sectionTitle = sub.question.section.title.toLowerCase()

                const isListening = sectionBadge.includes('listening') || sectionTitle.includes('listening') || sectionBadge === 'pkt-a'
                const isStructure = sectionBadge.includes('structure') || sectionTitle.includes('structure') || sectionBadge === 'pkt-b'
                const isReading = sectionBadge.includes('reading') || sectionTitle.includes('reading') || sectionBadge === 'pkt-c'

                if (isListening) counts.listening++
                else if (isStructure) counts.structure++
                else if (isReading) counts.reading++
            }
            const getScaledScore = async (category: string, section: string, raw: number) => {
                const mapping = await ScoreMapping.query()
                    .where('category', category).where('sectionType', section).where('rawScore', raw).first()
                return mapping ? mapping.scaledScore : 0
            }
            const listeningScore = await getScaledScore('ept', 'listening', counts.listening)
            const structureScore = await getScaledScore('ept', 'structure', counts.structure)
            const readingScore = await getScaledScore('ept', 'reading', counts.reading)
            score = Math.round(((listeningScore + structureScore + readingScore) * 10) / 3)
        } else {
            score = submissions.length
        }
        enroll.score = score
        await enroll.save()
    }

    async recalculateScore({ params, response }: HttpContext) {
        const enroll = await Enroll.findOrFail(params.id)

        // Triple check submissions
        const submissions = await Submission.query()
            .where('enroll_id', enroll.id)
            .where('is_correct', 'yes')
            .preload('question', (q) => {
                q.preload('section')
            })

        let score = 0

        if (enroll.for === 'ept') {
            const counts = {
                listening: 0,
                structure: 0,
                reading: 0
            }

            for (const sub of submissions) {
                if (!sub.question || !sub.question.section) continue
                const sectionBadge = sub.question.section.section.toLowerCase()
                const sectionTitle = sub.question.section.title.toLowerCase()

                const isListening = sectionBadge.includes('listening') || sectionTitle.includes('listening') || sectionBadge === 'pkt-a'
                const isStructure = sectionBadge.includes('structure') || sectionTitle.includes('structure') || sectionBadge === 'pkt-b'
                const isReading = sectionBadge.includes('reading') || sectionTitle.includes('reading') || sectionBadge === 'pkt-c'

                if (isListening) counts.listening++
                else if (isStructure) counts.structure++
                else if (isReading) counts.reading++
            }

            const getScaledScore = async (category: string, section: string, raw: number) => {
                const mapping = await ScoreMapping.query()
                    .where('category', category)
                    .where('sectionType', section)
                    .where('rawScore', raw)
                    .first()
                return mapping ? mapping.scaledScore : 0
            }

            const listeningScore = await getScaledScore('ept', 'listening', counts.listening)
            const structureScore = await getScaledScore('ept', 'structure', counts.structure)
            const readingScore = await getScaledScore('ept', 'reading', counts.reading)

            score = Math.round(((listeningScore + structureScore + readingScore) * 10) / 3)
        } else {
            score = submissions.length
        }

        enroll.score = score
        await enroll.save()

        return response.ok({
            id: enroll.id,
            oldScore: 310,
            newScore: score,
            counts: enroll.for === 'ept' ? 'Recalculated EPT' : 'Simplified count'
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
