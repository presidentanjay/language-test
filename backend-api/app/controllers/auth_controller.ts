import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/index'

export default class AuthController {
    async register({ request, response }: HttpContext) {
        const payload = await request.validateUsing(registerValidator)

        const user = await User.create(payload)

        return response.created(user)
    }

    async login({ request, response }: HttpContext) {
        const { email, password } = await request.validateUsing(loginValidator)

        const user = await User.verifyCredentials(email, password)
        const token = await User.accessTokens.create(user)

        return response.ok({
            type: 'bearer',
            value: token.value!.release(),
        })
    }

    async logout({ auth, response }: HttpContext) {
        const user = auth.user!
        await User.accessTokens.delete(user, user.currentAccessToken.identifier)
        return response.ok({ message: 'Logged out' })
    }

    async me({ auth, response }: HttpContext) {
        return response.ok(auth.user)
    }
}