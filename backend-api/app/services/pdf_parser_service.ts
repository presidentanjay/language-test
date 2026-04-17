import { PDFParse } from 'pdf-parse'

export default class PdfParserService {
    /**
     * Parse PDF buffer and extract questions and answers.
     * Supports two formats for marking correct answers:
     * 1. Inline "(Benar)" marker next to the correct option
     * 2. Separate "ANSWER:" section at the end with format "1. B", "2. C", etc.
     */
    public async parse(buffer: Buffer) {
        // Instantiate the PDFParse class (v2.4.5+)
        const pdfParser = new PDFParse({ data: buffer })
        const result = await pdfParser.getText()
        const text = result.text

        // 1. Check if there's an ANSWER section and extract the answer key map
        const answerKeyMap = this.extractAnswerKeys(text)

        // 2. Separate the question content from the answer section
        const questionContent = this.getQuestionContent(text)

        // 3. Split text into potential question blocks
        // This regex looks for a number followed by a dot at the start of a line
        const questionBlocks = questionContent.split(/\n\s*(?=\d+\.)/g)
        const extractedQuestions: any[] = []

        for (const block of questionBlocks) {
            const trimmedBlock = block.trim()
            if (!trimmedBlock) continue

            // 4. Extract Question Number and Text
            // Matches from start until it sees "A." or "A)" or similar
            const questionMatch = trimmedBlock.match(/^(\d+)[\.\)]\s*([\s\S]+?)(?=\n\s*[A-D][\.\)])/i)
            if (!questionMatch) continue

            const questionNumber = parseInt(questionMatch[1])
            const questionText = questionMatch[2].trim()

            // 5. Extract Options and Answers
            // Look for A., B., C., D. patterns
            const options: any[] = []
            const optionRegex = /\n\s*([A-D])[\.\)]\s*([\s\S]+?)(?=\n\s*[A-D][\.\)]|$)/gi
            let m
            while ((m = optionRegex.exec(trimmedBlock)) !== null) {
                const optionLetter = m[1].toUpperCase()
                const answerText = m[2].trim()

                // Determine if correct: use answer key map first, then fall back to "(Benar)" marker
                let isCorrect = false
                if (answerKeyMap.size > 0 && answerKeyMap.has(questionNumber)) {
                    isCorrect = answerKeyMap.get(questionNumber) === optionLetter
                } else {
                    isCorrect = answerText.toLowerCase().includes('(benar)')
                }

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

    /**
     * Extract answer keys from a separate ANSWER section at the end of the PDF.
     * Supports formats like:
     *   ANSWER:
     *   1. B
     *   2. C
     *   3. A
     * Also handles multi-column layouts where keys appear on the same line:
     *   1. B    16. C
     *   2. C    17. B
     */
    private extractAnswerKeys(text: string): Map<number, string> {
        const keyMap = new Map<number, string>()

        // Find the ANSWER section (case-insensitive, supports "ANSWER:", "ANSWER KEY:", "ANSWERS:", "KUNCI JAWABAN:")
        const answerSectionMatch = text.match(/\n\s*(ANSWER(?:\s*KEY)?S?|KUNCI\s*JAWABAN)\s*:?\s*\n([\s\S]+)/i)
        if (!answerSectionMatch) return keyMap

        const answerSection = answerSectionMatch[2]

        // Match all answer key entries: "1. B", "1.B", "1) B", "1. b", etc.
        const keyRegex = /(\d+)\s*[\.\)]\s*([A-D])\b/gi
        let match
        while ((match = keyRegex.exec(answerSection)) !== null) {
            const num = parseInt(match[1])
            const letter = match[2].toUpperCase()
            keyMap.set(num, letter)
        }

        return keyMap
    }

    /**
     * Get only the question content, excluding the ANSWER section
     */
    private getQuestionContent(text: string): string {
        // Remove everything from the ANSWER section onwards
        const cleaned = text.replace(/\n\s*(ANSWER(?:\s*KEY)?S?|KUNCI\s*JAWABAN)\s*:?\s*\n[\s\S]+/i, '')
        return cleaned
    }
}
