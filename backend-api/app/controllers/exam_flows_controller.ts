import type { HttpContext } from '@adonisjs/core/http'
import Exam from '#models/exam'
import Section from '#models/section'
import Enroll from '#models/enroll'
import Submission from '#models/submission'
import Answer from '#models/answer'
import ScoreMapping from '#models/score_mapping'

export default class ExamFlowsController {
    /**
     * Enroll student in an exam
     */
    async enroll({ params, request, response, auth }: HttpContext) {
        const user = auth.getUserOrFail()
        const exam_id = params.id || request.input('exam_id')

        const exam = await Exam.findOrFail(exam_id)

        // Check if already enrolled and not finished
        const existing = await Enroll.query()
            .where('userId', user.id.toString())
            .where('examCode', exam.code)
            .whereIn('status', ['enrolled', 'working'])
            .first()

        if (existing) {
            return response.ok(existing)
        }

        const enroll = await Enroll.create({
            userId: user.id,
            examCode: exam.code,
            for: exam.category as 'ept' | 'toeic',
            date: new Date().toISOString().split('T')[0], // placeholder
            time: new Date().toLocaleTimeString(), // placeholder
            status: 'enrolled',
            expired: 'no'
        })

        return response.created(enroll)
    }

    /**
     * Get questions for an enrolled session
     */
    async getQuestions({ params, response }: HttpContext) {
        const enroll = await Enroll.findOrFail(params.id)

        // Update status to working when they start fetching questions
        if (enroll.status === 'enrolled') {
            enroll.status = 'working'
            await enroll.save()
        }

        const exam = await Exam.query().where('code', enroll.examCode).firstOrFail()

        // For now, get all sections and questions for this exam
        const sections = await Section.query()
            .where('exam_id', exam.id)
            .preload('questions', (qQuery) => {
                qQuery.preload('answers')
            })
            .orderBy('id', 'asc')

        return response.ok(sections)
    }

    /**
     * Submit an answer for a specific question
     */
    async submitAnswer({ params, request, response }: HttpContext) {
        const enroll = await Enroll.findOrFail(params.id)

        // Ensure status is working
        if (enroll.status === 'enrolled') {
            enroll.status = 'working'
            await enroll.save()
        }

        const { question_id, answer_id } = request.only(['question_id', 'answer_id'])

        // Validate answer belongs to question
        const answer = await Answer.query()
            .where('id', answer_id)
            .where('question_id', question_id)
            .firstOrFail()

        // Find or create submission
        let submission = await Submission.query()
            .where('enroll_id', enroll.id)
            .where('question_id', question_id)
            .first()

        if (submission) {
            submission.merge({
                answerId: answer.id,
                isCorrect: answer.isCorrect
            })
            await submission.save()
        } else {
            submission = await Submission.create({
                enrollId: enroll.id,
                questionId: question_id,
                answerId: answer.id,
                isCorrect: answer.isCorrect
            })
        }

        return response.ok(submission)
    }

    /**
     * Finish the test
     */
    async finish({ params, response }: HttpContext) {
        const enroll = await Enroll.findOrFail(params.id)
        enroll.status = 'finish'

        // Calculate Score
        let score = 0

        if (enroll.for === 'ept') {
            const submissions = await Submission.query()
                .where('enroll_id', enroll.id)
                .where('is_correct', 'yes')
                .preload('question', (q) => {
                    q.preload('section')
                })

            const counts = {
                listening: 0,
                structure: 0,
                reading: 0
            }

            for (const sub of submissions) {
                if (!sub.question || !sub.question.section) continue;

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
            const correctCount = await Submission.query()
                .where('enroll_id', enroll.id)
                .where('is_correct', 'yes')
                .count('* as total')
            score = correctCount[0].$extras.total
        }

        enroll.score = score
        await enroll.save()

        return response.ok({
            message: 'Test finished',
            score: score
        })
    }

    /**
     * Get test results
     */
    async getResult({ params, response }: HttpContext) {
        const enroll = await Enroll.query()
            .where('id', params.id)
            .preload('submissions', (s) => s.preload('question').preload('answer'))
            .firstOrFail()

        return response.ok(enroll)
    }

    /**
     * Monitoring active participants
     */
    async monitoring({ response }: HttpContext) {
        const activeEnrolls = await Enroll.query()
            .where('status', 'working')
            .preload('submissions')
            .orderBy('updated_at', 'desc')

        return response.ok(activeEnrolls)
    }
}