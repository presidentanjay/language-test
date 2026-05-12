import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Role middleware guards routes so that only users with
 * the specified role(s) can access them.
 *
 * Usage in routes:
 *   .use(middleware.role(['admin']))
 *   .use(middleware.role(['admin', 'supervisor']))
 */
export default class RoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    allowedRoles: string[] = []
  ) {
    const user = ctx.auth.getUserOrFail()

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return ctx.response.forbidden({
        message: 'You do not have permission to access this resource.',
      })
    }

    return next()
  }
}
