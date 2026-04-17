import type { HttpContext } from '@adonisjs/core/http'
import Question from '#models/question'

export default class QuestionsController {
    async index({ request, response }: HttpContext) {
        const sectionId = request.input('section_id')
        const query = Question.query().preload('answers')

        if (sectionId) {
            query.where('section_id', sectionId)
        }

        const questions = await query.orderBy('ordering', 'asc').orderBy('created_at', 'asc')
        return response.ok(questions)
    }

    async store({ request, response }: HttpContext) {
        const data = request.all()
        const question = await Question.create(data)
        return response.created(question)
    }

    async show({ params, response }: HttpContext) {
        const question = await Question.query().where('id', params.id).preload('answers').firstOrFail()
        return response.ok(question)
    }

    async update({ params, request, response }: HttpContext) {
        const question = await Question.findOrFail(params.id)
        const data = request.all()
        question.merge(data)
        await question.save()
        return response.ok(question)
    }

    async destroy({ params, response }: HttpContext) {
        const question = await Question.findOrFail(params.id)
        await question.delete()
        return response.ok({ message: 'Question deleted' })
    }
}