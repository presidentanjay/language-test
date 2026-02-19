import type { HttpContext } from '@adonisjs/core/http'
import Exam from '#models/exam'
import Section from '#models/section'
import Enroll from '#models/enroll'
import Submission from '#models/submission'
import Answer from '#models/answer'

export default class ExamFlowsController {
    /**
     * Enroll student in an exam
     */
    async enroll({ request, response, auth }: HttpContext) {
        const user = auth.getUserOrFail()
        const { exam_id } = request.only(['exam_id'])

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
            userId: user.id.toString(),
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
        await enroll.save()

        // Calculate Score (Simple count for now)
        const correctCount = await Submission.query()
            .where('enroll_id', enroll.id)
            .where('is_correct', 'yes')
            .count('* as total')

        return response.ok({
            message: 'Test finished',
            score: correctCount[0].$extras.total
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