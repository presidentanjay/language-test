import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import Payment from '#models/payment'
import Exam from '#models/exam'
import midtransClient from 'midtrans-client'

export default class PaymentsController {
  private getSnap() {
    return new midtransClient.Snap({
      isProduction: env.get('MIDTRANS_IS_PRODUCTION', 'false') === 'true',
      serverKey: env.get('MIDTRANS_SERVER_KEY', ''),
      clientKey: env.get('MIDTRANS_CLIENT_KEY', ''),
    })
  }

  /**
   * Create a payment transaction for an exam
   */
  async createTransaction({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { examCode } = request.only(['examCode'])

    const exam = await Exam.query().where('code', examCode).firstOrFail()

    if (exam.price <= 0) {
      return response.badRequest({ message: 'Ujian ini gratis, tidak perlu pembayaran' })
    }

    // Check if already paid
    const existingPayment = await Payment.query()
      .where('user_id', user.id.toString())
      .where('exam_code', examCode)
      .where('status_pay', 'settlement')
      .first()

    if (existingPayment) {
      return response.badRequest({ message: 'Anda sudah membayar ujian ini' })
    }

    const orderId = `WDT-${examCode}-${user.id}-${Date.now()}`

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: exam.price,
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
      },
      item_details: [{
        id: examCode,
        price: exam.price,
        quantity: 1,
        name: exam.title.substring(0, 50),
      }],
    }

    try {
      const snap = this.getSnap()
      const transaction = await snap.createTransaction(parameter)

      // Save payment record
      await Payment.create({
        userId: user.id.toString(),
        orderId,
        examCode,
        amount: exam.price,
        snapToken: transaction.token,
        statusPay: 'pending',
        description: `Pembayaran ujian ${exam.title}`,
        used: 'no',
        deleted: 'no',
      })

      return response.ok({
        token: transaction.token,
        redirectUrl: transaction.redirect_url,
        orderId,
      })
    } catch (error) {
      console.error('Midtrans error:', error)
      return response.internalServerError({ message: 'Gagal membuat transaksi pembayaran' })
    }
  }

  /**
   * Handle Midtrans webhook notification
   */
  async handleNotification({ request, response }: HttpContext) {
    try {
      const snap = this.getSnap()
      const notification = await snap.transaction.notification(request.body())

      const orderId = notification.order_id
      const transactionStatus = notification.transaction_status
      const paymentType = notification.payment_type
      const transactionId = notification.transaction_id

      const payment = await Payment.query().where('order_id', orderId).firstOrFail()

      payment.statusPay = transactionStatus
      payment.paymentType = paymentType
      payment.transactionId = transactionId
      await payment.save()

      return response.ok({ message: 'OK' })
    } catch (error) {
      console.error('Notification error:', error)
      return response.internalServerError({ message: 'Failed to process notification' })
    }
  }

  /**
   * Get current user's payment history
   */
  async myPayments({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payments = await Payment.query()
      .where('user_id', user.id.toString())
      .where('deleted', 'no')
      .orderBy('created_at', 'desc')

    return response.ok(payments)
  }

  /**
   * Admin: Get all payments
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)

    const payments = await Payment.query()
      .where('deleted', 'no')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.ok(payments)
  }

  /**
   * Check payment status for a specific exam
   */
  async checkPayment({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payment = await Payment.query()
      .where('user_id', user.id.toString())
      .where('exam_code', params.examCode)
      .where('status_pay', 'settlement')
      .first()

    return response.ok({ paid: !!payment, payment })
  }
}
