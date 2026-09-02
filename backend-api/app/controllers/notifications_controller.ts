import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import Enroll from '#models/enroll'
import Exam from '#models/exam'
import env from '#start/env'

export default class NotificationsController {
  /**
   * Send welcome email after registration
   */
  static async sendWelcomeEmail(user: { name: string; email: string }) {
    try {
      await mail.send((message) => {
        message
          .to(user.email)
          .subject('Selamat Datang di Lembaga Bahasa Widyatama')
          .html(`
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
              <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="display: inline-block; background: #2563eb; color: white; width: 50px; height: 50px; border-radius: 12px; line-height: 50px; font-size: 24px; font-weight: bold;">W</div>
                </div>
                <h1 style="color: #0f172a; font-size: 24px; text-align: center; margin-bottom: 10px;">Selamat Datang, ${user.name}!</h1>
                <p style="color: #64748b; text-align: center; font-size: 14px; line-height: 1.6;">Akun Anda di <strong>Lembaga Bahasa Universitas Widyatama</strong> telah berhasil dibuat.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                <p style="color: #64748b; font-size: 13px;">Langkah selanjutnya:</p>
                <ul style="color: #475569; font-size: 13px; line-height: 2;">
                  <li>Login ke portal ujian</li>
                  <li>Lengkapi profil Anda</li>
                  <li>Daftarkan diri ke sesi ujian yang tersedia</li>
                </ul>
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${env.get('APP_URL', 'http://localhost:3000')}/login" style="display: inline-block; background: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Login Sekarang</a>
                </div>
              </div>
              <p style="text-align: center; color: #94a3b8; font-size: 11px; margin-top: 20px;">Lembaga Bahasa Universitas Widyatama<br>Jl. Cikutra No. 204A, Bandung</p>
            </div>
          `)
      })
    } catch (error) {
      console.error('Failed to send welcome email:', error)
    }
  }

  /**
   * Send exam result notification
   */
  static async sendResultNotification(enroll: Enroll) {
    try {
      await enroll.load('user')
      await enroll.load('exam')

      const user = enroll.user
      const exam = enroll.exam

      await mail.send((message) => {
        message
          .to(user.email)
          .subject(`Hasil Ujian ${exam.title} - Lembaga Bahasa Widyatama`)
          .html(`
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
              <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="display: inline-block; background: #2563eb; color: white; width: 50px; height: 50px; border-radius: 12px; line-height: 50px; font-size: 24px; font-weight: bold;">W</div>
                </div>
                <h1 style="color: #0f172a; font-size: 24px; text-align: center;">Ujian Telah Selesai!</h1>
                <p style="color: #64748b; text-align: center; font-size: 14px;">Halo ${user.name}, berikut adalah hasil ujian Anda:</p>
                <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
                  <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Skor Akhir</p>
                  <p style="color: #0f172a; font-size: 48px; font-weight: 900; margin: 0;">${enroll.score || 0}</p>
                  <p style="color: #2563eb; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${exam.category?.toUpperCase()} Scale</p>
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 12px 0; color: #64748b;">Ujian</td>
                    <td style="padding: 12px 0; color: #0f172a; font-weight: bold; text-align: right;">${exam.title}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 12px 0; color: #64748b;">Kode</td>
                    <td style="padding: 12px 0; color: #0f172a; font-weight: bold; text-align: right;">${enroll.examCode}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #64748b;">Tanggal</td>
                    <td style="padding: 12px 0; color: #0f172a; font-weight: bold; text-align: right;">${enroll.date || new Date().toLocaleDateString('id-ID')}</td>
                  </tr>
                </table>
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${env.get('APP_URL', 'http://localhost:3000')}/result/${enroll.id}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Lihat Detail & Cetak Sertifikat</a>
                </div>
              </div>
              <p style="text-align: center; color: #94a3b8; font-size: 11px; margin-top: 20px;">Lembaga Bahasa Universitas Widyatama<br>Jl. Cikutra No. 204A, Bandung</p>
            </div>
          `)
      })
    } catch (error) {
      console.error('Failed to send result notification:', error)
    }
  }

  /**
   * Send exam reminder (H-1)
   */
  static async sendExamReminder(user: { name: string; email: string }, exam: { title: string; code: string; scheduleDate: string; scheduleTime: string }) {
    try {
      await mail.send((message) => {
        message
          .to(user.email)
          .subject(`Pengingat: Ujian ${exam.title} Besok - Lembaga Bahasa Widyatama`)
          .html(`
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
              <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="display: inline-block; background: #f59e0b; color: white; width: 50px; height: 50px; border-radius: 12px; line-height: 50px; font-size: 24px;">⏰</div>
                </div>
                <h1 style="color: #0f172a; font-size: 24px; text-align: center;">Pengingat Ujian</h1>
                <p style="color: #64748b; text-align: center; font-size: 14px;">Halo ${user.name}, ujian Anda dijadwalkan <strong>besok</strong>!</p>
                <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 24px; margin: 24px 0;">
                  <table style="width: 100%; font-size: 13px;">
                    <tr><td style="padding: 8px 0; color: #92400e;">Ujian</td><td style="text-align: right; font-weight: bold; color: #78350f;">${exam.title}</td></tr>
                    <tr><td style="padding: 8px 0; color: #92400e;">Kode</td><td style="text-align: right; font-weight: bold; color: #78350f;">${exam.code}</td></tr>
                    <tr><td style="padding: 8px 0; color: #92400e;">Tanggal</td><td style="text-align: right; font-weight: bold; color: #78350f;">${exam.scheduleDate}</td></tr>
                    <tr><td style="padding: 8px 0; color: #92400e;">Waktu</td><td style="text-align: right; font-weight: bold; color: #78350f;">${exam.scheduleTime}</td></tr>
                  </table>
                </div>
                <p style="color: #64748b; font-size: 13px;">Persiapkan diri Anda:</p>
                <ul style="color: #475569; font-size: 13px; line-height: 2;">
                  <li>Pastikan koneksi internet stabil</li>
                  <li>Siapkan webcam yang berfungsi</li>
                  <li>Gunakan browser Chrome atau Safari</li>
                  <li>Pastikan ruangan tenang dan pencahayaan cukup</li>
                </ul>
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${env.get('APP_URL', 'http://localhost:3000')}/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">Buka Dashboard</a>
                </div>
              </div>
              <p style="text-align: center; color: #94a3b8; font-size: 11px; margin-top: 20px;">Lembaga Bahasa Universitas Widyatama<br>Jl. Cikutra No. 204A, Bandung</p>
            </div>
          `)
      })
    } catch (error) {
      console.error('Failed to send reminder:', error)
    }
  }

  /**
   * Admin: Manually trigger reminder for an exam
   */
  async triggerReminder({ params, response }: HttpContext) {
    const exam = await Exam.findOrFail(params.id)

    // Find all enrolled users for this exam
    const enrolls = await Enroll.query()
      .where('exam_code', exam.code)
      .whereIn('status', ['enrolled', 'ready'])
      .preload('user')

    let sent = 0
    for (const enroll of enrolls) {
      const schedule = exam.schedules?.[0]
      await NotificationsController.sendExamReminder(
        { name: enroll.user.name, email: enroll.user.email },
        {
          title: exam.title,
          code: exam.code,
          scheduleDate: schedule?.date || 'TBD',
          scheduleTime: schedule?.time || 'TBD',
        }
      )
      sent++
    }

    return response.ok({ message: `Reminder terkirim ke ${sent} peserta`, sent })
  }
}
