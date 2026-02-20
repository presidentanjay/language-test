import type { HttpContext } from '@adonisjs/core/http'
import Enroll from '#models/enroll'
import Submission from '#models/submission'
import ScoreMapping from '#models/score_mapping'

export default class CertificateController {
    async show({ params, response }: HttpContext) {
        const enroll = await Enroll.query()
            .where('id', params.id)
            .preload('user', (u) => {
                u.preload('profile')
            })
            .preload('exam')
            .firstOrFail()

        if (enroll.status !== 'finish' && enroll.status !== 'good') { // 'good' might be a legacy completed status
            return response.badRequest({ message: 'Exam not finished yet' })
        }

        const scores = {
            listening: 0,
            structure: 0,
            reading: 0,
            overall: enroll.score
        }

        if (enroll.for === 'ept') {
            const submissions = await Submission.query()
                .where('enroll_id', enroll.id)
                .where('isCorrect', 'yes')
                .preload('question', (q) => {
                    q.preload('section')
                })

            const counts = {
                listening: 0,
                structure: 0,
                reading: 0
            }

            for (const sub of submissions) {
                const sectionName = sub.question.section.section.toLowerCase()

                if (sectionName.includes('listening')) counts.listening++
                else if (sectionName.includes('structure')) counts.structure++
                else if (sectionName.includes('reading')) counts.reading++
            }

            const getScaledScore = async (category: string, section: string, raw: number) => {
                const mapping = await ScoreMapping.query()
                    .where('category', category)
                    .where('sectionType', section)
                    .where('rawScore', raw)
                    .first()
                return mapping ? mapping.scaledScore : 0
            }

            scores.listening = await getScaledScore('ept', 'listening', counts.listening)
            scores.structure = await getScaledScore('ept', 'structure', counts.structure)
            scores.reading = await getScaledScore('ept', 'reading', counts.reading)

            // Recalculate to be sure, or just use stored score. 
            // Stored score is safer for consistency, but sectional breakdown needs to be accurate.
            // scores.overall = Math.round(((scores.listening + scores.structure + scores.reading) * 10) / 3)
        }

        return response.ok({
            participant: {
                name: enroll.user.name,
                email: enroll.user.email,
                npm: enroll.user.profile?.npm || '-',
                program_study: enroll.user.profile?.programStudy || '-',
                faculty: enroll.user.profile?.faculty || '-'
            },
            exam: {
                title: enroll.exam.title,
                date: enroll.date,
                category: enroll.exam.category
            },
            scores
        })
    }
}
