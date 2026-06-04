import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Exam from '#models/exam'
import Section from '#models/section'
import Enroll from '#models/enroll'
import Answer from '#models/answer'
import Submission from '#models/submission'
import ScoreMapping from '#models/score_mapping'
import { submitAnswerValidator } from '#validators/index'
import ScoreCalculationService from '#services/score_calculation_service'

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
            .whereIn('status', ['enrolled', 'working', 'kick'])
            .first()

        if (existing) {
            return response.ok(existing)
        }

        // Validate schedule strict (Option A)
        if (!exam.schedules || exam.schedules.length === 0) {
            return response.forbidden({ message: 'Ujian ini belum memiliki jadwal yang ditentukan.' })
        }

        const sections = await Section.query().where('exam_id', exam.id)
        const totalDuration = sections.reduce((acc, curr) => acc + curr.duration, 0)
        
        const now = DateTime.now().setZone('Asia/Jakarta')
        let isValidSchedule = false

        for (const schedule of exam.schedules) {
            const timeParts = schedule.time.split(':')
            const hours = parseInt(timeParts[0], 10)
            const minutes = parseInt(timeParts[1], 10)
            
            const start = DateTime.fromISO(schedule.date, { zone: 'Asia/Jakarta' }).set({ hour: hours, minute: minutes, second: 0, millisecond: 0 })
            const end = start.plus({ minutes: totalDuration })

            if (now >= start && now <= end) {
                isValidSchedule = true
                break
            }
        }

        if (!isValidSchedule) {
            return response.forbidden({ message: 'Ujian tidak dapat diakses saat ini. Jadwal ujian belum dimulai atau sudah berakhir.' })
        }

        const enroll = await Enroll.create({
            userId: user.id,
            examCode: exam.code,
            for: exam.category as 'ept' | 'toeic',
            date: now.toISODate() || new Date().toISOString().split('T')[0],
            time: now.toISOTime() || new Date().toLocaleTimeString(),
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
            enroll.startedAt = DateTime.now()
            await enroll.save()
        }

        const exam = await Exam.query().where('code', enroll.examCode).firstOrFail()

        const sections = await Section.query()
            .where('exam_id', exam.id)
            .preload('questions', (qQuery) => {
                qQuery.preload('answers')
            })
            .preload('sectionAudios', (aQuery) => {
                aQuery.orderBy('from_question', 'asc')
            })
            .orderBy('id', 'asc')

        // Shuffle questions and answers per participant using enrollId as seed
        const seed = enroll.id
        const serialized = sections.map((section) => {
            const sectionData = section.serialize()
            
            if (!sectionData.questions || !Array.isArray(sectionData.questions)) {
                return sectionData
            }

            // Detect listening sections — these have audio attached or are named "listening"
            const sectionBadge = (section.section || '').toLowerCase()
            const sectionTitle = (section.title || '').toLowerCase()
            const isListening = !!section.audio
                || sectionBadge.includes('listening')
                || sectionTitle.includes('listening')
                || sectionBadge === 'pkt-a'

            // Only shuffle question ORDER for non-listening sections.
            // Listening sections must keep question order to match the audio sequence.
            if (!isListening) {
                sectionData.questions = this.seededShuffle([...sectionData.questions], seed + section.id)
            }
            
            // Shuffle answer order within each question (safe for all sections)
            // SECURITY: Strip isCorrect from answers — students must NOT see correct answers
            sectionData.questions = sectionData.questions.map((q: any, idx: number) => ({
                ...q,
                answers: this.seededShuffle([...(q.answers || [])], seed + section.id + idx + 7)
                    .map((a: any) => ({
                        id: a.id,
                        answer: a.answer,
                        // isCorrect is intentionally omitted
                    })),
            }))
            
            return sectionData
        })

        return response.ok(serialized)
    }

    /**
     * Fisher-Yates shuffle with a simple seeded PRNG.
     */
    private seededShuffle<T>(array: T[], seed: number): T[] {
        if (array.length <= 1) return array
        
        let s = seed
        const random = () => {
            s = (s * 9301 + 49297) % 233280
            return s / 233280
        }
        
        // Initial jiggles
        for(let k=0; k<5; k++) random()

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    /**
     * Submit an answer for a specific question
     */
    async submitAnswer({ params, request, response }: HttpContext) {
        console.log(`[submitAnswer] Enroll #${params.id} | Body:`, request.body())
        const enroll = await Enroll.findOrFail(params.id)

        // Ensure status is working
        if (enroll.status === 'enrolled') {
            enroll.status = 'working'
            await enroll.save()
        }

        const { question_id, answer_id } = await request.validateUsing(submitAnswerValidator)

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

        console.log(`[submitAnswer] ✅ Saved! Enroll #${enroll.id} | Q:${question_id} → A:${answer.id}`)
        return response.ok(submission)
    }

    /**
     * Finish the test
     */
    async finish({ params, response }: HttpContext) {
        const enroll = await Enroll.query()
            .where('id', params.id)
            .preload('user')
            .preload('exam')
            .firstOrFail()
            
        enroll.status = 'finish'

        const sectionalScores = await ScoreCalculationService.calculate(enroll)
        const score = sectionalScores.overall

        enroll.score = score
        await enroll.save()

        try {
            const mail = await import('@adonisjs/mail/services/main').then(m => m.default)
            await mail.send((message) => {
                message
                    .to(enroll.user.email)
                    .from('no-reply@widyatama.ac.id')
                    .subject('Sertifikat & Hasil Ujian Anda')
                    .html(`
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                            <div style="background-color: #2563eb; padding: 24px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 24px;">Selamat! Ujian Selesai</h1>
                            </div>
                            <div style="padding: 32px;">
                                <p style="font-size: 16px; color: #334155;">Halo <strong>${enroll.user.name}</strong>,</p>
                                <p style="font-size: 16px; color: #334155;">Anda telah berhasil menyelesaikan ujian <strong>${enroll.exam.title} (${enroll.exam.category.toUpperCase()})</strong>.</p>
                                
                                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center; border: 1px solid #e2e8f0;">
                                    <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: bold;">Skor Akhir Anda</p>
                                    <p style="margin: 8px 0 0 0; font-size: 36px; font-weight: 900; color: #0f172a;">${score}</p>
                                </div>
                                
                                <p style="font-size: 16px; color: #334155;">Sertifikat kelulusan Anda sudah bisa diunduh langsung melalui Dashboard sistem.</p>
                                
                                <div style="text-align: center; margin: 32px 0;">
                                    <a href="http://localhost:3000/dashboard/history" style="background-color: #0f172a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                                        Download Sertifikat
                                    </a>
                                </div>
                                
                                <p style="font-size: 14px; color: #64748b; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                                    Ini adalah email otomatis. Harap tidak membalas email ini.<br>
                                    Lembaga Bahasa - Widyatama University
                                </p>
                            </div>
                        </div>
                    `)
            })
            console.log('Email sent successfully to', enroll.user.email)
        } catch (error) {
            console.error('Failed to send email:', error)
        }

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

        console.log(`[getResult] Enroll #${enroll.id} | Status: ${enroll.status} | Submissions: ${enroll.submissions?.length || 0}`)

        const sectionalScores = await ScoreCalculationService.calculate(enroll)

        return response.ok({
            ...enroll.serialize(),
            sectionalScores
        })
    }

    /**
     * Reset an enrollment — delete all submissions, set status back to enrolled.
     * Called when participant violates anti-cheat rules (tab switch, navigate away).
     */
    async reset({ params, response }: HttpContext) {
        const enroll = await Enroll.findOrFail(params.id)

        // Only reset if not already finished
        if (enroll.status === 'finish') {
            return response.badRequest({ message: 'Cannot reset a finished exam' })
        }

        enroll.status = 'enrolled'
        await enroll.save()

        await Submission.query().where('enroll_id', enroll.id).delete()

        return response.ok({ message: 'Exam has been reset' })
    }

    /**
     * Block an enrollment — pause the exam without deleting submissions.
     */
    async block({ params, response }: HttpContext) {
        const enroll = await Enroll.query()
            .where('id', params.id)
            .withCount('submissions')
            .firstOrFail()

        if (enroll.status === 'finish') {
            return response.badRequest({ message: 'Cannot block a finished exam' })
        }

        console.log(`[block] Enroll #${enroll.id} | Old Status: ${enroll.status} | Submissions: ${enroll.$extras.submissions_count}`)

        enroll.status = 'kick'
        await enroll.save()

        return response.ok({ message: 'Exam has been blocked' })
    }

    /**
     * Unblock an enrollment — resume the exam.
     */
    async unblock({ params, response }: HttpContext) {
        const enroll = await Enroll.query()
            .where('id', params.id)
            .withCount('submissions')
            .firstOrFail()

        if (enroll.status !== 'kick') {
            return response.badRequest({ message: 'Exam is not blocked' })
        }

        console.log(`[unblock] Enroll #${enroll.id} | Submissions preserved: ${enroll.$extras.submissions_count}`)

        enroll.status = 'working'
        await enroll.save()

        return response.ok({ message: 'Exam has been unblocked' })
    }

    /**
     * Monitoring active participants
     */
    async monitoring({ response }: HttpContext) {
        const activeEnrolls = await Enroll.query()
            .whereIn('status', ['working', 'kick'])
            .withCount('submissions')
            .preload('user', (u) => u.preload('profile'))
            .orderBy('updated_at', 'desc')

        return response.ok(activeEnrolls)
    }
}