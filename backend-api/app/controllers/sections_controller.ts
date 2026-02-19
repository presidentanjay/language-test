import type { HttpContext } from '@adonisjs/core/http'
import Section from '#models/section'
import Question from '#models/question'
import Answer from '#models/answer'

export default class SectionsController {
    async index({ request, response }: HttpContext) {
        const examId = request.input('exam_id')
        const query = Section.query().orderBy('id', 'asc')

        if (examId) {
            query.where('exam_id', examId)
        }

        const sections = await query
        return response.ok(sections)
    }

    async store({ request, response }: HttpContext) {
        const data = request.all()
        const section = await Section.create(data)
        return response.created(section)
    }

    async show({ params, response }: HttpContext) {
        const section = await Section.query()
            .where('id', params.id)
            .preload('questions', (q) => q.preload('answers'))
            .firstOrFail()
        return response.ok(section)
    }

    async update({ params, request, response }: HttpContext) {
        const section = await Section.findOrFail(params.id)
        const data = request.all()
        section.merge(data)
        await section.save()
        return response.ok(section)
    }

    async destroy({ params, response }: HttpContext) {
        const section = await Section.findOrFail(params.id)
        await section.delete()
        return response.ok({ message: 'Section deleted' })
    }

    async bulkStoreQuestions({ params, request, response }: HttpContext) {
        const section = await Section.findOrFail(params.id)
        const { questions } = request.only(['questions'])

        if (!Array.isArray(questions)) {
            return response.badRequest({ message: 'Data questions harus berupa array' })
        }

        try {
            for (const qData of questions) {
                const question = await Question.create({
                    sectionId: section.id,
                    question: qData.question,
                    audio: qData.audio || null,
                    direction: qData.direction || null,
                    ordering: qData.ordering || null,
                })

                if (Array.isArray(qData.answers)) {
                    for (const aData of qData.answers) {
                        await Answer.create({
                            questionId: question.id,
                            answer: aData.answer,
                            isCorrect: aData.is_correct || 'no',
                        })
                    }
                }
            }

            return response.ok({ message: `${questions.length} questions successfully uploaded.` })
        } catch (error) {
            console.error(error)
            return response.internalServerError({ message: 'Failed to bulk upload questions', error: error.message })
        }
    }
}