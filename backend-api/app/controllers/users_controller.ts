import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
    async index({ response }: HttpContext) {
        const users = await User.query().orderBy('created_at', 'desc').preload('profile')
        return response.ok(users)
    }

    async show({ params, response }: HttpContext) {
        const user = await User.query().where('id', params.id).preload('profile').firstOrFail()
        return response.ok(user)
    }

    async update({ params, request, response }: HttpContext) {
        const user = await User.findOrFail(params.id)
        const data = request.only(['name', 'email', 'role', 'picture'])

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