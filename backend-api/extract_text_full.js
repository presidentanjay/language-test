import fs from 'node:fs/promises'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pdf = require('pdf-parse')

async function run() {
    try {
        const buffer = await fs.readFile('./test_reading.pdf')
        const data = await pdf(buffer)
        await fs.writeFile('pdf_text_dump.txt', data.text)
        console.log('PDF text dumped to pdf_text_dump.txt')
    } catch (err) {
        console.error('Error:', err)
    }
}

run()
