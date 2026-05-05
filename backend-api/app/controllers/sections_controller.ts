import type { HttpContext } from '@adonisjs/core/http'
import Section from '#models/section'
import Question from '#models/question'
import Answer from '#models/answer'
import BankPackage from '#models/bank_package'
import db from '@adonisjs/lucid/services/db'

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

    async importFromBank({ params, request, response }: HttpContext) {
        const sectionId = params.id
        const { bank_package_id } = request.only(['bank_package_id'])

        if (!bank_package_id) {
            return response.badRequest({ message: 'bank_package_id is required' })
        }

        const section = await Section.findOrFail(sectionId)
        const bankPkg = await BankPackage.query()
            .where('id', bank_package_id)
            .preload('questions', (q) => q.preload('answers'))
            .firstOrFail()

        const trx = await db.transaction()

        try {
            const lastOrdering = await Question.query()
                .where('section_id', section.id)
                .max('ordering as maxOrder')
                .first()
            
            let currentOrder = (lastOrdering?.$extras.maxOrder || 0) + 1

            for (const bQuestion of bankPkg.questions) {
                const question = await Question.create({
                    sectionId: section.id,
                    question: bQuestion.questionText,
                    direction: bQuestion.direction,
                    audio: bQuestion.audio,
                    ordering: currentOrder++,
                }, { client: trx })

                for (const bAnswer of bQuestion.answers) {
                    await Answer.create({
                        questionId: question.id,
                        answer: bAnswer.answerText,
                        isCorrect: bAnswer.isCorrect,
                    }, { client: trx })
                }
            }

            await trx.commit()
            return response.ok({ 
                message: `Successfully imported ${bankPkg.questions.length} questions from ${bankPkg.name}`,
                count: bankPkg.questions.length
            })
        } catch (error) {
            await trx.rollback()
            console.error('Import Error:', error)
            return response.internalServerError({ message: 'Failed to import from bank', error: error.message })
        }
    }
}