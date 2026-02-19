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
    GraduationCap
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
    const router = useRouter();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const features = [
        {
            icon: <Globe className="h-6 w-6 text-brand" />,
            title: "Standar Internasional",
            desc: "Materi dan sistem pengujian yang disesuaikan dengan standar global EPT dan TOEIC.",
            color: "blue"
        },
        {
            icon: <ShieldCheck className="h-6 w-6 text-indigo-500" />,
            title: "Sertifikat Resmi",
            desc: "Dapatkan sertifikat resmi dari Lembaga Bahasa Universitas Widyatama yang diakui.",
            color: "indigo"
        },
        {
            icon: <Users className="h-6 w-6 text-emerald-500" />,
            title: "Pembimbing Ahli",
            desc: "Didukung oleh staf pengajar dan ahli bahasa yang berpengalaman di bidangnya.",
            color: "emerald"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-brand/10 selection:text-brand silk-gradient">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[95vh] flex items-center">
                {/* Animated Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(37,99,235,0.03)_0%,transparent_100%)]" />
                <motion.div
                    animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 -right-20 w-96 h-96 bg-brand/5 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px]"
                />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="flex flex-col items-start text-left"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-[10px] font-black text-brand mb-8 uppercase tracking-[0.2em]"
                        >
                            <Zap className="h-3 w-3 fill-brand" />
                            Empowering Global Communication
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-6xl md:text-[84px] font-black text-slate-900 mb-8 leading-[0.95] tracking-tight"
                        >
                            Master Your <br />
                            <span className="text-gradient">Future Standard.</span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-slate-500 text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-medium"
                        >
                            Pusat sertifikasi dan pelatihan bahasa terakreditasi Universitas Widyatama membantu Anda menembus batas global dengan persiapan profesional.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
                        >
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full sm:w-auto bg-brand text-white font-black py-5 px-10 rounded-2xl shadow-2xl shadow-blue-600/30 hover:scale-[1.02] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                Lihat Jadwal Test
                                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => router.push('/about')}
                                className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 font-black py-5 px-10 rounded-2xl hover:border-brand/30 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                Tentang Lembaga
                            </button>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mt-16 flex items-center gap-8 border-t border-slate-100 pt-8 w-full"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="student" />
                                    </div>
                                ))}
                                <div className="h-10 w-10 rounded-full border-2 border-white bg-brand flex items-center justify-center text-[10px] text-white font-black shadow-sm">
                                    +2k
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                                    <span className="text-xs font-black ml-1 text-slate-900 tracking-tight">4.9/5</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Satisfaction</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Decorative Hero Image/Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative perspective-1000 hidden lg:block"
                    >
                        <div className="relative z-10 p-2 glass rounded-[48px] shadow-2xl overflow-hidden group">
                            <div className="bg-slate-50 p-8 rounded-[40px] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(37,99,235,0.05)_0%,transparent_50%)]" />

                                {/* Simulated Dashboard UI */}
                                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 relative z-10 translate-x-4 translate-y-4">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="h-8 w-8 bg-brand/10 rounded-lg flex items-center justify-center">
                                            <Zap className="h-4 w-4 text-brand" />
                                        </div>
                                        <div className="h-2 w-20 bg-slate-100 rounded-full" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-12 w-full bg-slate-50 rounded-xl px-4 flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preparation Progress</span>
                                            <span className="text-[10px] font-black text-brand">85%</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="h-24 flex-1 bg-brand rounded-2xl p-4 flex flex-col justify-between">
                                                <div className="h-6 w-6 bg-white/20 rounded-lg" />
                                                <span className="text-white text-xs font-black uppercase">EPT Result</span>
                                            </div>
                                            <div className="h-24 flex-1 bg-slate-900 rounded-2xl p-4 flex flex-col justify-between">
                                                <div className="h-6 w-6 bg-white/10 rounded-lg" />
                                                <span className="text-white text-xs font-black uppercase">Toeic Score</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-16 space-y-4">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Pusat Sertifikasi Resmi</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Lembaga Bahasa Universitas Widyatama menyediakan berbagai macam tes kompetensi bahasa seperti EPT (English Proficiency Test) dan simulasi TOEIC.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -left-6 glass px-6 py-4 rounded-3xl shadow-2xl z-20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Accreditation</span>
                                    <span className="text-xs font-black text-slate-900 italic tracking-tight">Grade A+ Certified</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="programs" className="py-24 px-6 md:px-12 bg-slate-50/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase">
                            Standar Keunggulan Kami
                        </h2>
                        <div className="h-1.5 w-24 bg-brand mx-auto rounded-full mb-8 shadow-lg shadow-blue-600/30" />
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Kami memastikan setiap peserta mendapatkan pengalaman ujian yang adil, transparan, dan sesuai dengan standar internasional.
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
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-brand/5 rounded-[40px] translate-y-4 scale-95 group-hover:translate-y-6 transition-all duration-500 opacity-0 group-hover:opacity-100" />
                                <div className="relative h-full bg-white p-12 rounded-[40px] border border-slate-100 hover:border-brand/20 transition-all duration-500 hover:shadow-2xl hover:shadow-brand/5">
                                    <div className="h-16 w-16 bg-slate-50 flex items-center justify-center rounded-2xl mb-10 group-hover:scale-110 group-hover:bg-brand transition-all duration-500">
                                        <div className="group-hover:text-white transition-colors duration-500">
                                            {feat.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black mb-6 uppercase tracking-tight">{feat.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium text-sm">
                                        {feat.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Premium Section */}
            <section className="px-6 py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto rounded-[64px] bg-slate-900 p-12 md:p-24 relative overflow-hidden">
                    {/* Animated Glow */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
                    />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-left">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-[1] uppercase">
                                Siap Menguji <br />
                                <span className="text-brand">Skill Bahasa</span><br />
                                Anda Sekarang?
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-lg font-medium">
                                Pendaftaran untuk tes periode Februari telah dibuka. Amankan kursi Anda dan raih sertifikasi idaman Anda sekarang.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => router.push('/register')}
                                    className="bg-brand text-white font-black py-6 px-12 rounded-2xl shadow-2xl shadow-brand/20 hover:scale-105 hover:bg-white hover:text-brand transition-all active:scale-95 text-sm uppercase tracking-widest"
                                >
                                    Daftar Test Sekarang
                                </button>
                                <button
                                    onClick={() => router.push('/contact')}
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
                                { label: "Average Success", value: "92%" }
                            ].map((stat, i) => (
                                <div key={i} className="glass-zinc p-8 rounded-3xl border-white/5">
                                    <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Modern */}
            <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-16 mb-20 px-6">
                        <div className="col-span-2 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-brand rounded-xl flex items-center justify-center text-white">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-lg leading-tight uppercase font-outfit tracking-tighter">Lembaga Bahasa</span>
                                    <span className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">Universitas Widyatama</span>
                                </div>
                            </div>
                            <p className="text-slate-500 max-w-xs leading-relaxed font-medium text-sm">
                                Pusat keunggulan pelatihan dan sertifikasi bahasa sejak 2001. Membantu mahasiswa dan profesional meraih standar kompetensi internasional.
                            </p>
                            <div className="flex gap-4">
                                {[Globe, Mail, Phone].map((Icon, i) => (
                                    <div key={i} className="h-12 w-12 glass flex items-center justify-center rounded-2xl hover:bg-brand hover:text-white transition-all duration-300 cursor-pointer group">
                                        <Icon className="h-5 w-5 opacity-60 group-hover:opacity-100" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-brand mb-10">Resources</h4>
                            <ul className="space-y-6 text-sm font-bold text-slate-500">
                                <li className="hover:text-brand transition-all cursor-pointer flex items-center gap-2 group">
                                    <ArrowRight className="h-4 w-4 -ml-6 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all text-brand" />
                                    EPT Preparation
                                </li>
                                <li className="hover:text-brand transition-all cursor-pointer flex items-center gap-2 group">
                                    <ArrowRight className="h-4 w-4 -ml-6 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all text-brand" />
                                    Toeic Simulation
                                </li>
                                <li className="hover:text-brand transition-all cursor-pointer flex items-center gap-2 group">
                                    <ArrowRight className="h-4 w-4 -ml-6 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all text-brand" />
                                    English Business
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-brand mb-10">Get in Touch</h4>
                            <div className="space-y-8 text-sm font-medium text-slate-500">
                                <div className="flex gap-4">
                                    <MapPin className="h-5 w-5 shrink-0 text-brand" />
                                    <span className="leading-relaxed">Jl. Cikutra No. 204A, Bandung, Jawa Barat</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <Phone className="h-5 w-5 shrink-0 text-brand" />
                                    <span>(022) 7275855</span>
                                </div>
                                <div className="flex gap-4 items-center text-brand font-black">
                                    <ExternalLink className="h-5 w-5 shrink-0" />
                                    <span>widyatama.ac.id</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        <p>© 2024 Lembaga Bahasa Utama. Built with Passion.</p>
                        <div className="flex gap-8">
                            <span className="cursor-pointer hover:text-brand transition-colors">Security</span>
                            <span className="cursor-pointer hover:text-brand transition-colors">Privacy</span>
                            <span className="cursor-pointer hover:text-brand transition-colors">Terms</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
