import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'
import { registerValidator, loginValidator } from '#validators/index'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create(payload)

    const NotificationsController = (await import('#controllers/notifications_controller')).default
    NotificationsController.sendWelcomeEmail({ name: user.name, email: user.email })

    return response.created(user)
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    // Single Active Session: Revoke all existing tokens for this user
    await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()

    const token = await User.accessTokens.create(user)

    response.cookie('auth_token', token.value!.release(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return response.ok({
      type: 'bearer',
      value: token.value!.release(),
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    response.clearCookie('auth_token')

    return response.ok({ message: 'Logged out' })
  }

  async me({ auth, response }: HttpContext) {
    await auth.user!.preload('profile')
    return response.ok(auth.user)
  }

  async updateProfile({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const name = request.input('name')

    if (name) {
      user.name = name
      await user.save()
    }
    return response.ok(user)
  }

  async updatePassword({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const currentPassword = request.input('currentPassword')
    const newPassword = request.input('newPassword')

    const isMatch = await hash.verify(user.password, currentPassword)
    if (!isMatch) {
      return response.badRequest({ message: 'Password saat ini salah' })
    }

    user.password = newPassword
    await user.save()

    return response.ok({ message: 'Password berhasil diperbarui' })
  }
}
