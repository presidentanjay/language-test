/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const SectionsController = () => import('#controllers/sections_controller')
const QuestionsController = () => import('#controllers/questions_controller')
const ExamsController = () => import('#controllers/exams_controller')
const ExamFlowsController = () => import('#controllers/exam_flows_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const BankPackagesController = () => import('#controllers/bank_packages_controller')
const QuestionBanksController = () => import('#controllers/question_banks_controller')
const ScoreMappingsController = () => import('#controllers/score_mappings_controller')
const ReportController = () => import('#controllers/report_controller')
const CertificateController = () => import('#controllers/certificate_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(() => {
  router.post('register', [AuthController, 'register'])
  router.post('login', [AuthController, 'login'])
  router.post('logout', [AuthController, 'logout']).use(middleware.auth())
  router.get('me', [AuthController, 'me']).use(middleware.auth())

  router.resource('users', '#controllers/users_controller').apiOnly().use('*', middleware.auth())
  // ... existing routes ...
  router.resource('exams', ExamsController).apiOnly().use(['store', 'update', 'destroy'], middleware.auth())
  router.resource('sections', SectionsController).apiOnly().use(['store', 'update', 'destroy'], middleware.auth())
  router.post('sections/:id/bulk-questions', [SectionsController, 'bulkStoreQuestions']).use(middleware.auth())
  router.resource('questions', QuestionsController).apiOnly().use('*', middleware.auth())

  // Exam Testing Flow
  router.post('exams/:id/enroll', [ExamFlowsController, 'enroll']).use(middleware.auth())
  router.get('enrolls/:id/questions', [ExamFlowsController, 'getQuestions']).use(middleware.auth())
  router.post('enrolls/:id/submit', [ExamFlowsController, 'submitAnswer']).use(middleware.auth())
  router.post('enrolls/:id/finish', [ExamFlowsController, 'finish']).use(middleware.auth())
  router.get('enrolls/:id/result', [ExamFlowsController, 'getResult']).use(middleware.auth())
  router.get('monitoring', [ExamFlowsController, 'monitoring']).use(middleware.auth())
  router.get('dashboard/stats', [DashboardController, 'stats']).use(middleware.auth())
  router.resource('bank-soal', QuestionBanksController).use('*', middleware.auth())
  router.post('bank-packages/:id/bulk-upload', [BankPackagesController, 'bulkUpload']).use(middleware.auth())
  router.resource('bank-packages', BankPackagesController).use('*', middleware.auth())

  // Score Mappings
  router.get('score-mappings/:category', [ScoreMappingsController, 'show']).use(middleware.auth())
  router.post('score-mappings', [ScoreMappingsController, 'store']).use(middleware.auth())

  // Reports
  router.get('reports/participants', [ReportController, 'getParticipantScores']).use(middleware.auth())
  router.get('reports/me', [ReportController, 'getMyScores']).use(middleware.auth())

  // Certificates
  router.get('certificates/:id', [CertificateController, 'show']).use(middleware.auth())
}).prefix('api')
