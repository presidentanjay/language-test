import { BaseCommand } from '@adonisjs/core/ace'
import fs from 'node:fs/promises'
import PdfParserService from '#services/pdf_parser_service'

export default class TestParser extends BaseCommand {
  static commandName = 'test:parser'
  async run() {
    const buffer = await fs.readFile('./test_reading.pdf')
    const parser = new PdfParserService()
    const questions = await parser.parse(buffer)
    
    for (let i = 30; i < 40; i++) {
        const q = questions[i]
        console.log(`\n--- Q${i + 1} ---`)
        console.log(`Text: ${q.question_text}`)
        console.log(`Direction: ${q.direction ? q.direction.substring(0, 50).replace(/\n/g, ' ') : 'NONE'}`)
    }
  }
}
