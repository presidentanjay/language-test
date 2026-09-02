# 🎓 CBT Platform — Lembaga Bahasa Universitas Widyatama

> Sistem ujian berbasis komputer (_Computer Based Test_) untuk English Proficiency Test (EPT) dengan fitur pengawasan AI, monitoring real-time, dan manajemen soal terintegrasi.

![Tech Stack](https://img.shields.io/badge/AdonisJS_6-Backend-5A45FF?style=flat-square) ![Tech Stack](https://img.shields.io/badge/Next.js_16-Frontend-000000?style=flat-square) ![Tech Stack](https://img.shields.io/badge/React_19+Vite-CMS_Admin-61DAFB?style=flat-square) ![Tech Stack](https://img.shields.io/badge/MySQL_8-Database-4479A1?style=flat-square)

---

## 📋 Daftar Isi

- [Arsitektur Sistem](#-arsitektur-sistem)
- [Tech Stack](#-tech-stack)
- [Prasyarat](#-prasyarat)
- [Instalasi & Setup](#-instalasi--setup)
- [Akun Default](#-akun-default)
- [Struktur Proyek](#-struktur-proyek)
- [API Endpoints](#-api-endpoints)
- [Fitur Utama](#-fitur-utama)
- [Deployment (Docker)](#-deployment-docker)
- [Backup Database](#-backup-database)
- [Panduan Pengembangan](#-panduan-pengembangan)

---

## 🏗 Arsitektur Sistem

```
┌───────────────────────────────────────────────────────┐
│                    BROWSER / CLIENT                   │
├──────────────────────┬────────────────────────────────┤
│  Frontend (Next.js)  │     CMS Admin (Vite+React)    │
│  Port: 3000          │     Port: 5173                │
│  Peserta / Mahasiswa │     Admin / Pengawas           │
└──────────┬───────────┴──────────────┬─────────────────┘
           │         REST API         │
           ▼                          ▼
┌───────────────────────────────────────────────────────┐
│              Backend API (AdonisJS 6)                 │
│              Port: 3333                               │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌─────────┐ │
│  │  Auth   │ │ Exam     │ │ Anti-Cheat│ │ Reports │ │
│  │ (JWT +  │ │ Engine   │ │ (AI Face  │ │ & Score │ │
│  │ Cookie) │ │ & Timer  │ │ Detector) │ │ Mapping │ │
│  └─────────┘ └──────────┘ └───────────┘ └─────────┘ │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌─────────┐ │
│  │  Rate   │ │ Shield   │ │ WebSocket │ │  Mail   │ │
│  │ Limiter │ │ (Headers)│ │ (SSE)     │ │ (SMTP)  │ │
│  └─────────┘ └──────────┘ └───────────┘ └─────────┘ │
└───────────────────────┬───────────────────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │   MySQL 8.0      │
              │   Port: 3306     │
              └──────────────────┘
```

---

## 🛠 Tech Stack

| Layer        | Teknologi                                               |
| ------------ | ------------------------------------------------------- |
| **Backend**  | AdonisJS 6, Lucid ORM, VineJS Validator, JWT (HttpOnly) |
| **Frontend** | Next.js 16 (App Router), Tailwind CSS 4, Framer Motion  |
| **CMS**      | React 19, Vite 7, React Router 7, Tailwind CSS 4        |
| **Database** | MySQL 8.0                                               |
| **Keamanan** | @adonisjs/shield, @adonisjs/limiter, HttpOnly Cookies   |
| **Realtime** | @adonisjs/transmit (Server-Sent Events)                 |
| **Email**    | @adonisjs/mail (SMTP)                                   |
| **Deploy**   | Docker + Docker Compose + Nginx                         |

---

## 📦 Prasyarat

Pastikan perangkat lunak berikut sudah terinstal:

- **Node.js** v20+ → [Download](https://nodejs.org)
- **MySQL** 8.0+ → [Download](https://dev.mysql.com/downloads/)
- **Git** → [Download](https://git-scm.com)
- **npm** (sudah bawaan Node.js)

Untuk deployment:

- **Docker** & **Docker Compose** → [Download](https://www.docker.com)

---

## 🚀 Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/presidentanjay/language-test.git
cd language-test
```

### 2. Setup Backend API

```bash
cd backend-api

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env sesuai konfigurasi lokal Anda:
# - DB_HOST=127.0.0.1
# - DB_PORT=3306
# - DB_USER=root
# - DB_PASSWORD=password
# - DB_DATABASE=app
# - APP_KEY=<generate dengan: node ace generate:key>

# Generate APP_KEY
node ace generate:key

# Jalankan migration (buat tabel di database)
node ace migration:run

# Jalankan seeder (buat data awal)
node ace db:seed

# Start development server
npm run dev
```

> Backend berjalan di `http://localhost:3333`

### 3. Setup Frontend (Portal Mahasiswa)

```bash
cd frontend-toefl
npm install
npm run dev
```

> Frontend berjalan di `http://localhost:3000`

### 4. Setup CMS Admin (Dashboard Admin)

```bash
cd cms-admin
npm install
npm run dev
```

> CMS Admin berjalan di `http://localhost:5173`

### 5. Jalankan Semua Sekaligus (Opsional)

Dari root directory:

```bash
npm install
npm run dev:all
```

> ⚠️ **PENTING:** Jangan login sebagai Admin dan Peserta di browser yang sama! Gunakan browser berbeda (misal: Chrome untuk CMS Admin, Safari untuk Portal Mahasiswa) karena cookie `auth_token` akan bertabrakan.

---

## 👤 Akun Default

Setelah menjalankan `node ace db:seed`, akun berikut akan tersedia:

| Role         | Email                | Password   | Akses                |
| ------------ | -------------------- | ---------- | -------------------- |
| **Admin**    | `admin@gmail.com`    | `password` | CMS Admin (Full)     |
| **Pengawas** | `pengawas@gmail.com` | `password` | CMS Admin (Terbatas) |
| **Peserta**  | `peserta@gmail.com`  | `password` | Portal Mahasiswa     |

---

## 📁 Struktur Proyek

```
language-test/
├── backend-api/                    # AdonisJS 6 REST API
│   ├── app/
│   │   ├── controllers/            # 17 controller (auth, exam, snapshot, dll)
│   │   ├── models/                 # 16 model Lucid ORM
│   │   ├── middleware/             # Auth, Role, Cookie middleware
│   │   └── validators/            # VineJS request validation
│   ├── config/                     # Konfigurasi (database, auth, shield, mail, limiter)
│   ├── database/
│   │   ├── migrations/             # 28 migration file
│   │   └── seeders/                # 4 seeder (user, exam, bank soal, score mapping)
│   ├── start/
│   │   ├── routes.ts               # Semua API routes
│   │   ├── kernel.ts               # Middleware stack
│   │   └── limiter.ts              # Rate limiting rules
│   └── public/uploads/             # Upload storage (audio, snapshot, foto)
│
├── frontend-toefl/                 # Next.js 16 Portal Mahasiswa
│   ├── app/
│   │   ├── page.tsx                # Landing page
│   │   ├── login/                  # Halaman login
│   │   ├── register/               # Halaman registrasi
│   │   ├── forgot-password/        # Lupa password
│   │   ├── reset-password/         # Reset password
│   │   ├── dashboard/              # Dashboard peserta & riwayat ujian
│   │   ├── prep/[examId]/          # Persiapan ujian & verifikasi wajah
│   │   ├── test/[enrollId]/        # Engine ujian CBT (live test)
│   │   └── result/[enrollId]/      # Hasil ujian & sertifikat PDF
│   ├── components/
│   │   ├── SelfieGate.tsx          # Verifikasi wajah + kebijakan ujian
│   │   └── Navbar.tsx              # Navigasi utama
│   └── lib/
│       └── axios.ts                # Axios instance (withCredentials)
│
├── cms-admin/                      # React + Vite CMS Dashboard
│   ├── src/
│   │   ├── pages/                  # 11 halaman CMS
│   │   ├── layouts/AdminLayout.tsx # Sidebar + top bar layout
│   │   ├── context/AuthContext.tsx  # Auth state management
│   │   └── lib/axios.ts            # Axios instance CMS
│   └── index.html
│
├── docker-compose.yml              # Orkestrasi Docker (MySQL + 3 apps)
├── backup.sh                       # Script backup database otomatis
└── README.md                       # Dokumentasi ini
```

---

## 🔌 API Endpoints

### Autentikasi (Public)

| Method | Endpoint               | Deskripsi                  | Rate Limited |
| ------ | ---------------------- | -------------------------- | ------------ |
| POST   | `/api/register`        | Registrasi akun baru       | ✅           |
| POST   | `/api/login`           | Login & dapat cookie token | ✅           |
| POST   | `/api/forgot-password` | Kirim email reset password | ✅           |
| POST   | `/api/reset-password`  | Reset password via token   | ✅           |
| POST   | `/api/logout`          | Logout & hapus cookie      | —            |
| GET    | `/api/me`              | Profil user yang login     | —            |

### Admin & Pengawas (Butuh role: admin/supervisor)

| Method | Endpoint                             | Deskripsi                            |
| ------ | ------------------------------------ | ------------------------------------ |
| CRUD   | `/api/users`                         | Manajemen akun pengguna              |
| CRUD   | `/api/exams`                         | Manajemen ujian (buat, edit, hapus)  |
| CRUD   | `/api/sections`                      | Manajemen seksi ujian                |
| CRUD   | `/api/questions`                     | Manajemen soal per seksi             |
| CRUD   | `/api/bank-soal`                     | Manajemen bank soal                  |
| CRUD   | `/api/bank-packages`                 | Manajemen paket bank soal            |
| POST   | `/api/bank-packages/:id/bulk-upload` | Import soal dari PDF                 |
| POST   | `/api/sections/:id/import-bank`      | Import soal dari bank ke seksi ujian |
| GET    | `/api/monitoring`                    | Monitoring peserta real-time (SSE)   |
| GET    | `/api/dashboard/stats`               | Statistik dashboard                  |
| GET    | `/api/reports/participants`          | Laporan skor peserta                 |
| GET    | `/api/reports/participants/export`   | Export CSV skor peserta              |
| GET    | `/api/enrolls/:id/snapshots`         | Lihat foto snapshot anti-curang      |

### Peserta (Butuh autentikasi)

| Method | Endpoint                     | Deskripsi                         |
| ------ | ---------------------------- | --------------------------------- |
| GET    | `/api/exams`                 | Daftar ujian yang tersedia        |
| POST   | `/api/exams/:id/enroll`      | Daftar ke sesi ujian              |
| GET    | `/api/enrolls/:id/questions` | Ambil soal ujian (per seksi)      |
| POST   | `/api/enrolls/:id/submit`    | Kirim jawaban                     |
| POST   | `/api/enrolls/:id/finish`    | Selesaikan ujian                  |
| GET    | `/api/enrolls/:id/result`    | Lihat hasil ujian                 |
| POST   | `/api/enrolls/:id/snapshot`  | Kirim foto snapshot (anti-curang) |
| POST   | `/api/me/upload-identity`    | Upload foto KTM/identitas         |
| GET    | `/api/reports/me`            | Riwayat skor pribadi              |
| GET    | `/api/certificates/:id`      | Verifikasi sertifikat             |

---

## ✨ Fitur Utama

### 🚀 Fitur Baru (Pembaruan 2026)

- **Multi-Bahasa (i18n)** — Dukungan Bahasa Indonesia & English di Portal Mahasiswa.
- **Dark Mode / Mode Gelap** — Penyesuaian tema terang dan gelap secara otomatis.
- **CMS Mobile Responsive** — Dashboard admin dapat diakses dengan nyaman via smartphone.
- **Sertifikat Digital & QR Code** — Generate e-certificate otomatis ber-QR code untuk validasi.
- **Dashboard Analitik** — Visualisasi grafik peserta, kelulusan, dan pendapatan di CMS Admin.
- **Payment Gateway (Midtrans)** — Integrasi pembayaran otomatis (Qris, Virtual Account, dll).
- **Notifikasi Email Otomatis** — Pemberitahuan jadwal ujian, pembayaran, dan hasil kelulusan via email.
- **SSO Kampus (OAuth 2.0)** — Integrasi login mahasiswa menggunakan akun portal akademik Widyatama.
- **Automated Cloud Backup** — Script pencadangan database otomatis dan pengiriman ke server cloud (S3).

### 🧪 Mesin Ujian CBT

- Ujian berbasis waktu per seksi (Listening, Structure, Reading)
- Audio player terintegrasi untuk seksi Listening
- Penyimpanan jawaban otomatis (auto-save per klik)
- Validasi timer server-side (anti-manipulasi waktu)
- Konversi skor otomatis berdasarkan tabel mapping EPT resmi

### 🛡️ Keamanan & Anti-Kecurangan

- **AI Face Detection** — Mendeteksi jumlah wajah via `window.FaceDetector` API
- **Snapshot Berkala** — Foto webcam diam-diam dikirim ke server untuk audit
- **Tab-Switching Detection** — Peringatan jika peserta pindah tab/aplikasi
- **Fullscreen Enforcement** — Ujian harus dalam mode layar penuh
- **Rate Limiting** — Maks 10 request/menit pada endpoint login (anti brute-force)
- **HttpOnly Cookie** — Token tidak bisa dicuri via JavaScript/XSS
- **Security Headers** — X-Frame-Options DENY, HSTS, X-Content-Type nosniff

### 📊 Monitoring & Laporan

- **Real-time Monitoring** — Pengawas melihat aktivitas peserta langsung via SSE
- **Snapshot Reviewer** — Admin bisa melihat foto-foto ujian per peserta
- **Export CSV** — Unduh laporan skor seluruh peserta ke spreadsheet
- **Sertifikat PDF** — Generate sertifikat hasil ujian otomatis

### 📦 Manajemen Konten

- **Bank Soal** — Repositori soal terpisah, bisa diimpor ke banyak ujian
- **Bulk Upload PDF** — Import ratusan soal sekaligus dari file PDF
- **Penjadwalan Ujian** — Atur tanggal mulai, selesai, dan kuota peserta
- **Score Mapping** — Tabel konversi skor mentah → skor skala EPT

### 📧 Pemulihan Akun

- **Lupa Password** — Kirim link reset via email SMTP
- **Token Kadaluarsa** — Link reset hanya berlaku 1 jam

---

## 🐳 Deployment (Docker)

### Quick Start

```bash
# Dari root directory
docker-compose up -d --build
```

Ini akan menjalankan 4 container:

| Container   | Port | Deskripsi           |
| ----------- | ---- | ------------------- |
| MySQL 8.0   | 3306 | Database            |
| Backend API | 3333 | AdonisJS REST API   |
| Frontend    | 3000 | Next.js (Mahasiswa) |
| CMS Admin   | 5173 | Nginx (Admin Panel) |

### Post-Deployment

```bash
# Masuk ke container backend untuk menjalankan migration & seeder
docker exec -it language_test_backend sh
node ace migration:run
node ace db:seed
```

### Environment Variables (Production)

Edit `docker-compose.yml` untuk mengubah:

- `APP_KEY` — Generate key yang kuat (min 32 karakter)
- `DB_PASSWORD` — Ganti password database
- `NEXT_PUBLIC_API_URL` — URL backend yang bisa diakses publik
- `VITE_API_URL` — URL backend untuk build CMS (set saat `docker-compose build`)

---

## 💾 Backup Database

Script `backup.sh` di root directory untuk backup otomatis:

```bash
# Backup manual
./backup.sh

# Setup auto-backup via cron (setiap jam 2 pagi)
crontab -e
# Tambahkan baris:
0 2 * * * /path/to/language-test/backup.sh
```

Backup disimpan di folder `backups/` dengan format `db_backup_YYYY-MM-DD_HH-MM-SS.sql.gz`. File backup lebih dari 7 hari otomatis dihapus.

---

## 🧑‍💻 Panduan Pengembangan

### Membuat Migration Baru

```bash
cd backend-api
node ace make:migration nama_migration
```

### Membuat Controller Baru

```bash
node ace make:controller NamaController
```

### Membuat Model Baru

```bash
node ace make:model NamaModel
```

### Menjalankan Migration

```bash
node ace migration:run       # Jalankan migration
node ace migration:rollback  # Rollback migration terakhir
node ace migration:fresh     # Reset semua & jalankan ulang (⚠️ HAPUS DATA)
```

### Konvensi Kode

- **Backend:** AdonisJS conventions, camelCase untuk variabel, snake_case untuk kolom database
- **Frontend/CMS:** React functional components, TypeScript strict mode
- **Styling:** Tailwind CSS utility-first, tanpa CSS custom kecuali `globals.css`

---

## 📜 Riwayat Proyek

### Kontributor

| GitHub Username   | Nama    | Peran                                                                          |
| ----------------- | ------- | ------------------------------------------------------------------------------ |
| `@presidentanjay` | Gentala | Inisiator repository & fondasi awal proyek                                     |
| `@juanlolowang`   | Juan    | Lead Developer — pengembangan fitur utama, keamanan, AI anti-cheat, deployment |

### Timeline

| Periode      | Kontributor    | Deskripsi                                                                                                            |
| ------------ | -------------- | -------------------------------------------------------------------------------------------------------------------- |
| 2024 (Sem 6) | Gentala & Juan | Magang 4 bulan — setup repo, fondasi CRUD, auth, mesin ujian                                                         |
| 2024-2026    | Juan           | Lanjutan pasca-magang — security overhaul, AI anti-cheat, real-time monitoring, caching, deployment config           |
| 2026-09      | Juan & AI      | Penyelesaian 9 Fitur Baru (Dark Mode, i18n, SSO, Midtrans, Analitik, Sertifikat QR, Email, Mobile CMS, Cloud Backup) |
| 2026+        | _Penerus (KP)_ | Kerja Praktek — pengembangan lanjutan & pemeliharaan sistem                                                          |

---

## 📄 Lisensi

Proyek ini adalah milik **Lembaga Bahasa Universitas Widyatama** dan dikembangkan untuk keperluan internal kampus.

---

<p align="center">
  <b>Dikembangkan dengan ☕ untuk Universitas Widyatama, Bandung</b><br>
  <sub>Jl. Cikutra No. 204A, Bandung, Jawa Barat</sub>
</p>
