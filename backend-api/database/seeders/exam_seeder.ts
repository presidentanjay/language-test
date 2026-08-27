import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Exam from '#models/exam'
import Section from '#models/section'
import Question from '#models/question'
import Answer from '#models/answer'

export default class extends BaseSeeder {
  async run() {
    // 1. Create Exam
    const exam = await Exam.create({
      code: 'TOEFL-001',
      category: 'ept',
      title: 'TOEFL Prediction Test 1',
      activated: 'yes',
      status: 'publish',
    })

    // 2. Create Sections
    const structureSection = await Section.create({
      examId: exam.id,
      section: 'structure',
      title: 'Structure and Written Expression',
      description: 'Choose the correct answer.',
      duration: 25,
    })

    const readingSection = await Section.create({
      examId: exam.id,
      section: 'reading',
      title: 'Reading Comprehension',
      description: 'Read the passage and answer.',
      duration: 55,
    })

    // 3. Create Questions for Structure
    const q1 = await Question.create({
      sectionId: structureSection.id,
      question: 'The capital of Indonesia ___ Jakarta.',
      ordering: 1,
    })

    await Answer.createMany([
      { questionId: q1.id, answer: 'is', isCorrect: 'yes' },
      { questionId: q1.id, answer: 'are', isCorrect: 'no' },
      { questionId: q1.id, answer: 'am', isCorrect: 'no' },
      { questionId: q1.id, answer: 'were', isCorrect: 'no' },
    ])

    // 4. Create Questions for Reading
    const q2 = await Question.create({
      sectionId: readingSection.id,
      question: 'What is the main idea of the passage?',
      ordering: 1,
    })

    await Answer.createMany([
      { questionId: q2.id, answer: 'Idea A', isCorrect: 'yes' },
      { questionId: q2.id, answer: 'Idea B', isCorrect: 'no' },
      { questionId: q2.id, answer: 'Idea C', isCorrect: 'no' },
      { questionId: q2.id, answer: 'Idea D', isCorrect: 'no' },
    ])
  }
}
