import { PDFParse } from 'pdf-parse'

export default class PdfParserService {
    /**
     * Parse PDF buffer and extract questions and answers
     */
    public async parse(buffer: Buffer) {
        // Instantiate the PDFParse class (v2.4.5+)
        const pdfParser = new PDFParse({ data: buffer })
        const result = await pdfParser.getText()
        const text = result.text

        // 1. Split text into potential question blocks
        // This regex looks for a number followed by a dot at the start of a line
        const questionBlocks = text.split(/\n\s*(?=\d+\.)/g)
        const extractedQuestions: any[] = []

        for (const block of questionBlocks) {
            const trimmedBlock = block.trim()
            if (!trimmedBlock) continue

            // 2. Extract Question Text
            // Matches from start until it sees "A." or "A)" or similar
            const questionMatch = trimmedBlock.match(/^(\d+\.)\s*([\s\S]+?)(?=\n\s*[A-D][\.\)])/i)
            if (!questionMatch) continue

            const questionText = questionMatch[2].trim()

            // 3. Extract Options and Answers
            // Look for A., B., C., D. patterns
            const options: any[] = []
            const optionRegex = /\n\s*([A-D])[\.\)]\s*([\s\S]+?)(?=\n\s*[A-D][\.\)]|$)/gi
            let m
            while ((m = optionRegex.exec(trimmedBlock)) !== null) {
                const answerText = m[2].trim()
                // Robust check for "(Benar)" marker
                const isCorrect = answerText.toLowerCase().includes('(benar)')

                options.push({
                    answer_text: answerText.replace(/\(benar\)/i, '').trim(),
                    is_correct: isCorrect ? 'yes' : 'no'
                })
            }

            if (options.length >= 2) {
                // Ensure at least one is correct if user forgot to mark it
                const hasCorrect = options.some(opt => opt.is_correct === 'yes')
                if (!hasCorrect) options[0].is_correct = 'yes'

                extractedQuestions.push({
                    question_text: questionText,
                    answers: options
                })
            }
        }

        return extractedQuestions
    }
}
