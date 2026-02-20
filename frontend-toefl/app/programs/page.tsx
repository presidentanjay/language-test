"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ShieldCheck,
    Clock,
    CreditCard,
    FileText,
    UserPlus,
    Laptop,
    Trophy,
    CheckCircle2,
    Info,
    ArrowRight,
    ChevronRight,
    TrendingUp,
    Globe,
    GraduationCap,
    Phone,
    MapPin,
    ExternalLink,
    Mail,
    Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ProgramsPage() {
    const router = useRouter();

    const programs = [
        {
            tag: "EPT",
            category: "Standard",
            title: "English Proficiency Test",
            price: "Rp 150.000",
            duration: "120 Menit",
            sections: "4 Seksi",
            level: "Intermediate+",
            description: "Tes standar untuk mengukur kemampuan bahasa Inggris akademik bagi mahasiswa Universitas Widyatama.",
            benefits: ["Sertifikat Resmi", "Masa Berlaku 2 Tahun", "Diterima Internal Kampus"],
            from: "from-blue-600",
            to: "to-blue-700",
            shadow: "shadow-blue-200",
            badge: "Paling Populer",
        },
        {
            tag: "TOEIC",
            category: "Professional",
            title: "TOEIC Prediction",
            price: "Rp 250.000",
            duration: "120 Menit",
            sections: "2 Seksi",
            level: "All Levels",
            description: "Simulasi tes TOEIC untuk persiapan sertifikasi internasional di dunia kerja.",
            benefits: ["Analisis Skor Detil", "Latihan Standar Kerja", "Feedback Instruktur"],
            from: "from-indigo-600",
            to: "to-violet-700",
            shadow: "shadow-indigo-200",
            badge: null,
        },
    ];

    const steps = [
        {
            icon: <UserPlus className="h-6 w-6" />,
            title: "Pendaftaran Akun",
            desc: "Klik tombol Register untuk membuat akun peserta baru di sistem Lembaga Bahasa.",
        },
        {
            icon: <FileText className="h-6 w-6" />,
            title: "Pilih Program",
            desc: "Pilih jenis test yang ingin Anda ambil dari daftar program yang tersedia di Dashboard.",
        },
        {
            icon: <CreditCard className="h-6 w-6" />,
            title: "Pembayaran",
            desc: "Lakukan pembayaran administrasi ke kasir atau via transfer sesuai petunjuk.",
        },
        {
            icon: <Laptop className="h-6 w-6" />,
            title: "Ujian Online",
            desc: "Akses ujian secara online melalui platform ini pada jadwal yang ditentukan.",
        },
    ];

    const stats = [
        { value: "5.8k+", label: "Peserta" },
        { value: "92%", label: "Tingkat Lulus" },
        { value: "2", label: "Program Aktif" },
        { value: "24/7", label: "Akses Platform" },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
            <Navbar variant="light" />

            {/* ═══════════════════════════
                HERO — LIGHT
            ═══════════════════════════ */}
            <section className="relative pt-40 pb-28 px-6 bg-white overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.07)_0%,transparent_70%)]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[130px] opacity-50 -z-10" />

                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full text-[10px] font-black text-blue-600 mb-8 uppercase tracking-[0.2em]"
                    >
                        <ShieldCheck className="h-3 w-3" />
                        Sertifikasi & Ujian Tersedia
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.05] tracking-tight"
                    >
                        Program Ujian <br />
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Bahasa Profesional.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed mb-12"
                    >
                        Cek daftar ujian, rincian biaya, dan pelajari cara mengikuti sertifikasi di Lembaga Bahasa Universitas Widyatama.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            onClick={() => router.push("/register")}
                            className="bg-blue-600 text-white font-black py-5 px-10 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 group"
                        >
                            Daftar Sekarang
                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => router.push("/login")}
                            className="bg-white text-slate-700 border border-slate-200 font-black py-5 px-10 rounded-2xl hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            Log In Peserta
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════
                STATS — DARK
            ═══════════════════════════ */}
            <section className="py-12 bg-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════
                PROGRAM CARDS — LIGHT
            ═══════════════════════════ */}
            <section className="py-28 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            Katalog Ujian &amp; Biaya
                        </h2>
                        <p className="text-slate-500 text-lg max-w-xl mx-auto">
                            Pilih program yang sesuai dengan kebutuhan kualifikasi Anda.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {programs.map((prog, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="group relative"
                            >
                                <div className="relative bg-white border border-slate-100 hover:border-blue-100 rounded-[40px] p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-100 h-full flex flex-col">
                                    {prog.badge && (
                                        <div className="absolute -top-3 left-10">
                                            <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-200">
                                                {prog.badge}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${prog.from} ${prog.to} shadow-lg ${prog.shadow} flex items-center justify-center`}>
                                            <Trophy className="h-6 w-6 text-white" />
                                        </div>
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-lg">
                                            {prog.tag}
                                        </span>
                                    </div>

                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 inline-block w-fit">
                                        {prog.category}
                                    </span>
                                    <h3 className="text-2xl font-black text-slate-900 mb-3">{prog.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8">{prog.description}</p>

                                    {/* Details */}
                                    <div className="grid grid-cols-3 gap-3 mb-8">
                                        {[
                                            { icon: <Clock className="h-4 w-4" />, val: prog.duration },
                                            { icon: <FileText className="h-4 w-4" />, val: prog.sections },
                                            { icon: <TrendingUp className="h-4 w-4" />, val: prog.level },
                                        ].map((item, j) => (
                                            <div key={j} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
                                                <div className="text-blue-600 flex justify-center mb-1">{item.icon}</div>
                                                <div className="text-[10px] font-black text-slate-500">{item.val}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-4xl font-black text-slate-900 mb-8">
                                        {prog.price}
                                        <span className="text-sm font-bold text-slate-400 ml-2">/ Test</span>
                                    </div>

                                    <ul className="space-y-3 mb-10 flex-1">
                                        {prog.benefits.map((benefit, j) => (
                                            <li key={j} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => router.push("/login")}
                                        className={`w-full bg-gradient-to-r ${prog.from} ${prog.to} text-white font-black py-4 rounded-2xl shadow-lg ${prog.shadow} hover:opacity-90 hover:scale-[1.01] transition-all active:scale-95 flex items-center justify-center gap-2 group/btn`}
                                    >
                                        Pilih Program Ini
                                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Info note */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-12 bg-blue-50 border border-blue-100 p-8 rounded-[32px] max-w-3xl mx-auto flex gap-4"
                    >
                        <Info className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800 leading-relaxed">
                            <span className="font-black">Catatan:</span> Biaya yang tercantum dapat berubah sewaktu-waktu sesuai kebijakan Lembaga Bahasa Universitas Widyatama. Silakan konfirmasi kembali melalui bagian pendaftaran.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════
                HOW IT WORKS — DARK
            ═══════════════════════════ */}
            <section className="py-28 px-6 bg-[#060b18]">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 px-4 py-2 rounded-full text-[10px] font-black text-blue-400 mb-6 uppercase tracking-[0.2em]">
                            <Zap className="h-3 w-3" />
                            Cara Pendaftaran
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Bagaimana Caranya?</h2>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">Ikuti panduan langkah pendaftaran ujian berikut ini.</p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className="relative group"
                            >
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-[60%] w-full h-[1px] bg-white/5" />
                                )}
                                <div className="bg-[#0d1526] border border-white/5 h-20 w-20 rounded-3xl flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all mb-8 relative z-10 shadow-xl shadow-black/20">
                                    {step.icon}
                                    <span className="absolute -top-3 -right-3 h-8 w-8 bg-[#060b18] border border-white/10 rounded-full flex items-center justify-center text-xs font-black text-slate-400">
                                        0{i + 1}
                                    </span>
                                </div>
                                <h4 className="text-xl font-black mb-4 text-white">{step.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════
                CTA — LIGHT with dark card
            ═══════════════════════════ */}
            <section className="px-6 py-28 bg-white">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative bg-blue-600 rounded-[48px] p-12 md:p-20 text-center overflow-hidden"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 8, repeat: Infinity }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]"
                        />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                                Mulai Persiapan Ujian Anda.
                            </h2>
                            <p className="text-white/80 text-xl max-w-xl mx-auto mb-12 leading-relaxed">
                                Sudah tahu tes mana yang akan diambil? Buat akun dan tentukan jadwal ujian Anda sekarang.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => router.push("/register")}
                                    className="bg-white text-blue-600 font-black py-5 px-12 rounded-2xl shadow-2xl hover:scale-105 transition-all active:scale-95 w-full sm:w-auto"
                                >
                                    Daftar Sekarang
                                </button>
                                <button
                                    onClick={() => router.push("/login")}
                                    className="bg-white/10 border border-white/20 text-white font-black py-5 px-12 rounded-2xl hover:bg-white/20 transition-all active:scale-95 w-full sm:w-auto"
                                >
                                    Log In Peserta
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════
                FOOTER — LIGHT
            ═══════════════════════════ */}
            <footer className="bg-white border-t border-slate-100 pt-20 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-16 mb-16">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                    <GraduationCap className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <span className="font-black text-lg leading-tight uppercase text-slate-900 block">Lembaga Bahasa</span>
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Universitas Widyatama</span>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                                Pusat keunggulan pelatihan dan sertifikasi bahasa sejak 2001.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-blue-600 mb-8">Navigasi</h4>
                            <ul className="space-y-5 text-sm font-bold text-slate-500">
                                {[
                                    { label: "Beranda", href: "/" },
                                    { label: "Tentang Kami", href: "/about" },
                                    { label: "Kontak", href: "/contact" },
                                ].map((item) => (
                                    <li key={item.label}
                                        className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-2 group"
                                        onClick={() => router.push(item.href)}>
                                        <ArrowRight className="h-4 w-4 -ml-6 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-600" />
                                        {item.label}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-blue-600 mb-8">Kontak</h4>
                            <div className="space-y-6 text-sm text-slate-500">
                                <div className="flex gap-3">
                                    <MapPin className="h-5 w-5 shrink-0 text-blue-600" />
                                    <span className="leading-relaxed">Jl. Cikutra No. 204A, Bandung, Jawa Barat</span>
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

                    <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        <p>© 2025 Lembaga Bahasa Universitas Widyatama.</p>
                        <div className="flex gap-8">
                            {["Privacy", "Terms"].map((item) => (
                                <span key={item} className="cursor-pointer hover:text-blue-600 transition-colors">{item}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
