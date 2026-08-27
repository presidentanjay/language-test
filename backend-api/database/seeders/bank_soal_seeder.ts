import { BaseSeeder } from '@adonisjs/lucid/seeders'
import QuestionBank from '#models/question_bank'
import BankAnswer from '#models/bank_answer'
import BankPackage from '#models/bank_package'

export default class extends BaseSeeder {
  async run() {
    // 1. Create Packages first
    const packages = await BankPackage.createMany([
      {
        name: 'Paket A - Listening',
        category: 'listening',
        duration: 35,
        description: 'Standard listening package for TOEFL/EPT',
      },
      {
        name: 'Paket A - Structure',
        category: 'structure',
        duration: 25,
        description: 'Standard structure and written expression',
      },
      {
        name: 'Paket B - Reading',
        category: 'reading',
        duration: 55,
        description: 'Advanced reading comprehension package',
      },
    ])

    const pkgA_Listening = packages[0]
    const pkgA_Structure = packages[1]
    const pkgB_Reading = packages[2]

    // 2. Add Questions to Packages

    // Listening Qs
    const q1 = await QuestionBank.create({
      bankPackageId: pkgA_Listening.id,
      questionText: 'What is the main topic of the conversation regarding the new laboratory?',
    })
    await BankAnswer.createMany([
      {
        questionBankId: q1.id,
        answerText: 'The schedule of the opening ceremony',
        isCorrect: 'no',
      },
      {
        questionBankId: q1.id,
        answerText: 'The modern equipment being installed',
        isCorrect: 'yes',
      },
      { questionBankId: q1.id, answerText: 'The budget for the construction', isCorrect: 'no' },
      { questionBankId: q1.id, answerText: 'The location of the building', isCorrect: 'no' },
    ])

    // Structure Qs
    const q2 = await QuestionBank.create({
      bankPackageId: pkgA_Structure.id,
      questionText: 'The results of the study ___ published in the journal next month.',
    })
    await BankAnswer.createMany([
      { questionBankId: q2.id, answerText: 'will be', isCorrect: 'yes' },
      { questionBankId: q2.id, answerText: 'was', isCorrect: 'no' },
      { questionBankId: q2.id, answerText: 'been', isCorrect: 'no' },
      { questionBankId: q2.id, answerText: 'is', isCorrect: 'no' },
    ])

    // Reading Qs
    const q3 = await QuestionBank.create({
      bankPackageId: pkgB_Reading.id,
      questionText: 'The word "significant" in line 15 is closest in meaning to:',
    })
    await BankAnswer.createMany([
      { questionBankId: q3.id, answerText: 'Small', isCorrect: 'no' },
      { questionBankId: q3.id, answerText: 'Important', isCorrect: 'yes' },
      { questionBankId: q3.id, answerText: 'Unclear', isCorrect: 'no' },
      { questionBankId: q3.id, answerText: 'Hidden', isCorrect: 'no' },
    ])
  }
}
