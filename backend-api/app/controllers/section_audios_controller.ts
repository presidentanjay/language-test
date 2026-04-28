import type { HttpContext } from '@adonisjs/core/http'
import SectionAudio from '#models/section_audio'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class SectionAudiosController {
  /**
   * List all audio segments for a section
   */
  async index({ params, response }: HttpContext) {
    const audios = await SectionAudio.query()
      .where('section_id', params.sectionId)
      .orderBy('from_question', 'asc')

    return response.ok(audios)
  }

  /**
   * Upload audio and create a new segment mapping
   */
  async store({ params, request, response }: HttpContext) {
    const audioFile = request.file('audio', {
      size: '20mb',
      extnames: ['mp3', 'wav', 'ogg'],
    })

    if (!audioFile) {
      return response.badRequest({ message: 'No audio file uploaded' })
    }

    if (!audioFile.isValid) {
      return response.badRequest({ message: 'Invalid file', errors: audioFile.errors })
    }

    const fileName = `${cuid()}.${audioFile.extname}`
    await audioFile.move(app.publicPath('uploads/audio'), {
      name: fileName,
    })

    const fromQuestion = request.input('from_question')
    const toQuestion = request.input('to_question')

    if (!fromQuestion || !toQuestion) {
      return response.badRequest({ message: 'from_question and to_question are required' })
    }

    const sectionAudio = await SectionAudio.create({
      sectionId: params.sectionId,
      audioUrl: `/uploads/audio/${fileName}`,
      fromQuestion: parseInt(fromQuestion),
      toQuestion: parseInt(toQuestion),
      ordering: parseInt(fromQuestion),
    })

    return response.created(sectionAudio)
  }

  /**
   * Delete an audio segment
   */
  async destroy({ params, response }: HttpContext) {
    const audio = await SectionAudio.findOrFail(params.id)
    await audio.delete()
    return response.ok({ message: 'Audio segment deleted' })
  }
}
