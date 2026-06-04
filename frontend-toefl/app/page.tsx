"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ChevronRight,
    Globe,
    ShieldCheck,
    Users,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    Star,
    Zap,
    CheckCircle2,
    ArrowRight,
    GraduationCap,
    Clock,
    FileText,
    Trophy,
    TrendingUp,
    Award,
    BookOpen,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
} as const;
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

export default function LandingPage() {
    const router = useRouter();

    const features = [
        {
            icon: <Globe className="h-6 w-6 text-blue-400" />,
            title: "Standar Internasional",
            desc: "Materi dan sistem pengujian yang disesuaikan dengan standar global EPT dan TOEIC.",
        },
        {
            icon: <ShieldCheck className="h-6 w-6 text-indigo-400" />,
            title: "Sertifikat Resmi",
            desc: "Dapatkan sertifikat resmi dari Lembaga Bahasa Universitas Widyatama yang diakui.",
        },
        {
            icon: <Users className="h-6 w-6 text-emerald-400" />,
            title: "Pembimbing Ahli",
            desc: "Didukung oleh staf pengajar dan ahli bahasa yang berpengalaman di bidangnya.",
        },
    ];

    const programs = [
        {
            tag: "EPT",
            name: "English Proficiency Test",
            desc: "Uji kemampuan bahasa Inggris secara komprehensif sesuai standar akademik internasional.",
            duration: "120 Menit",
            sections: "4 Seksi",
            level: "Intermediate+",
            from: "from-blue-600",
            to: "to-blue-700",
            shadow: "shadow-blue-200",
            badge: "Paling Populer",
        },
        {
            tag: "TOEIC",
            name: "TOEIC Simulation",
            desc: "Simulasi resmi TOEIC untuk mempersiapkan diri menghadapi tes kompetensi bahasa dunia kerja.",
            duration: "120 Menit",
            sections: "2 Seksi",
            level: "All Levels",
            from: "from-indigo-600",
            to: "to-violet-700",
            shadow: "shadow-indigo-200",
            badge: null,
        },
    ];

    const stats = [
        { value: "5.8k+", label: "Peserta" },
        { value: "92%", label: "Tingkat Lulus" },
        { value: "12+", label: "Mitra Resmi" },
        { value: "2001", label: "Berdiri Sejak" },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
            {/* Navbar - light variant since hero is white */}
            <Navbar variant="light" />

            {/* ═══════════════════════════
                HERO — LIGHT
            ═══════════════════════════ */}
            <section className="relative pt-36 pb-24 px-6 overflow-hidden min-h-[95vh] flex items-center bg-white">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.07)_0%,transparent_70%)]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[130px] opacity-50 -z-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] opacity-70 -z-10" />

                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left */}
                    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col items-start">
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full text-[10px] font-black text-blue-600 mb-8 uppercase tracking-[0.2em]"
                        >
                            <Zap className="h-3 w-3 fill-blue-600" />
                            Empowering Global Communication
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-6xl md:text-[84px] font-black text-slate-900 mb-8 leading-[0.95] tracking-tight">
                            Master Your <br />
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Future Standard.
                            </span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-slate-500 text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-medium">
                            Pusat sertifikasi dan pelatihan bahasa terakreditasi Universitas Widyatama membantu Anda menembus batas global dengan persiapan profesional.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => router.push("/programs")}
                                className="w-full sm:w-auto bg-blue-600 text-white font-black py-5 px-10 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                Lihat Jadwal Test
                                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => router.push("/about")}
                                className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 font-black py-5 px-10 rounded-2xl hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
                            >
                                Tentang Lembaga
                            </button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mt-16 flex items-center gap-8 border-t border-slate-100 pt-8 w-full">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="student" />
                                    </div>
                                ))}
                                <div className="h-10 w-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] text-white font-black shadow-sm">
                                    +2k
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                                    <span className="text-xs font-black ml-1 text-slate-800">4.9/5</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Satisfaction</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right — dashboard card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        <div className="p-[1px] rounded-[40px] bg-gradient-to-br from-slate-200 via-slate-100 to-transparent shadow-2xl shadow-slate-200/60">
                            <div className="bg-slate-50 p-8 rounded-[40px] overflow-hidden">
                                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <Zap className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-2 w-12 bg-slate-100 rounded-full" />
                                            <div className="h-2 w-8 bg-slate-100 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-12 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preparation Progress</span>
                                            <span className="text-[10px] font-black text-blue-600">85%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "85%" }}
                                                transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="h-24 flex-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-blue-200">
                                                <div className="h-6 w-6 bg-white/20 rounded-lg flex items-center justify-center">
                                                    <Trophy className="h-3 w-3 text-white" />
                                                </div>
                                                <span className="text-white text-xs font-black uppercase">EPT Result</span>
                                            </div>
                                            <div className="h-24 flex-1 bg-slate-900 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-slate-200">
                                                <div className="h-6 w-6 bg-white/10 rounded-lg flex items-center justify-center">
                                                    <TrendingUp className="h-3 w-3 text-white" />
                                                </div>
                                                <span className="text-white text-xs font-black uppercase">TOEIC Score</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 space-y-2">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Pusat Sertifikasi Resmi</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Lembaga Bahasa Universitas Widyatama menyediakan tes EPT dan simulasi TOEIC berstandar internasional.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -left-6 bg-white border border-slate-100 px-6 py-4 rounded-3xl shadow-xl shadow-slate-200/60 z-20">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">Accreditation</span>
                                    <span className="text-xs font-black text-slate-900 italic">Grade A+ Certified</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-4 -right-4 bg-blue-600 px-5 py-3 rounded-2xl shadow-xl shadow-blue-300 z-20">
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-white" />
                                <div>
                                    <div className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Avg Score</div>
                                    <div className="text-lg font-black text-white leading-none">785</div>
                                </div>
                            </div>
                        </motion.div>
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
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full text-[10px] font-black text-blue-600 mb-6 uppercase tracking-[0.2em]">
                            <BookOpen className="h-3 w-3" />
                            Program Tes Kami
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Pilih Program yang <br />
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Sesuai Kebutuhanmu
                            </span>
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Dua program unggulan kami dirancang untuk membantu mahasiswa dan profesional membuktikan kompetensi bahasa mereka.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {programs.map((prog, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="group"
                            >
                                <div className="relative bg-white border border-slate-100 hover:border-blue-100 rounded-[40px] p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-100 h-full">
                                    {prog.badge && (
                                        <div className="absolute -top-3 left-10">
                                            <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-200">
                                                {prog.badge}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${prog.from} ${prog.to} shadow-lg ${prog.shadow} flex items-center justify-center`}>
                                            <FileText className="h-6 w-6 text-white" />
                                        </div>
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-lg">
                                            {prog.tag}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4">{prog.name}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-10">{prog.desc}</p>
                                    <div className="grid grid-cols-3 gap-4 mb-10">
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
                                    <button
                                        onClick={() => router.push("/programs")}
                                        className={`w-full bg-gradient-to-r ${prog.from} ${prog.to} text-white font-black py-4 rounded-2xl shadow-lg ${prog.shadow} hover:opacity-90 hover:scale-[1.01] transition-all active:scale-95 flex items-center justify-center gap-2 group/btn`}
                                    >
                                        Lihat Detail Program
                                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════
                FEATURES — DARK
            ═══════════════════════════ */}
            <section className="py-28 px-6 bg-[#060b18]">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase">
                            Standar Keunggulan Kami
                        </h2>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-8 shadow-lg shadow-blue-600/30" />
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Kami memastikan setiap peserta mendapatkan pengalaman ujian yang adil, transparan, dan sesuai standar internasional.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group"
                            >
                                <div className="h-full bg-[#0d1526] border border-white/5 hover:border-white/10 p-12 rounded-[40px] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/20">
                                    <div className="h-16 w-16 bg-white/5 flex items-center justify-center rounded-2xl mb-10 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all duration-500">
                                        {feat.icon}
                                    </div>
                                    <h3 className="text-xl font-black mb-6 uppercase tracking-tight text-white">{feat.title}</h3>
                                    <p className="text-slate-400 leading-relaxed font-medium text-sm">{feat.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════
                CTA — LIGHT with dark card
            ═══════════════════════════ */}
            <section className="px-6 py-32 bg-white">
                <div className="max-w-7xl mx-auto rounded-[48px] bg-slate-900 p-12 md:p-24 relative overflow-hidden">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
                    />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-[1] uppercase">
                                Siap Menguji <br />
                                <span className="text-blue-400">Skill Bahasa</span><br />
                                Anda Sekarang?
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-lg">
                                Pendaftaran untuk tes periode terbaru telah dibuka. Amankan kursi Anda sekarang.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => router.push("/register")}
                                    className="bg-blue-600 text-white font-black py-6 px-12 rounded-2xl shadow-2xl shadow-blue-600/20 hover:bg-blue-500 hover:scale-105 transition-all active:scale-95 text-sm uppercase tracking-widest"
                                >
                                    Daftar Test Sekarang
                                </button>
                                <button
                                    onClick={() => router.push("/contact")}
                                    className="bg-white/5 border border-white/10 text-white font-black py-6 px-12 rounded-2xl hover:bg-white/10 transition-all active:scale-95 text-sm uppercase tracking-widest"
                                >
                                    Pusat Bantuan
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Active Test Session", value: "24" },
                                { label: "Total Participants", value: "5.8k" },
                                { label: "Official Partners", value: "12" },
                                { label: "Average Success", value: "92%" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/5 border border-white/5 p-8 rounded-3xl hover:bg-white/10 transition-colors"
                                >
                                    <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════
                FOOTER — LIGHT
            ═══════════════════════════ */}
            <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-16 mb-20 px-6">
                        <div className="col-span-2 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <div>
                                    <span className="font-black text-lg leading-tight uppercase text-slate-900 tracking-tight block">Lembaga Bahasa</span>
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Universitas Widyatama</span>
                                </div>
                            </div>
                            <p className="text-slate-500 max-w-xs leading-relaxed text-sm">
                                Pusat keunggulan pelatihan dan sertifikasi bahasa sejak 2001.
                            </p>
                            <div className="flex gap-4">
                                {[Globe, Mail, Phone].map((Icon, i) => (
                                    <div key={i} className="h-12 w-12 bg-slate-50 border border-slate-100 flex items-center justify-center rounded-2xl hover:bg-blue-600 hover:border-blue-600 transition-all cursor-pointer group">
                                        <Icon className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-blue-600 mb-10">Resources</h4>
                            <ul className="space-y-6 text-sm font-bold text-slate-500">
                                {["EPT Preparation", "TOEIC Simulation", "English Business"].map((item) => (
                                    <li key={item} className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-2 group">
                                        <ArrowRight className="h-4 w-4 -ml-6 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-600" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-blue-600 mb-10">Get in Touch</h4>
                            <div className="space-y-8 text-sm text-slate-500">
                                <div className="flex gap-4">
                                    <MapPin className="h-5 w-5 shrink-0 text-blue-600" />
                                    <span className="leading-relaxed">Jl. Cikutra No. 204A, Bandung, Jawa Barat</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <Phone className="h-5 w-5 shrink-0 text-blue-600" />
                                    <span>(022) 7275855</span>
                                </div>
                                <div className="flex gap-4 items-center text-blue-600 font-black">
                                    <ExternalLink className="h-5 w-5 shrink-0" />
                                    <span>widyatama.ac.id</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        <p>© 2025 Lembaga Bahasa Universitas Widyatama.</p>
                        <div className="flex gap-8">
                            {["Security", "Privacy", "Terms"].map((item) => (
                                <span key={item} className="cursor-pointer hover:text-blue-600 transition-colors">{item}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
