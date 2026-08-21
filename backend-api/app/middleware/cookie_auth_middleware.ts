import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CookieAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const token = ctx.request.cookie('auth_token')
    if (token) {
      // Adonis JS uses the raw node request for headers
      ctx.request.request.headers['authorization'] = `Bearer ${token}`
    }
    await next()
  }
}
