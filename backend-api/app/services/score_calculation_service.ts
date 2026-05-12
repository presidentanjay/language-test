import Submission from '#models/submission'
import ScoreMapping from '#models/score_mapping'
import Enroll from '#models/enroll'

export interface SectionalScores {
  listening: number
  structure: number
  reading: number
  overall: number
}

export default class ScoreCalculationService {
  /**
   * Calculate EPT or TOEIC scores for a given enrollment
   */
  static async calculate(enroll: Enroll): Promise<SectionalScores> {
    const submissions = await Submission.query()
      .where('enroll_id', enroll.id)
      .where('is_correct', 'yes')
      .preload('question', (q) => {
        q.preload('section')
      })

    if (enroll.for === 'ept') {
      return await this.calculateEPT(submissions)
    } else {
      // TOEIC or others just return raw count for now as per existing logic
      return {
        listening: 0,
        structure: 0,
        reading: 0,
        overall: submissions.length,
      }
    }
  }

  private static async calculateEPT(submissions: Submission[]): Promise<SectionalScores> {
    const counts = {
      listening: 0,
      structure: 0,
      reading: 0,
    }

    for (const sub of submissions) {
      if (!sub.question || !sub.question.section) continue

      const sectionBadge = sub.question.section.section.toLowerCase()
      const sectionTitle = (sub.question.section.title || '').toLowerCase()

      // Unified detection logic with fallbacks
      const isListening =
        sectionBadge.includes('listening') ||
        sectionTitle.includes('listening') ||
        sectionBadge === 'pkt-a'
      const isStructure =
        sectionBadge.includes('structure') ||
        sectionTitle.includes('structure') ||
        sectionBadge === 'pkt-b'
      const isReading =
        sectionBadge.includes('reading') ||
        sectionTitle.includes('reading') ||
        sectionBadge === 'pkt-c'

      if (isListening) counts.listening++
      else if (isStructure) counts.structure++
      else if (isReading) counts.reading++
    }

    const getScaledScore = async (section: string, raw: number) => {
      const mapping = await ScoreMapping.query()
        .where('category', 'ept')
        .where('sectionType', section)
        .where('rawScore', raw)
        .first()
      return mapping ? mapping.scaledScore : 0
    }

    const listening = await getScaledScore('listening', counts.listening)
    const structure = await getScaledScore('structure', counts.structure)
    const reading = await getScaledScore('reading', counts.reading)

    const overall = Math.round(((listening + structure + reading) * 10) / 3)

    return {
      listening,
      structure,
      reading,
      overall,
    }
  }
}
