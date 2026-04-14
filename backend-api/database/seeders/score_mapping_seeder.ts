import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ScoreMapping from '#models/score_mapping'

export default class ScoreMappingSeeder extends BaseSeeder {
  async run() {
    // ═══════════════════════════════════════════════════
    // EPT Score Mapping Reference Table
    // Tabel konversi Raw Score → Scaled Score
    // Section: Listening (50 soal), Structure (40 soal), Reading (50 soal)
    // ═══════════════════════════════════════════════════

    const listeningScores = [
      // rawScore: scaledScore
      { raw: 0, scaled: 31 },
      { raw: 1, scaled: 31 },
      { raw: 2, scaled: 31 },
      { raw: 3, scaled: 31 },
      { raw: 4, scaled: 31 },
      { raw: 5, scaled: 31 },
      { raw: 6, scaled: 31 },
      { raw: 7, scaled: 31 },
      { raw: 8, scaled: 31 },
      { raw: 9, scaled: 32 },
      { raw: 10, scaled: 33 },
      { raw: 11, scaled: 34 },
      { raw: 12, scaled: 35 },
      { raw: 13, scaled: 36 },
      { raw: 14, scaled: 38 },
      { raw: 15, scaled: 39 },
      { raw: 16, scaled: 40 },
      { raw: 17, scaled: 41 },
      { raw: 18, scaled: 42 },
      { raw: 19, scaled: 44 },
      { raw: 20, scaled: 44 },
      { raw: 21, scaled: 45 },
      { raw: 22, scaled: 45 },
      { raw: 23, scaled: 46 },
      { raw: 24, scaled: 46 },
      { raw: 25, scaled: 47 },
      { raw: 26, scaled: 47 },
      { raw: 27, scaled: 48 },
      { raw: 28, scaled: 49 },
      { raw: 29, scaled: 49 },
      { raw: 30, scaled: 50 },
      { raw: 31, scaled: 51 },
      { raw: 32, scaled: 51 },
      { raw: 33, scaled: 52 },
      { raw: 34, scaled: 52 },
      { raw: 35, scaled: 54 },
      { raw: 36, scaled: 55 },
      { raw: 37, scaled: 55 },
      { raw: 38, scaled: 57 },
      { raw: 39, scaled: 57 },
      { raw: 40, scaled: 58 },
      { raw: 41, scaled: 58 },
      { raw: 42, scaled: 59 },
      { raw: 43, scaled: 60 },
      { raw: 44, scaled: 61 },
      { raw: 45, scaled: 61 },
      { raw: 46, scaled: 63 },
      { raw: 47, scaled: 63 },
      { raw: 48, scaled: 65 },
      { raw: 49, scaled: 66 },
      { raw: 50, scaled: 68 },
    ]

    const structureScores = [
      { raw: 0, scaled: 31 },
      { raw: 1, scaled: 31 },
      { raw: 2, scaled: 31 },
      { raw: 3, scaled: 31 },
      { raw: 4, scaled: 31 },
      { raw: 5, scaled: 31 },
      { raw: 6, scaled: 31 },
      { raw: 7, scaled: 31 },
      { raw: 8, scaled: 31 },
      { raw: 9, scaled: 31 },
      { raw: 10, scaled: 31 },
      { raw: 11, scaled: 35 },
      { raw: 12, scaled: 37 },
      { raw: 13, scaled: 39 },
      { raw: 14, scaled: 40 },
      { raw: 15, scaled: 41 },
      { raw: 16, scaled: 42 },
      { raw: 17, scaled: 43 },
      { raw: 18, scaled: 44 },
      { raw: 19, scaled: 45 },
      { raw: 20, scaled: 46 },
      { raw: 21, scaled: 47 },
      { raw: 22, scaled: 47 },
      { raw: 23, scaled: 49 },
      { raw: 24, scaled: 50 },
      { raw: 25, scaled: 51 },
      { raw: 26, scaled: 52 },
      { raw: 27, scaled: 53 },
      { raw: 28, scaled: 54 },
      { raw: 29, scaled: 55 },
      { raw: 30, scaled: 55 },
      { raw: 31, scaled: 57 },
      { raw: 32, scaled: 59 },
      { raw: 33, scaled: 60 },
      { raw: 34, scaled: 61 },
      { raw: 35, scaled: 63 },
      { raw: 36, scaled: 65 },
      { raw: 37, scaled: 65 },
      { raw: 38, scaled: 67 },
      { raw: 39, scaled: 67 },
      { raw: 40, scaled: 68 },
    ]

    const readingScores = [
      { raw: 0, scaled: 31 },
      { raw: 1, scaled: 31 },
      { raw: 2, scaled: 31 },
      { raw: 3, scaled: 31 },
      { raw: 4, scaled: 31 },
      { raw: 5, scaled: 31 },
      { raw: 6, scaled: 31 },
      { raw: 7, scaled: 31 },
      { raw: 8, scaled: 31 },
      { raw: 9, scaled: 31 },
      { raw: 10, scaled: 31 },
      { raw: 11, scaled: 31 },
      { raw: 12, scaled: 34 },
      { raw: 13, scaled: 36 },
      { raw: 14, scaled: 37 },
      { raw: 15, scaled: 38 },
      { raw: 16, scaled: 40 },
      { raw: 17, scaled: 41 },
      { raw: 18, scaled: 42 },
      { raw: 19, scaled: 43 },
      { raw: 20, scaled: 45 },
      { raw: 21, scaled: 45 },
      { raw: 22, scaled: 46 },
      { raw: 23, scaled: 47 },
      { raw: 24, scaled: 48 },
      { raw: 25, scaled: 48 },
      { raw: 26, scaled: 49 },
      { raw: 27, scaled: 50 },
      { raw: 28, scaled: 50 },
      { raw: 29, scaled: 51 },
      { raw: 30, scaled: 52 },
      { raw: 31, scaled: 52 },
      { raw: 32, scaled: 53 },
      { raw: 33, scaled: 54 },
      { raw: 34, scaled: 55 },
      { raw: 35, scaled: 55 },
      { raw: 36, scaled: 55 },
      { raw: 37, scaled: 57 },
      { raw: 38, scaled: 57 },
      { raw: 39, scaled: 58 },
      { raw: 40, scaled: 59 },
      { raw: 41, scaled: 60 },
      { raw: 42, scaled: 61 },
      { raw: 43, scaled: 61 },
      { raw: 44, scaled: 63 },
      { raw: 45, scaled: 63 },
      { raw: 46, scaled: 65 },
      { raw: 47, scaled: 65 },
      { raw: 48, scaled: 67 },
      { raw: 49, scaled: 67 },
      { raw: 50, scaled: 67 },
    ]

    // Clear existing EPT mappings
    await ScoreMapping.query().where('category', 'ept').delete()

    // Insert Listening mappings
    for (const score of listeningScores) {
      await ScoreMapping.create({
        category: 'ept',
        sectionType: 'listening',
        rawScore: score.raw,
        scaledScore: score.scaled,
      })
    }
    console.log(`✅ Listening: ${listeningScores.length} mappings inserted (raw 0-50)`)

    // Insert Structure mappings
    for (const score of structureScores) {
      await ScoreMapping.create({
        category: 'ept',
        sectionType: 'structure',
        rawScore: score.raw,
        scaledScore: score.scaled,
      })
    }
    console.log(`✅ Structure: ${structureScores.length} mappings inserted (raw 0-40)`)

    // Insert Reading mappings
    for (const score of readingScores) {
      await ScoreMapping.create({
        category: 'ept',
        sectionType: 'reading',
        rawScore: score.raw,
        scaledScore: score.scaled,
      })
    }
    console.log(`✅ Reading: ${readingScores.length} mappings inserted (raw 0-50)`)

    const total = listeningScores.length + structureScores.length + readingScores.length
    console.log(`\n🎯 Total: ${total} EPT score mappings seeded successfully!`)
  }
}
