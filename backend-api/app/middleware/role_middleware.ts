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
  async handle(ctx: HttpContext, next: NextFn, allowedRoles: any) {
    const user = ctx.auth.getUserOrFail()

    let roles: string[] = []
    if (Array.isArray(allowedRoles)) {
      roles = allowedRoles
    } else if (typeof allowedRoles === 'string') {
      roles = allowedRoles.split(',').map((r) => r.trim())
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
      console.log(`[RoleMiddleware] Forbidden. User role: ${user.role}, Allowed:`, roles)
      return ctx.response.forbidden({
        message: 'You do not have permission to access this resource.',
      })
    }

    return next()
  }
}
