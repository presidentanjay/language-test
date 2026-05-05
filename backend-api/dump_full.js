import fs from 'node:fs/promises'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pdf = require('pdf-parse')

async function run() {
    try {
        const buffer = await fs.readFile('./test_reading.pdf')
        const data = await pdf(buffer)
        await fs.writeFile('full_raw_text.txt', data.text)
        console.log('Saved to full_raw_text.txt')
    } catch (err) {
        console.error('Error:', err)
    }
}

run()
