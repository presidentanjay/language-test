import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { updateUserValidator } from '#validators/index'

export default class UsersController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)
    const users = await User.query()
      .orderBy('created_at', 'desc')
      .preload('profile')
      .paginate(page, limit)
    return response.ok(users)
  }

  async show({ params, response }: HttpContext) {
    const user = await User.query().where('id', params.id).preload('profile').firstOrFail()
    return response.ok(user)
  }

  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = await request.validateUsing(updateUserValidator)

    // Handle profile update if needed
    // const profileData = request.only(['npm', 'faculty', 'programStudy'])

    user.merge(data)
    await user.save()

    return response.ok(user)
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.ok({ message: 'User deleted' })
  }
}
