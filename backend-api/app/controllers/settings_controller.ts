import type { HttpContext } from '@adonisjs/core/http'
import Setting from '#models/setting'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs/promises'

export default class SettingsController {
  async index({ response }: HttpContext) {
    const settings = await Setting.all()
    const config: Record<string, string | null> = {}
    for (const setting of settings) {
      config[setting.key] = setting.value
    }
    return response.ok(config)
  }

  async update({ request, response }: HttpContext) {
    const payload = request.only(['cert_director_name', 'cert_director_nip'])

    for (const [key, value] of Object.entries(payload)) {
      await Setting.updateOrCreate({ key }, { value: value as string })
    }

    const template = request.file('cert_template')
    if (template) {
      const fileName = `certificate-template-${new Date().getTime()}.${template.extname}`
      await template.move(app.makePath('public/uploads'), { name: fileName })
      await Setting.updateOrCreate({ key: 'cert_template_path' }, { value: `/uploads/${fileName}` })
    }

    const signature = request.file('cert_signature')
    if (signature) {
      const fileName = `signature-${new Date().getTime()}.${signature.extname}`
      await signature.move(app.makePath('public/uploads'), { name: fileName })
      await Setting.updateOrCreate(
        { key: 'cert_signature_path' },
        { value: `/uploads/${fileName}` }
      )
    }

    const settings = await Setting.all()
    const config: Record<string, string | null> = {}
    for (const setting of settings) {
      config[setting.key] = setting.value
    }

    return response.ok({ message: 'Settings updated successfully', config })
  }
}
