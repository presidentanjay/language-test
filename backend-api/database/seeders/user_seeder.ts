import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // 1. Admin / Super Admin
    await User.updateOrCreate(
      { email: 'admin@gmail.com' },
      {
        name: 'Super Admin',
        password: 'password',
        role: 'admin',
      }
    )

    // 2. Pengawas (Supervisor)
    await User.updateOrCreate(
      { email: 'pengawas@gmail.com' },
      {
        name: 'Pengawas Ujian',
        password: 'password',
        role: 'supervisor',
      }
    )

    // 3. Peserta (Participant)
    await User.updateOrCreate(
      { email: 'peserta@gmail.com' },
      {
        name: 'Peserta Ujian',
        password: 'password',
        role: 'test_taker',
      }
    )
  }
}