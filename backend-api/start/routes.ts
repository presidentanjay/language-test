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
const UploadController = () => import('#controllers/upload_controller')
const SectionAudiosController = () => import('#controllers/section_audios_controller')
const SnapshotController = () => import('#controllers/snapshot_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Public certificate verification (no auth required)
router.get('/api/verify/:token', [CertificateController, 'verify'])

// Public Midtrans notification
router.post('/api/payments/notification', [() => import('#controllers/payments_controller'), 'handleNotification'])

// SSO Routes (public)
router.get('/api/sso/redirect', [() => import('#controllers/sso_controller'), 'redirect'])
router.get('/api/sso/callback', [() => import('#controllers/sso_controller'), 'callback'])
router.get('/api/sso/status', [() => import('#controllers/sso_controller'), 'status'])

router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])

    const PasswordResetsController = () => import('#controllers/password_resets_controller')
    router.post('forgot-password', [PasswordResetsController, 'forgotPassword'])
    router.post('reset-password', [PasswordResetsController, 'resetPassword'])

    router.post('logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('me', [AuthController, 'me']).use(middleware.auth())
    router.put('me/profile', [AuthController, 'updateProfile']).use(middleware.auth())
    router.put('me/password', [AuthController, 'updatePassword']).use(middleware.auth())

    // ─── ADMIN-ONLY ROUTES ───
    // These require authentication + admin/supervisor role
    router
      .group(() => {
        router.resource('users', '#controllers/users_controller').apiOnly()
        router.resource('exams', ExamsController).apiOnly().except(['index', 'show'])
        router.resource('sections', SectionsController).apiOnly()
        router.post('notifications/send-reminder/:id', [() => import('#controllers/notifications_controller'), 'triggerReminder'])
        router.post('sections/:id/bulk-questions', [SectionsController, 'bulkStoreQuestions'])
        router.post('sections/:id/import-bank', [SectionsController, 'importFromBank'])
        router.get('sections/:sectionId/audios', [SectionAudiosController, 'index'])
        router.post('sections/:sectionId/audios', [SectionAudiosController, 'store'])
        router.delete('section-audios/:id', [SectionAudiosController, 'destroy'])
        router.resource('questions', QuestionsController).apiOnly()
        router.resource('bank-soal', QuestionBanksController)
        router.post('bank-packages/:id/bulk-upload', [BankPackagesController, 'bulkUpload'])
        router.resource('bank-packages', BankPackagesController)
        router.post('score-mappings', [ScoreMappingsController, 'store'])
        router.get('monitoring', [ExamFlowsController, 'monitoring'])
        router.get('dashboard/stats', [DashboardController, 'stats'])
        router.get('dashboard/analytics', [DashboardController, 'analytics'])
        router.get('reports/participants', [ReportController, 'getParticipantScores'])
        router.get('reports/participants/export', [ReportController, 'exportCsv'])
        router.post('upload/audio', [UploadController, 'store'])
        router.get('enrolls/:id/snapshots', [SnapshotController, 'getSnapshots'])
        router.get('settings', [() => import('#controllers/settings_controller'), 'index'])
        router.post('settings', [() => import('#controllers/settings_controller'), 'update'])
        router.get('payments', [() => import('#controllers/payments_controller'), 'index'])
      })
      .use([middleware.auth(), middleware.role(['admin', 'supervisor'])])

    // Secure Audio serving
    router
      .get('secure-audio/*', [UploadController, 'serveAudio'])
      .as('audio.serve')
      .use(middleware.auth())

    // ─── STUDENT / SHARED ROUTES ───
    // These only require authentication (any logged-in user)
    router
      .group(() => {
        // Exam listing (students need to see available exams)
        router.get('exams', [ExamsController, 'index'])
        router.get('exams/:id', [ExamsController, 'show'])

        // Exam Testing Flow
        router.post('exams/:id/enroll', [ExamFlowsController, 'enroll'])
        router.get('enrolls/:id/questions', [ExamFlowsController, 'getQuestions'])
        router.post('enrolls/:id/submit', [ExamFlowsController, 'submitAnswer'])
        router.post('enrolls/:id/finish', [ExamFlowsController, 'finish'])
        router.post('enrolls/:id/reset', [ExamFlowsController, 'reset'])
        router.post('enrolls/:id/block', [ExamFlowsController, 'block'])
        router.post('enrolls/:id/unblock', [ExamFlowsController, 'unblock'])
        router.get('enrolls/:id/result', [ExamFlowsController, 'getResult'])

        // Score Mappings (read-only for students)
        router.get('score-mappings/:category', [ScoreMappingsController, 'show'])

        // My Scores & Certificates
        router.get('reports/me', [ReportController, 'getMyScores'])
        router.get('certificates/:id', [CertificateController, 'show'])

        // Anti-Joki: Identity & Snapshot
        router.post('me/upload-identity', [SnapshotController, 'uploadIdentity'])
        router.post('enrolls/:id/snapshot', [SnapshotController, 'captureSnapshot'])

        const PaymentsController = () => import('#controllers/payments_controller')
        router.post('payments/create', [PaymentsController, 'createTransaction'])
        router.get('payments/me', [PaymentsController, 'myPayments'])
        router.get('payments/check/:examCode', [PaymentsController, 'checkPayment'])
      })
      .use(middleware.auth())
  })
  .prefix('api')
