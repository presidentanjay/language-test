"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import {
  Award,
  Target,
  Flag,
  CheckCircle2,
  Users,
  Globe,
  GraduationCap,
  Lightbulb,
  Heart,
  Zap,
  BookOpen,
  Phone,
  MapPin,
  ExternalLink,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();

  const values = [
    {
      icon: <Award className="h-6 w-6 text-blue-400" />,
      title: locale === "en" ? "Excellence" : "Keunggulan",
      desc:
        locale === "en"
          ? "The highest quality standards in every aspect of language teaching and testing."
          : "Standar kualitas tertinggi dalam setiap aspek pengajaran dan pengujian bahasa.",
    },
    {
      icon: <Globe className="h-6 w-6 text-indigo-400" />,
      title: locale === "en" ? "Globality" : "Globalitas",
      desc:
        locale === "en"
          ? "International orientation to prepare participants for global challenges."
          : "Orientasi internasional untuk mempersiapkan peserta menghadapi tantangan dunia.",
    },
    {
      icon: <Heart className="h-6 w-6 text-rose-400" />,
      title: locale === "en" ? "Integrity" : "Integritas",
      desc:
        locale === "en"
          ? "Transparency and trust in every service we provide."
          : "Transparansi dan kepercayaan dalam setiap layanan yang kami berikan.",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-amber-400" />,
      title: locale === "en" ? "Innovation" : "Inovasi",
      desc:
        locale === "en"
          ? "Curriculum and teaching methods that continuously evolve according to current needs."
          : "Kurikulum dan metode pengajaran yang terus berkembang sesuai kebutuhan zaman.",
    },
    {
      icon: <Users className="h-6 w-6 text-emerald-400" />,
      title: locale === "en" ? "Collaboration" : "Kolaborasi",
      desc:
        locale === "en"
          ? "Building a learning ecosystem that supports mutual development."
          : "Membangun ekosistem belajar yang mendukung perkembangan bersama.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-violet-400" />,
      title: locale === "en" ? "Knowledge" : "Pengetahuan",
      desc:
        locale === "en"
          ? "Sharing knowledge from dedicated and experienced expert teachers."
          : "Berbagi ilmu dari pengajar ahli yang berdedikasi dan berpengalaman.",
    },
  ];

  const milestones = [
    {
      year: "2001",
      title: locale === "en" ? "Founded" : "Berdiri",
      desc:
        locale === "en"
          ? "Widyatama University Language Institute was officially established."
          : "Lembaga Bahasa Universitas Widyatama resmi didirikan.",
    },
    {
      year: "2008",
      title: locale === "en" ? "Grade A Accreditation" : "Akreditasi A",
      desc:
        locale === "en"
          ? "Achieved grade A accreditation from national institutions."
          : "Meraih akreditasi grade A dari lembaga nasional.",
    },
    {
      year: "2015",
      title: locale === "en" ? "5,000 Alumni" : "5.000 Alumni",
      desc:
        locale === "en"
          ? "Graduated over 5,000 certified participants."
          : "Meluluskan lebih dari 5.000 peserta bersertifikasi.",
    },
    {
      year: "2023",
      title: locale === "en" ? "Digital Platform" : "Platform Digital",
      desc:
        locale === "en"
          ? "Launched a fully digital-based testing system."
          : "Meluncurkan sistem tes berbasis digital penuh.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#060b18] text-slate-900 dark:text-white overflow-x-hidden">
      <Navbar variant="light" />

      {/* ═══════════════════════════
                HERO — LIGHT
            ═══════════════════════════ */}
      <section className="relative pt-40 pb-28 px-6 bg-white dark:bg-[#060b18] overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.07)_0%,transparent_70%)]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/20 rounded-full blur-[130px] opacity-50 -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 px-4 py-2 rounded-full text-[10px] font-black text-blue-600 mb-8 uppercase tracking-[0.2em]"
          >
            <Award className="h-3 w-3" />
            {locale === "en"
              ? "Center of Language Excellence"
              : "Pusat Unggulan Bahasa"}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-[1.05] tracking-tight"
          >
            {locale === "en"
              ? "About Language Institute"
              : "Tentang Lembaga Bahasa"}{" "}
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {locale === "en"
                ? "Widyatama University."
                : "Universitas Widyatama."}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed"
          >
            {locale === "en"
              ? "Committed to providing the highest standards of language training and certification to support academic and professional achievement in the international arena."
              : "Berkomitmen memberikan standar pelatihan dan sertifikasi bahasa tertinggi untuk mendukung prestasi akademik dan profesional dalam kancah internasional."}
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════
                SEJARAH — LIGHT
            ═══════════════════════════ */}
      <section className="py-24 px-6 bg-white dark:bg-[#060b18]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[48px] overflow-hidden border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/60 bg-slate-50 dark:bg-white/5 flex items-center justify-center p-12">
                <img
                  src="/img/lembaga-bahasa.png"
                  alt="Lembaga Bahasa Widyatama"
                  className="w-full h-full object-contain"
                />
              </div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-8 -right-6 bg-white dark:bg-[#060b18] border border-slate-100 dark:border-white/5 p-8 rounded-[32px] shadow-2xl shadow-slate-200/60 dark:shadow-none"
              >
                <div className="text-4xl font-black text-blue-600 mb-1">
                  20+
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Tahun Pengalaman
                </div>
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                {locale === "en"
                  ? "Our History & Dedication"
                  : "Sejarah & Dedikasi Kami"}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                {locale === "en"
                  ? "Widyatama University Language Institute (UTama Language Center) has stood as the vanguard in developing language competence within the campus environment and the general public in Bandung."
                  : "Lembaga Bahasa Universitas Widyatama (UTama Language Center) telah berdiri sebagai garda terdepan dalam pengembangan kompetensi bahasa di lingkungan kampus dan masyarakat umum di Bandung."}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                Kami percaya bahwa penguasaan bahasa adalah kunci utama untuk
                membuka pintu peluang global. Dengan kurikulum yang terus
                diperbarui dan fasilitas modern, kami memastikan setiap peserta
                mendapatkan pengalaman belajar yang optimal.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  {
                    icon: <CheckCircle2 className="h-5 w-5 text-blue-600" />,
                    title: "Terakreditasi",
                    sub: "Standar pendidikan yang diakui secara nasional.",
                  },
                  {
                    icon: <Users className="h-5 w-5 text-blue-600" />,
                    title: "Ekspertis",
                    sub: "Instruktur berpengalaman di bidangnya.",
                  },
                  {
                    icon: <Zap className="h-5 w-5 text-blue-600" />,
                    title: "Modern",
                    sub: "Sistem tes digital berstandar internasional.",
                  },
                  {
                    icon: <Globe className="h-5 w-5 text-blue-600" />,
                    title: "Diakui",
                    sub: "Sertifikat yang diakui institusi nasional.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 rounded-2xl"
                  >
                    <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
                VISI & MISI — DARK
            ═══════════════════════════ */}
      <section className="py-28 px-6 bg-[#060b18]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              {locale === "en" ? "Vision & Mission" : "Visi & Misi"}
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full shadow-lg shadow-blue-600/30" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Visi */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative bg-[#0d1526] border border-white/5 p-12 rounded-[40px] overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="h-40 w-40 text-white" />
              </div>
              <div className="relative z-10">
                <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/30">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-5">
                  {locale === "en" ? "Our Vision" : "Visi Kami"}
                </h3>
                <p className="text-slate-400 text-xl leading-relaxed">
                  {locale === "en"
                    ? "To become a leading, innovative, and internationally competitive language training and certification center by 2030."
                    : "Menjadi pusat pelatihan dan sertifikasi bahasa yang terkemuka, inovatif, dan berdaya saing internasional pada tahun 2030."}
                </p>
              </div>
            </motion.div>

            {/* Misi */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-12 rounded-[40px] overflow-hidden group shadow-2xl shadow-blue-600/20"
            >
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flag className="h-40 w-40" />
              </div>
              <div className="relative z-10">
                <div className="h-14 w-14 bg-white dark:bg-[#060b18]/20 rounded-2xl flex items-center justify-center mb-8">
                  <Flag className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-6">
                  {locale === "en" ? "Our Mission" : "Misi Kami"}
                </h3>
                <ul className="space-y-5 text-white/80 text-lg leading-relaxed">
                  {[
                    locale === "en"
                      ? "Organizing high-quality language courses for students and the public."
                      : "Menyelenggarakan kursus bahasa yang berkualitas bagi mahasiswa dan umum.",
                    locale === "en"
                      ? "Providing accurate and reliable language testing services (EPT, TOEIC)."
                      : "Menyediakan layanan pengujian bahasa (EPT, TOEIC) yang akurat dan terpercaya.",
                    locale === "en"
                      ? "Developing research in the field of language teaching continuously."
                      : "Mengembangkan penelitian di bidang pengajaran bahasa secara berkelanjutan.",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-white dark:bg-[#060b18]/60 mt-3 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
                TIMELINE — LIGHT
            ═══════════════════════════ */}
      <section className="py-24 px-6 bg-white dark:bg-[#060b18]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              {locale === "en" ? "Our Journey" : "Perjalanan Kami"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              {locale === "en"
                ? "More than two decades of dedication to language excellence."
                : "Lebih dari dua dekade dedikasi untuk keunggulan bahasa."}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-[#060b18] border border-slate-100 dark:border-white/5 hover:border-blue-100 dark:hover:border-blue-900/50 dark:border-blue-900/30 p-8 rounded-[32px] transition-all duration-300 group hover:shadow-xl hover:shadow-slate-100"
              >
                <div className="text-5xl font-black text-blue-100 group-hover:text-blue-200 transition-colors mb-4 leading-none">
                  {m.year}
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                  {m.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {m.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
                NILAI-NILAI — DARK
            ═══════════════════════════ */}
      <section className="py-28 px-6 bg-[#060b18]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              {locale === "en" ? "Our Core Values" : "Nilai-Nilai Kami"}
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              {locale === "en"
                ? "The principles that are our foundation in serving every participant."
                : "Prinsip-prinsip yang menjadi landasan kami dalam melayani setiap peserta."}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#0d1526] border border-white/5 hover:border-white/10 p-8 rounded-[32px] transition-all duration-300 group hover:shadow-xl hover:shadow-blue-900/10"
              >
                <div className="h-14 w-14 bg-white dark:bg-[#060b18]/5 group-hover:bg-blue-600/10 flex items-center justify-center rounded-2xl mb-6 transition-colors duration-300">
                  {v.icon}
                </div>
                <h3 className="text-lg font-black text-white mb-3">
                  {v.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
                CTA — LIGHT
            ═══════════════════════════ */}
      <section className="px-6 py-28 bg-white dark:bg-[#060b18]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-slate-900 rounded-[48px] p-12 md:p-20 text-center overflow-hidden"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px]"
            />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                {locale === "en"
                  ? "Join Us Today."
                  : "Bergabunglah Bersama Kami."}
              </h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                {locale === "en"
                  ? "The first step towards mastering international languages starts here."
                  : "Langkah pertama menuju penguasaan bahasa internasional dimulai dari sini."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => router.push("/register")}
                  className="bg-blue-600 text-white font-black py-5 px-12 rounded-2xl shadow-2xl shadow-blue-600/30 hover:bg-blue-50 dark:bg-blue-900/20 hover:scale-105 transition-all active:scale-95 w-full sm:w-auto flex items-center justify-center gap-3 group"
                >
                  {locale === "en" ? "Register Program" : "Daftar Program"}
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="bg-white/5 dark:bg-[#060b18]/10 border border-white/10 text-white font-black py-5 px-12 rounded-2xl hover:bg-white/10 dark:hover:bg-[#060b18]/20 transition-all active:scale-95 w-full sm:w-auto"
                >
                  {locale === "en" ? "Back to Home" : "Kembali ke Beranda"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════
                FOOTER — LIGHT
            ═══════════════════════════ */}
      <footer className="bg-white dark:bg-[#060b18] border-t border-slate-100 dark:border-white/5 pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-black text-lg leading-tight uppercase text-slate-900 dark:text-white block">
                    Lembaga Bahasa
                  </span>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                    Universitas Widyatama
                  </span>
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                {locale === "en"
                  ? "Center of excellence for language training and certification since 2001."
                  : "Pusat keunggulan pelatihan dan sertifikasi bahasa sejak 2001."}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-blue-600 mb-8">
                {locale === "en" ? "Navigation" : "Navigasi"}
              </h4>
              <ul className="space-y-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                {[
                  { label: locale === "en" ? "Home" : "Beranda", href: "/" },
                  {
                    label: locale === "en" ? "Test Programs" : "Program Test",
                    href: "/programs",
                  },
                  {
                    label: locale === "en" ? "Contact" : "Kontak",
                    href: "/contact",
                  },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-2 group"
                    onClick={() => router.push(item.href)}
                  >
                    <ArrowRight className="h-4 w-4 -ml-6 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-600" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-blue-600 mb-8">
                {locale === "en" ? "Contact" : "Kontak"}
              </h4>
              <div className="space-y-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-blue-600" />
                  <span className="leading-relaxed">
                    Jl. Cikutra No. 204A, Bandung, Jawa Barat
                  </span>
                </div>
                <div className="flex gap-3 items-center">
                  <Phone className="h-5 w-5 shrink-0 text-blue-600" />
                  <span>(022) 7275855</span>
                </div>
                <div className="flex gap-3 items-center text-blue-600 font-black">
                  <ExternalLink className="h-5 w-5 shrink-0" />
                  <span>widyatama.ac.id</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            <p>© 2025 Lembaga Bahasa Universitas Widyatama.</p>
            <div className="flex gap-8">
              {["Privacy", "Terms"].map((item) => (
                <span
                  key={item}
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
