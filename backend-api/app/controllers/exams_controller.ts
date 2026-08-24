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
        const conferenceLink = request.input('conferenceLink', null)
        const exam = await Exam.create({ ...data, conferenceLink: conferenceLink || null })
        return response.created(exam)
    }

    async show({ params, response }: HttpContext) {
        const exam = await Exam.query().where('id', params.id).preload('sections').firstOrFail()
        return response.ok(exam)
    }

    async update({ params, request, response }: HttpContext) {
        const exam = await Exam.findOrFail(params.id)
        const data = await request.validateUsing(updateExamValidator)
        const conferenceLink = request.input('conferenceLink', null)
        exam.merge({ ...data, conferenceLink: conferenceLink || null })
        await exam.save()
        return response.ok(exam)
    }

    async destroy({ params, response }: HttpContext) {
        try {
            const exam = await Exam.findOrFail(params.id)
            
            // To prevent MySQL cyclic cascade constraint errors (Submission references Question and Answer)
            // We'll manually delete relationships from bottom up
            
            const sections = await exam.related('sections').query()
            
            for (const section of sections) {
                const questions = await section.related('questions').query()
                for (const question of questions) {
                    // Delete submissions tied to this question
                    const db = await import('@adonisjs/lucid/services/db').then(m => m.default)
                    await db.from('submissions').where('question_id', question.id).delete()
                    
                    // Delete answers
                    await db.from('answers').where('question_id', question.id).delete()
                }
                // Delete questions
                const db = await import('@adonisjs/lucid/services/db').then(m => m.default)
                await db.from('questions').where('section_id', section.id).delete()
                await db.from('section_audios').where('section_id', section.id).delete()
            }
            
            // Delete sections and their audio files
            const db = await import('@adonisjs/lucid/services/db').then(m => m.default)
            const fs = await import('fs')
            const app = await import('@adonisjs/core/services/app').then(m => m.default)
            
            for (const section of sections) {
                const audios = await db.from('section_audios').where('section_id', section.id)
                for (const audio of audios) {
                    if (audio.audio_url) {
                        try {
                            const filePath = app.publicPath(audio.audio_url.replace('/uploads', 'uploads'))
                            if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
                        } catch (e) {}
                    }
                }
                await db.from('section_audios').where('section_id', section.id).delete()
            }
            await db.from('sections').where('exam_id', exam.id).delete()

            // Delete related enrollments to clean up orphaned data and physical files
            const enrolls = await db.from('enrolls').where('exam_code', exam.code)
            for (const enroll of enrolls) {
                const snapshots = await db.from('exam_snapshots').where('enroll_id', enroll.id)
                for (const snap of snapshots) {
                    if (snap.photo_url) {
                        try {
                            const p = app.publicPath(snap.photo_url.replace('/uploads', 'uploads'))
                            if (fs.existsSync(p)) fs.unlinkSync(p)
                        } catch (e) {}
                    }
                    if (snap.audio_url) {
                        try {
                            const p = app.publicPath(snap.audio_url.replace('/uploads', 'uploads'))
                            if (fs.existsSync(p)) fs.unlinkSync(p)
                        } catch (e) {}
                    }
                }
                await db.from('exam_snapshots').where('enroll_id', enroll.id).delete()
                await db.from('submissions').where('enroll_id', enroll.id).delete()
            }
            await db.from('enrolls').where('exam_code', exam.code).delete()

            await exam.delete()
            return response.ok({ message: 'Exam deleted successfully' })
        } catch (error: any) {
            console.error('Destroy error:', error)
            return response.internalServerError({ message: 'Failed to delete exam: ' + error.message })
        }
    }
}