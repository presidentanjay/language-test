"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  MessageSquare,
  GraduationCap,
  ArrowRight,
  ExternalLink,
  Send,
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();

  const contactCards = [
    {
      icon: <MapPin className="h-7 w-7" />,
      title: locale === "en" ? "Full Address" : "Alamat Lengkap",
      lines: locale === "en" ? ["Jl. Cikutra No. 204A, Bandung", "West Java, 40124 – Indonesia"] : ["Jl. Cikutra No. 204A, Bandung", "Jawa Barat, 40124 – Indonesia"],
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      hoverBg: "hover:bg-blue-600",
    },
    {
      icon: <Phone className="h-7 w-7" />,
      title: locale === "en" ? "Phone Number" : "Nomor Telepon",
      lines: ["(022) 7275855", "ext. 228 / 229"],
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      hoverBg: "hover:bg-indigo-600",
    },
    {
      icon: <Globe className="h-7 w-7" />,
      title: locale === "en" ? "Official Website" : "Website Resmi",
      lines: ["www.widyatama.ac.id", "lb.widyatama.ac.id"],
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      hoverBg: "hover:bg-emerald-600",
    },
  ];

  const hours = [
    { day: locale === "en" ? "Monday – Friday" : "Senin – Jumat", time: "08:00 – 16:00 WIB", closed: false },
    { day: locale === "en" ? "Saturday" : "Sabtu", time: "08:00 – 14:00 WIB", closed: false },
    { day: locale === "en" ? "Sunday & Public Holidays" : "Minggu & Libur Nasional", time: locale === "en" ? "Closed" : "Tutup", closed: true },
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
            <MessageSquare className="h-3 w-3" />
            {locale === "en" ? "Contact Us" : "Hubungi Kami"}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-[1.05] tracking-tight"
          >
            {locale === "en" ? "Have Questions?" : "Ada Pertanyaan?"} <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {locale === "en" ? "We Are Ready to Help." : "Kami Siap Membantu."}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed"
          >
            {locale === "en" ? "The Language Institute team is ready to provide the information you need regarding language training and certification." : "Tim Lembaga Bahasa siap memberikan informasi yang Anda butuhkan seputar pelatihan dan sertifikasi bahasa."}
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════
                CONTACT CARDS — DARK
            ═══════════════════════════ */}
      <section className="py-20 px-6 bg-[#060b18]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {contactCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0d1526] border border-white/5 hover:border-white/10 p-10 rounded-[40px] text-center transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 group"
              >
                <div className="h-16 w-16 bg-white dark:bg-[#060b18]/5 group-hover:bg-blue-600/20 flex items-center justify-center rounded-2xl mb-8 mx-auto transition-colors duration-300 text-blue-400">
                  {card.icon}
                </div>
                <h3 className="text-lg font-black text-white mb-4">
                  {card.title}
                </h3>
                {card.lines.map((line, j) => (
                  <p key={j} className="text-slate-400 text-sm leading-relaxed">
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
                MAP + HOURS — LIGHT
            ═══════════════════════════ */}
      <section className="py-28 px-6 bg-white dark:bg-[#060b18]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-[48px] overflow-hidden min-h-[500px] border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/50 relative"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9386642225986!2d107.64192017503116!3d-6.8979396675037705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e797d4ff9d55%3A0x7255df8d69db4d3a!2sUniversitas%20Widyatama!5e0!3m2!1sid!2sid!4v1771442605167!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale contrast-[1.1] opacity-90"
              />
              {/* Map badge */}
              <div className="absolute top-6 left-6 bg-white dark:bg-[#060b18] border border-slate-100 dark:border-white/5 backdrop-blur-md p-5 rounded-2xl shadow-xl z-10">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                    Lokasi Kampus
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  Gedung Pusat, Lt. 1 — Universitas Widyatama
                </p>
              </div>
            </motion.div>

            {/* Hours + CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-8"
            >
              {/* Hours card */}
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-10 rounded-[40px] flex-1">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {locale === "en" ? "Operating Hours" : "Jam Operasional"}
                  </h3>
                </div>
                <div className="space-y-2">
                  {hours.map((h, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center py-5 border-b last:border-0 border-slate-100 dark:border-white/5 ${h.closed ? "opacity-40" : ""}`}
                    >
                      <span
                        className={`font-black text-sm ${h.closed ? "text-red-500" : "text-slate-700 dark:text-slate-300"}`}
                      >
                        {h.day}
                      </span>
                      <span
                        className={`text-sm font-bold ${h.closed ? "text-red-400" : "text-slate-500 dark:text-slate-400"}`}
                      >
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick help card */}
              <div className="bg-blue-600 p-10 rounded-[40px] text-white relative overflow-hidden">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute top-0 right-0 w-48 h-48 bg-white dark:bg-[#060b18] rounded-full blur-[60px]"
                />
                <div className="relative z-10">
                  <Send className="h-8 w-8 mb-6 text-white/80" />
                  <h4 className="text-xl font-black mb-3">
                    {locale === "en" ? "Need a Quick Response?" : "Butuh Respon Cepat?"}
                  </h4>
                  <p className="text-blue-100 text-sm mb-8 leading-relaxed">
                    {locale === "en" ? "Log in to the participant portal to submit a support ticket or ask questions about the exam." : "Login ke portal peserta untuk mengirimkan tiket bantuan atau tanya jawab seputar ujian."}
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full bg-white dark:bg-[#060b18] text-blue-600 font-black py-4 rounded-2xl hover:scale-[1.02] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    {locale === "en" ? "Log In to Portal" : "Log In ke Portal"}
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
                FAQ STRIP — DARK
            ═══════════════════════════ */}
      <section className="py-24 px-6 bg-[#060b18]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-4">{locale === "en" ? "Frequently Asked Questions" : "Pertanyaan Umum"}</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              {locale === "en" ? "Quick answers to frequently asked questions." : "Jawaban cepat untuk pertanyaan yang sering ditanyakan."}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {[
              {
                q: locale === "en" ? "How to register for a test?" : "Bagaimana cara mendaftar tes?",
                a: locale === "en" ? "Create an account on the portal, select a program, then complete the payment to the cashier or via transfer." : "Buat akun di portal, pilih program, lalu selesaikan pembayaran ke kasir atau via transfer.",
              },
              {
                q: locale === "en" ? "How long is the certificate valid?" : "Berapa lama sertifikat berlaku?",
                a: locale === "en" ? "The EPT certificate is valid for 2 years from the date of issuance." : "Sertifikat EPT berlaku selama 2 tahun sejak tanggal penerbitan.",
              },
              {
                q: locale === "en" ? "Is there any special preparation?" : "Apakah ada persiapan khusus?",
                a: locale === "en" ? "We provide practice materials and guides that can be accessed through the participant portal." : "Kami menyediakan materi latihan dan panduan yang bisa diakses melalui portal peserta.",
              },
              {
                q: locale === "en" ? "When will the test results be out?" : "Kapan hasil tes keluar?",
                a: locale === "en" ? "Test results are usually available 3-5 working days after the exam is completed." : "Hasil tes biasanya tersedia 3–5 hari kerja setelah ujian selesai dilaksanakan.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#0d1526] border border-white/5 hover:border-white/10 p-8 rounded-3xl transition-all"
              >
                <h4 className="font-black text-white mb-3">{faq.q}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
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
                  <span className="font-black text-lg uppercase text-slate-900 dark:text-white block leading-tight">
                    Lembaga Bahasa
                  </span>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                    Universitas Widyatama
                  </span>
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                {locale === "en" ? "Center of excellence for language training and certification since 2001." : "Pusat keunggulan pelatihan dan sertifikasi bahasa sejak 2001."}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-blue-600 mb-8">{locale === "en" ? "Navigation" : "Navigasi"}</h4>
              <ul className="space-y-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                {[
                  { label: locale === "en" ? "Home" : "Beranda", href: "/" },
                  { label: locale === "en" ? "About Us" : "Tentang Kami", href: "/about" },
                  { label: locale === "en" ? "Test Programs" : "Program Test", href: "/programs" },
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
                Get in Touch
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
