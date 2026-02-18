import type { HttpContext } from '@adonisjs/core/http'
import QuestionBank from '#models/question_bank'
import BankAnswer from '#models/bank_answer'

export default class QuestionBanksController {
  /**
   * Display a listing of the resource
   */
  async index({ request, response }: HttpContext) {
    const bankPackageId = request.input('bank_package_id')

    const query = QuestionBank.query().preload('answers')

    if (bankPackageId) {
      query.where('bank_package_id', bankPackageId)
    }

    const questions = await query.orderBy('created_at', 'desc')
    return response.ok(questions)
  }

  /**
   * Handle form submission for a new resource
   */
  async store({ request, response }: HttpContext) {
    const { bank_package_id, question_text, audio, answers } = request.all()

    const question = await QuestionBank.create({
      bankPackageId: bank_package_id,
      questionText: question_text,
      audio,
    })

    if (answers && Array.isArray(answers)) {
      await BankAnswer.createMany(
        answers.map((ans: any) => ({
          questionBankId: question.id,
          answerText: ans.answer_text,
          isCorrect: ans.is_correct,
        }))
      )
    }

    await question.load('answers')
    return response.created(question)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const question = await QuestionBank.query()
      .where('id', params.id)
      .preload('answers')
      .firstOrFail()
    return response.ok(question)
  }

  /**
   * Update individual record
   */
  async update({ params, request, response }: HttpContext) {
    const question = await QuestionBank.findOrFail(params.id)
    const { bank_package_id, question_text, audio, answers } = request.all()

    question.merge({
      bankPackageId: bank_package_id,
      questionText: question_text,
      audio,
    })
    await question.save()

    if (answers && Array.isArray(answers)) {
      await BankAnswer.query().where('question_bank_id', question.id).delete()
      await BankAnswer.createMany(
        answers.map((ans: any) => ({
          questionBankId: question.id,
          answerText: ans.answer_text,
          isCorrect: ans.is_correct,
        }))
      )
    }

    await question.load('answers')
    return response.ok(question)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const question = await QuestionBank.findOrFail(params.id)
    await question.delete()
    return response.ok({ message: 'Question deleted from bank' })
  }
}