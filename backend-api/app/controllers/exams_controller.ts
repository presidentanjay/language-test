import type { HttpContext } from '@adonisjs/core/http'
import Exam from '#models/exam'
import { createExamValidator, updateExamValidator } from '#validators/index'

export default class ExamsController {
    async index({ response }: HttpContext) {
        const exams = await Exam.query().orderBy('created_at', 'desc').preload('sections')
        return response.ok(exams)
    }

    async store({ request, response }: HttpContext) {
        const data = await request.validateUsing(createExamValidator)
        const exam = await Exam.create(data)
        return response.created(exam)
    }

    async show({ params, response }: HttpContext) {
        const exam = await Exam.query().where('id', params.id).preload('sections').firstOrFail()
        return response.ok(exam)
    }

    async update({ params, request, response }: HttpContext) {
        const exam = await Exam.findOrFail(params.id)
        const data = await request.validateUsing(updateExamValidator)
        exam.merge(data)
        await exam.save()
        return response.ok(exam)
    }

    async destroy({ params, response }: HttpContext) {
        const exam = await Exam.findOrFail(params.id)
        await exam.delete()
        return response.ok({ message: 'Exam deleted' })
    }
}