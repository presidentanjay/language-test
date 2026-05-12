import vine from '@vinejs/vine'

/**
 * ─── AUTH VALIDATORS ───
 */
export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().trim().email().maxLength(255),
    password: vine.string().minLength(6).maxLength(128),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string(),
  })
)

/**
 * ─── EXAM VALIDATORS ───
 */
export const createExamValidator = vine.compile(
  vine.object({
    code: vine.string().trim().minLength(1).maxLength(50),
    category: vine.enum(['ept', 'toeic']),
    title: vine.string().trim().minLength(1).maxLength(255),
    firstDate: vine.string().optional(),
    secondDate: vine.string().optional(),
    thirdDate: vine.string().optional(),
    fourthDate: vine.string().optional(),
    firstTime: vine.string().optional(),
    secondTime: vine.string().optional(),
    thirdTime: vine.string().optional(),
    fourthTime: vine.string().optional(),
    conferenceLink: vine.string().optional(),
    activated: vine.enum(['yes', 'no']).optional(),
    status: vine.enum(['publish', 'progress']).optional(),
  })
)

export const updateExamValidator = vine.compile(
  vine.object({
    code: vine.string().trim().minLength(1).maxLength(50).optional(),
    category: vine.enum(['ept', 'toeic']).optional(),
    title: vine.string().trim().minLength(1).maxLength(255).optional(),
    firstDate: vine.string().optional(),
    secondDate: vine.string().optional(),
    thirdDate: vine.string().optional(),
    fourthDate: vine.string().optional(),
    firstTime: vine.string().optional(),
    secondTime: vine.string().optional(),
    thirdTime: vine.string().optional(),
    fourthTime: vine.string().optional(),
    conferenceLink: vine.string().optional(),
    activated: vine.enum(['yes', 'no']).optional(),
    status: vine.enum(['publish', 'progress']).optional(),
  })
)

/**
 * ─── SECTION VALIDATORS ───
 */
export const createSectionValidator = vine.compile(
  vine.object({
    examId: vine.number(),
    section: vine.string().trim().minLength(1).maxLength(100),
    title: vine.string().trim().maxLength(255).optional(),
    description: vine.string().trim().optional(),
    audio: vine.string().trim().optional(),
    duration: vine.number().positive().optional(),
  })
)

export const updateSectionValidator = vine.compile(
  vine.object({
    section: vine.string().trim().minLength(1).maxLength(100).optional(),
    title: vine.string().trim().maxLength(255).optional(),
    description: vine.string().trim().optional(),
    audio: vine.string().trim().optional(),
    duration: vine.number().positive().optional(),
  })
)

/**
 * ─── QUESTION VALIDATORS ───
 */
const answerSchema = vine.object({
  answer: vine.string().trim().minLength(1),
  is_correct: vine.enum(['yes', 'no']).optional(),
})

const questionWithAnswersSchema = vine.object({
  question: vine.string().trim().minLength(1),
  audio: vine.string().trim().optional(),
  direction: vine.string().trim().optional(),
  ordering: vine.number().optional(),
  answers: vine.array(answerSchema).minLength(2).maxLength(6),
})

export const bulkQuestionsValidator = vine.compile(
  vine.object({
    questions: vine.array(questionWithAnswersSchema).minLength(1),
  })
)

/**
 * ─── EXAM FLOW VALIDATORS ───
 */
export const submitAnswerValidator = vine.compile(
  vine.object({
    question_id: vine.number().positive(),
    answer_id: vine.number().positive(),
  })
)

export const bulkScoreMappingValidator = vine.compile(
  vine.object({
    mappings: vine.array(
      vine.object({
        category: vine.enum(['ept', 'toeic']),
        sectionType: vine.string().trim().minLength(1),
        rawScore: vine.number().min(0),
        scaledScore: vine.number().min(0),
      })
    ).minLength(1),
  })
)

/**
 * ─── QUESTION BANK VALIDATORS ───
 */
const bankAnswerSchema = vine.object({
  answer_text: vine.string().trim().minLength(1),
  is_correct: vine.enum(['yes', 'no']).optional(),
})

export const createQuestionBankValidator = vine.compile(
  vine.object({
    bank_package_id: vine.number().positive(),
    question_text: vine.string().trim().minLength(1),
    direction: vine.string().trim().optional(),
    audio: vine.string().trim().optional(),
    answers: vine.array(bankAnswerSchema).minLength(2).maxLength(6).optional(),
  })
)

export const updateQuestionBankValidator = vine.compile(
  vine.object({
    bank_package_id: vine.number().positive().optional(),
    question_text: vine.string().trim().minLength(1).optional(),
    direction: vine.string().trim().optional(),
    audio: vine.string().trim().optional(),
    answers: vine.array(bankAnswerSchema).minLength(2).maxLength(6).optional(),
  })
)

/**
 * ─── USER VALIDATORS ───
 */
export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    email: vine.string().trim().email().maxLength(255).optional(),
    role: vine.enum(['admin', 'supervisor', 'test_taker']).optional(),
    picture: vine.string().trim().optional(),
  })
)
