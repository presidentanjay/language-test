"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { useRouter, usePathname } from "next/navigation";
import {
    BookOpen,
    Clock,
    Trophy,
    ChevronRight,
    GraduationCap,
    Users,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    Shield,
    Zap,
    CheckCircle2,
    Home,
    TrendingUp,
    Menu,
    X,
    Bell,
    Search,
} from "lucide-react";

interface Exam {
    id: number;
    title: string;
    category: string;
    description: string;
    duration: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

/* ════════════════════════════════════════
   ADMIN SIDEBAR NAV ITEMS
════════════════════════════════════════ */
const adminNavItems = [
    { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
    { icon: <FileText className="h-5 w-5" />, label: "Kelola Ujian", href: "/admin/exams" },
    { icon: <Users className="h-5 w-5" />, label: "Peserta", href: "/admin/users" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "Laporan", href: "/admin/results" },
    { icon: <Settings className="h-5 w-5" />, label: "Pengaturan", href: "/admin/settings" },
];

export default function Dashboard() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [meRes, examsRes] = await Promise.all([
                    api.get("/me"),
                    api.get("/exams"),
                ]);
                setUser(meRes.data);
                setExams(examsRes.data);
            } catch {
                localStorage.removeItem("token");
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Loading...</span>
                </div>
            </div>
        );
    }

    const isAdmin = user?.role === "admin";

    /* ─── ADMIN LAYOUT ─── */
    if (isAdmin) {
        return (
            <div className="min-h-screen bg-slate-50 flex">
                {/* ── SIDEBAR ── */}
                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside className={`
                    fixed top-0 left-0 h-full z-50 w-72 bg-[#060b18] flex flex-col transition-transform duration-300
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:static lg:z-auto
                `}>
                    {/* Logo */}
                    <div className="px-6 py-8 border-b border-white/5">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <span className="font-black text-white uppercase tracking-tight text-base block leading-tight">Lembaga Bahasa</span>
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Admin Panel</span>
                            </div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {adminNavItems.map((item, i) => {
                            const active = i === 0; // Dashboard is active
                            return (
                                <button
                                    key={i}
                                    onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${active
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                        : "text-slate-500 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                    {active && <div className="ml-auto h-2 w-2 rounded-full bg-white/60" />}
                                </button>
                            );
                        })}
                    </nav>

                    {/* User card */}
                    <div className="px-4 pt-4 pb-2 border-t border-white/5">
                        <div className="bg-white/5 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                                    {user?.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-black text-white truncate">{user?.name}</div>
                                    <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
                                </div>
                                <div className="h-6 px-2 bg-amber-500/20 rounded-lg flex items-center shrink-0">
                                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider">Admin</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <div className="flex-1 min-w-0 flex flex-col">
                    {/* Top bar */}
                    <header className="bg-white border-b border-slate-100 h-16 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-lg font-black text-slate-900">Dashboard</h1>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">Admin Overview</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600">
                                <span className="text-slate-400">Hi,</span> {user?.name?.split(" ")[0]}
                            </div>
                            <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-sm">
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors group ml-2"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:block">Logout</span>
                            </button>
                        </div>
                    </header>

                    {/* Body */}
                    <main className="flex-1 p-6 overflow-y-auto">
                        {/* Welcome banner */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-8 mb-8 overflow-hidden"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                                transition={{ duration: 8, repeat: Infinity }}
                                className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -translate-y-1/2 translate-x-1/3 blur-[60px]"
                            />
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-3">
                                        <Shield className="h-3 w-3 text-white/80" />
                                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Admin Panel</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white mb-2">
                                        Selamat Datang, {user?.name}!
                                    </h2>
                                    <p className="text-blue-100 text-sm">Kelola seluruh sistem ujian Lembaga Bahasa dari sini.</p>
                                </div>
                                <div className="hidden md:block opacity-10">
                                    <Shield className="h-28 w-28 text-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { val: exams.length.toString(), label: "Total Ujian", sub: "Program aktif", icon: <FileText className="h-5 w-5 text-blue-600" />, bg: "bg-blue-50" },
                                { val: "5.8k+", label: "Total Peserta", sub: "Terdaftar", icon: <Users className="h-5 w-5 text-indigo-600" />, bg: "bg-indigo-50" },
                                { val: "92%", label: "Tingkat Lulus", sub: "Rata-rata", icon: <TrendingUp className="h-5 w-5 text-emerald-600" />, bg: "bg-emerald-50" },
                                { val: "2", label: "Program Aktif", sub: "EPT & TOEIC", icon: <Zap className="h-5 w-5 text-amber-600" />, bg: "bg-amber-50" },
                            ].map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-slate-100 transition-all"
                                >
                                    <div className={`h-10 w-10 ${s.bg} rounded-2xl flex items-center justify-center mb-4`}>
                                        {s.icon}
                                    </div>
                                    <div className="text-3xl font-black text-slate-900 mb-1">{s.val}</div>
                                    <div className="text-xs font-black text-slate-900 uppercase tracking-widest">{s.label}</div>
                                    <div className="text-[10px] text-slate-400 font-bold mt-1">{s.sub}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Exam List — full width */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black text-slate-900">Ujian Tersedia</h3>
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                    {exams.length} ujian
                                </span>
                            </div>
                            <div className="space-y-3">
                                {exams.length === 0 ? (
                                    <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
                                        <FileText className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                        <p className="text-sm font-bold text-slate-400">Belum ada ujian tersedia</p>
                                    </div>
                                ) : (
                                    exams.map((exam, i) => (
                                        <motion.div
                                            key={exam.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + i * 0.07 }}
                                            className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-blue-100 hover:shadow-md transition-all cursor-pointer group"
                                            onClick={() => router.push(`/prep/${exam.id}`)}
                                        >
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-[10px] font-black text-white shrink-0 ${exam.category === "ept" ? "bg-blue-600" : "bg-indigo-600"}`}>
                                                {exam.category.toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-black text-slate-900 text-sm truncate">{exam.title}</div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> {exam.duration || 120} Menit
                                                    </span>
                                                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" /> Aktif
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-400 font-bold hidden sm:block">Lihat</span>
                                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    /* ─────────────────────────────────────
       STUDENT DASHBOARD
    ───────────────────────────────────── */
    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 h-20 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="font-black text-lg leading-tight uppercase text-slate-900 block">Lembaga Bahasa</span>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Portal Peserta</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3">
                        <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-sm">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="text-right hidden lg:block">
                            <div className="text-sm font-black text-slate-900">{user?.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold">{user?.email}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors group"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:block">Logout</span>
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 pt-10">
                {/* Welcome */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-gradient-to-r from-slate-900 to-blue-950 rounded-[32px] p-8 mb-10 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-[60px]" />
                    <div className="relative z-10">
                        <p className="text-blue-400 text-sm font-black uppercase tracking-widest mb-2">Portal Peserta</p>
                        <h1 className="text-3xl font-black text-white mb-1">Halo, {user?.name}! 👋</h1>
                        <p className="text-slate-400">Pilih ujian yang ingin Anda ambil hari ini.</p>
                    </div>
                </motion.div>

                {/* Exam cards */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900">Program Sertifikasi</h2>
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{exams.length} tersedia</span>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {exams.map((exam, i) => (
                        <motion.div
                            key={exam.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-600/10 hover:border-blue-100 transition-all duration-500 flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${exam.category === "ept" ? "bg-blue-100 text-blue-700" : "bg-indigo-100 text-indigo-700"
                                    }`}>
                                    {exam.category}
                                </span>
                                <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Trophy className="h-5 w-5" />
                                </div>
                            </div>

                            <h3 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-blue-600 transition-colors">
                                {exam.title}
                            </h3>
                            <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">
                                {exam.description || "Program sertifikasi bahasa profesional standar Universitas Widyatama."}
                            </p>

                            <div className="mt-auto">
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6 pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        {exam.duration || 120} Menit
                                    </div>
                                    <div className="flex items-center gap-1.5 text-blue-600">
                                        <BookOpen className="h-4 w-4" />
                                        Sertifikat Resmi
                                    </div>
                                </div>
                                <button
                                    className="w-full bg-blue-600 text-white font-black py-4 px-6 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 group/btn"
                                    onClick={() => router.push(`/prep/${exam.id}`)}
                                >
                                    Mulai Sertifikasi
                                    <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
