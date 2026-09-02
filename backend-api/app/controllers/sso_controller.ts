import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import User from '#models/user'
import Profile from '#models/profile'

export default class SsoController {
  /**
   * Redirect user to SSO provider's authorization page
   */
  async redirect({ response }: HttpContext) {
    const enabled = env.get('SSO_ENABLED', 'false')
    if (enabled !== 'true') {
      return response.badRequest({ message: 'SSO is not enabled' })
    }

    const authUrl = env.get('SSO_AUTH_URL', '')
    const clientId = env.get('SSO_CLIENT_ID', '')
    const redirectUri = env.get('SSO_REDIRECT_URI', '')
    const scopes = env.get('SSO_SCOPES', 'openid profile email')

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes,
      state: crypto.randomUUID(),
    })

    return response.redirect(`${authUrl}?${params.toString()}`)
  }

  /**
   * Handle callback from SSO provider
   */
  async callback({ request, response }: HttpContext) {
    const code = request.input('code')
    const error = request.input('error')

    if (error || !code) {
      // Redirect to frontend login with error
      const frontendUrl = env.get('APP_URL', 'http://localhost:3000')
      return response.redirect(`${frontendUrl}/login?sso_error=access_denied`)
    }

    try {
      // Exchange authorization code for access token
      const tokenUrl = env.get('SSO_TOKEN_URL', '')
      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: env.get('SSO_REDIRECT_URI', ''),
          client_id: env.get('SSO_CLIENT_ID', ''),
          client_secret: env.get('SSO_CLIENT_SECRET', ''),
        }),
      })

      if (!tokenResponse.ok) {
        throw new Error(`Token exchange failed: ${tokenResponse.status}`)
      }

      const tokenData = await tokenResponse.json() as { access_token: string }

      // Fetch user info from SSO provider
      const userInfoUrl = env.get('SSO_USERINFO_URL', '')
      const userInfoResponse = await fetch(userInfoUrl, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })

      if (!userInfoResponse.ok) {
        throw new Error(`User info fetch failed: ${userInfoResponse.status}`)
      }

      const userInfo = await userInfoResponse.json() as {
        sub?: string
        email?: string
        name?: string
        preferred_username?: string
        given_name?: string
        family_name?: string
        student_id?: string
        npm?: string
        faculty?: string
        program_study?: string
      }

      if (!userInfo.email) {
        throw new Error('SSO provider did not return email')
      }

      // Find or create user
      let user = await User.findBy('email', userInfo.email)

      if (!user) {
        // Create new user from SSO data
        user = await User.create({
          email: userInfo.email,
          name: userInfo.name || userInfo.preferred_username || userInfo.email.split('@')[0],
          password: crypto.randomUUID(), // Random password (user logs in via SSO)
          role: 'test_taker',
        })

        // Create profile with SSO data if available
        await Profile.create({
          userId: user.id,
          registrant: userInfo.name || '',
          npm: userInfo.npm || userInfo.student_id || '',
          faculty: userInfo.faculty || '',
          programStudy: userInfo.program_study || '',
        })
      }

      // Generate auth token
      const token = await User.accessTokens.create(user)

      // Set HttpOnly cookie and redirect to frontend dashboard
      const frontendUrl = env.get('APP_URL', 'http://localhost:3000')

      response.cookie('auth_token', token.value!.release(), {
        httpOnly: true,
        secure: env.get('NODE_ENV') === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return response.redirect(`${frontendUrl}/dashboard?sso=success`)
    } catch (err) {
      console.error('SSO callback error:', err)
      const frontendUrl = env.get('APP_URL', 'http://localhost:3000')
      return response.redirect(`${frontendUrl}/login?sso_error=server_error`)
    }
  }

  /**
   * Check if SSO is enabled
   */
  async status({ response }: HttpContext) {
    const enabled = env.get('SSO_ENABLED', 'false') === 'true'
    return response.ok({ enabled })
  }
}
