import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class UploadController {
  async store({ request, response }: HttpContext) {
    const audio = request.file('audio', {
      size: '20mb',
      extnames: ['mp3', 'wav', 'ogg'],
    })

    if (!audio) {
      return response.badRequest({ message: 'No audio file uploaded' })
    }

    if (!audio.isValid) {
      return response.badRequest({ message: 'Invalid file', errors: audio.errors })
    }

    const fileName = `${cuid()}.${audio.extname}`
    await audio.move(app.publicPath('uploads/audio'), {
      name: fileName,
    })

    return response.ok({
      message: 'File uploaded successfully',
      url: `/uploads/audio/${fileName}`,
    })
  }
}
