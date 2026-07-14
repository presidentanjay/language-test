import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import Profile from '#models/profile'
import Enroll from '#models/enroll'
import ExamSnapshot from '#models/exam_snapshot'

export default class SnapshotController {
  /**
   * Upload identity photos (face + KTM)
   * POST /api/me/upload-identity
   */
  async uploadIdentity({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const facePhoto = request.file('face_photo', {
      size: '15mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'JPG', 'JPEG', 'PNG', 'WEBP', 'HEIC'],
    })

    const ktmPhoto = request.file('ktm_photo', {
      size: '15mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'JPG', 'JPEG', 'PNG', 'WEBP', 'HEIC'],
    })

    if (!facePhoto && !ktmPhoto) {
      return response.badRequest({ message: 'No files uploaded. Provide face_photo and/or ktm_photo.' })
    }

    const urls: { face_photo?: string; ktm_photo?: string } = {}

    if (facePhoto) {
      if (!facePhoto.isValid) {
        return response.badRequest({ message: 'Invalid face photo', errors: facePhoto.errors })
      }

      const faceName = `${cuid()}.${facePhoto.extname}`
      await facePhoto.move(app.publicPath('uploads/faces'), { name: faceName })
      urls.face_photo = `/uploads/faces/${faceName}`
    }

    if (ktmPhoto) {
      if (!ktmPhoto.isValid) {
        return response.badRequest({ message: 'Invalid KTM photo', errors: ktmPhoto.errors })
      }

      const ktmName = `${cuid()}.${ktmPhoto.extname}`
      await ktmPhoto.move(app.publicPath('uploads/ktm'), { name: ktmName })
      urls.ktm_photo = `/uploads/ktm/${ktmName}`
    }

    // Update or create profile
    const profile = await Profile.firstOrCreate(
      { userId: user.id },
      { userId: user.id }
    )

    if (urls.face_photo) {
      profile.facePhoto = urls.face_photo
    }
    if (urls.ktm_photo) {
      profile.ktmPhoto = urls.ktm_photo
    }

    await profile.save()

    return response.ok({
      message: 'Identity photos uploaded successfully',
      urls,
    })
  }

  /**
   * Capture a snapshot during exam
   * POST /api/enrolls/:id/snapshot
   */
  async captureSnapshot({ params, request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const enroll = await Enroll.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .firstOrFail()

    const photo = request.file('photo', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (!photo) {
      return response.badRequest({ message: 'No photo file uploaded' })
    }

    if (!photo.isValid) {
      return response.badRequest({ message: 'Invalid photo', errors: photo.errors })
    }

    const snapshotType = request.input('type', 'periodic') as 'initial' | 'periodic'
    const latitude = request.input('latitude', null)
    const longitude = request.input('longitude', null)

    const fileName = `${cuid()}.${photo.extname}`
    await photo.move(app.publicPath('uploads/snapshots'), { name: fileName })

    const snapshot = await ExamSnapshot.create({
      enrollId: enroll.id,
      photoUrl: `/uploads/snapshots/${fileName}`,
      snapshotType,
      latitude,
      longitude,
    })

    return response.ok({
      message: 'Snapshot captured successfully',
      snapshot,
    })
  }

  /**
   * Get all snapshots for an enrollment (admin/supervisor only)
   * GET /api/enrolls/:id/snapshots
   */
  async getSnapshots({ params, response }: HttpContext) {
    const snapshots = await ExamSnapshot.query()
      .where('enroll_id', params.id)
      .orderBy('created_at', 'desc')

    return response.ok(snapshots)
  }
}
