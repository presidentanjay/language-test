import type { HttpContext } from '@adonisjs/core/http'
import ScoreMapping from '#models/score_mapping'
import { bulkScoreMappingValidator } from '#validators/index'

export default class ScoreMappingsController {
    /**
     * Get all score mappings
     */
    async index({ response }: HttpContext) {
        const mappings = await ScoreMapping.all()
        return response.ok(mappings)
    }

    /**
     * Get mappings by category
     */
    async show({ params, response }: HttpContext) {
        const { category } = params

        const mappings = await ScoreMapping.query()
            .where('category', category)
            .orderBy('sectionType', 'asc')
            .orderBy('rawScore', 'asc')

        return response.ok(mappings)
    }

    /**
     * Create or update mappings (Bulk)
     */
    async store({ request, response }: HttpContext) {
        const { mappings } = await request.validateUsing(bulkScoreMappingValidator)

        // Process in transaction if possible, but for now simple loop
        for (const mapping of mappings) {
            await ScoreMapping.updateOrCreate(
                {
                    category: mapping.category,
                    sectionType: mapping.sectionType,
                    rawScore: mapping.rawScore
                },
                {
                    scaledScore: mapping.scaledScore
                }
            )
        }

        return response.created({ message: 'Mappings updated successfully' })
    }
}