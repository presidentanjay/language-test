import type { HttpContext } from '@adonisjs/core/http'
import BankPackage from '#models/bank_package'
import PdfParserService from '#services/pdf_parser_service'
import QuestionBank from '#models/question_bank'
import BankAnswer from '#models/bank_answer'
import db from '@adonisjs/lucid/services/db'
import fs from 'node:fs/promises'

export default class BankPackagesController {
  /**
   * Bulk upload questions from PDF
   */
  async bulkUpload({ params, request, response }: HttpContext) {
    const pkg = await BankPackage.findOrFail(params.id)
    const file = request.file('file', {
      size: '5mb',
      extnames: ['pdf']
    })

    if (!file || !file.tmpPath) {
      return response.badRequest({ message: 'File is required' })
    }

    try {
      const buffer = await fs.readFile(file.tmpPath)
      const parser = new PdfParserService()
      const parsedQuestions = await parser.parse(buffer)

      if (parsedQuestions.length === 0) {
        return response.badRequest({ message: 'No questions could be extracted from this PDF. Please check the format.' })
      }

      const trx = await db.transaction()
      try {
        for (const qData of parsedQuestions) {
          const question = await QuestionBank.create({
            bankPackageId: pkg.id,
            questionText: qData.question_text,
            direction: qData.direction,
          }, { client: trx })

          await BankAnswer.createMany(
            qData.answers.map((ans: any) => ({
              questionBankId: question.id,
              answerText: ans.answer_text,
              isCorrect: ans.is_correct,
            })),
            { client: trx }
          )
        }
        await trx.commit()
        return response.ok({
          message: `Successfully uploaded ${parsedQuestions.length} questions.`,
          count: parsedQuestions.length
        })
      } catch (err) {
        await trx.rollback()
        throw err
      }
    } catch (error) {
      console.error('Bulk Upload Error:', error)
      return response.internalServerError({ message: 'Server error during PDF processing' })
    }
  }

  /**
   * Display a listing of the resource
   */
  async index({ request, response }: HttpContext) {
    const category = request.input('category')
    const query = BankPackage.query().preload('questions', (q) => q.preload('answers'))

    if (category) {
      query.where('category', category)
    }

    const packages = await query.orderBy('created_at', 'desc')
    return response.ok(packages)
  }

  /**
   * Handle form submission for a new resource
   */
  async store({ request, response }: HttpContext) {
    const { name, category, duration, description } = request.all()

    const pkg = await BankPackage.create({
      name,
      category,
      duration,
      description,
    })

    return response.created(pkg)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const pkg = await BankPackage.query()
      .where('id', params.id)
      .preload('questions', (q) => q.preload('answers'))
      .firstOrFail()
    return response.ok(pkg)
  }

  /**
   * Update individual record
   */
  async update({ params, request, response }: HttpContext) {
    const pkg = await BankPackage.findOrFail(params.id)
    const { name, category, duration, description } = request.all()

    pkg.merge({
      name,
      category,
      duration,
      description,
    })
    await pkg.save()

    return response.ok(pkg)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const pkg = await BankPackage.findOrFail(params.id)
    await pkg.delete()
    return response.ok({ message: 'Package and all its questions deleted' })
  }
}