import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import { cuid } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'

export default class PasswordResetsController {
  async forgotPassword({ request, response }: HttpContext) {
    const email = request.input('email')
    const user = await User.findBy('email', email)
    
    if (!user) {
      return response.ok({ message: 'Jika email terdaftar, instruksi reset telah dikirim.' })
    }

    const token = cuid()
    await db.table('password_reset_tokens').insert({
      email,
      token,
      expires_at: DateTime.now().plus({ hours: 1 }).toSQL()
    })

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`

    await mail.send((message) => {
      message
        .to(email)
        .from(process.env.MAIL_FROM_ADDRESS || 'admin@kampus.ac.id')
        .subject('Reset Password Ujian Anda')
        .html(`
          <h2>Halo ${user.name},</h2>
          <p>Anda menerima email ini karena ada permintaan reset password untuk akun Anda.</p>
          <p><a href="${resetLink}">Klik di sini untuk reset password</a></p>
          <p>Tautan ini akan kadaluarsa dalam 1 jam.</p>
          <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
        `)
    })

    return response.ok({ message: 'Jika email terdaftar, instruksi reset telah dikirim.' })
  }

  async resetPassword({ request, response }: HttpContext) {
    const token = request.input('token')
    const newPassword = request.input('password')

    const resetRecord = await db.from('password_reset_tokens').where('token', token).first()

    if (!resetRecord || DateTime.fromSQL(resetRecord.expires_at) < DateTime.now()) {
      return response.badRequest({ message: 'Token reset password tidak valid atau sudah kadaluarsa.' })
    }

    const user = await User.findByOrFail('email', resetRecord.email)
    user.password = newPassword
    await user.save()

    await db.from('password_reset_tokens').where('email', resetRecord.email).delete()

    return response.ok({ message: 'Password berhasil direset. Silakan login dengan password baru.' })
  }
}