"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
    GraduationCap,
    FileText,
    Users,
    BarChart3,
    Settings,
    Home,
    LogOut,
    Menu,
    CheckCircle2,
    Clock,
    TrendingUp,
    Activity,
    RefreshCw,
    AlertCircle,
    BookOpen,
} from "lucide-react";

interface Stats {
    total_participants: number;
    total_exams: number;
    total_completed: number;
}

interface Enroll {
    id: number;
    user_id: string;
    exam_code: string;
    for: string;
    date: string;
    time: string;
    status: "enrolled" | "working" | "finish";
    expired: "yes" | "no";
    submissions?: any[];
}

interface DashStats {
    stats: Stats;
    recentActivity: Enroll[];
}

interface Me {
    id: number;
    name: string;
    email: string;
    role: string;
}

const sidebarNav = [
    { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
    { icon: <FileText className="h-5 w-5" />, label: "Kelola Ujian", href: "/admin/exams" },
    { icon: <Users className="h-5 w-5" />, label: "Peserta", href: "/admin/users" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "Laporan", href: "/admin/results" },
    { icon: <Settings className="h-5 w-5" />, label: "Pengaturan", href: "/admin/settings" },
];

const statusBadge: Record<string, { label: string; class: string; dot: string }> = {
    enrolled: { label: "Terdaftar", class: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
    working: { label: "Sedang Ujian", class: "bg-amber-50 text-amber-600", dot: "bg-amber-400" },
    finish: { label: "Selesai", class: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
};

export default function AdminResultsPage() {
    const router = useRouter();
    const [me, setMe] = useState<Me | null>(null);
    const [dashStats, setDashStats] = useState<DashStats | null>(null);
    const [monitoring, setMonitoring] = useState<Enroll[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fetchData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const [statsRes, monitoringRes] = await Promise.all([
                api.get("/dashboard/stats"),
                api.get("/monitoring"),
            ]);
            setDashStats(statsRes.data);
            setMonitoring(monitoringRes.data);
        } catch { } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const meRes = await api.get("/me");
                if (meRes.data.role !== "admin") { router.push("/dashboard"); return; }
                setMe(meRes.data);
                await fetchData();
            } catch {
                localStorage.removeItem("token");
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleLogout = () => { localStorage.removeItem("token"); router.push("/"); };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
    );

    const passRate = dashStats && dashStats.stats.total_completed > 0
        ? Math.round((dashStats.stats.total_completed / Math.max(dashStats.stats.total_participants, 1)) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {sidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* ── SIDEBAR ── */}
            <aside className={`fixed top-0 left-0 h-full z-50 w-72 bg-[#060b18] flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}>
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
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {sidebarNav.map((item, i) => {
                        const active = item.href === "/admin/results";
                        return (
                            <button key={i} onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
                                {item.icon}{item.label}
                                {active && <div className="ml-auto h-2 w-2 rounded-full bg-white/60" />}
                            </button>
                        );
                    })}
                </nav>
                <div className="px-4 py-4 border-t border-white/5">
                    <div className="bg-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                                {me?.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-black text-white truncate">{me?.name}</div>
                                <div className="text-[10px] text-slate-500 truncate">{me?.email}</div>
                            </div>
                            <div className="h-6 px-2 bg-amber-500/20 rounded-lg flex items-center shrink-0">
                                <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider">Admin</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <div className="flex-1 min-w-0 flex flex-col">
                <header className="bg-white border-b border-slate-100 h-16 px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-50">
                            <Menu className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-slate-900">Laporan & Nilai</h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">Statistik dan Monitoring Ujian</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => fetchData(true)} disabled={refreshing}
                            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest disabled:opacity-50 group">
                            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                            <span className="hidden sm:block">Refresh</span>
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { val: dashStats?.stats.total_participants ?? 0, label: "Total Peserta", sub: "Terdaftar", icon: <Users className="h-5 w-5 text-blue-600" />, bg: "bg-blue-50" },
                            { val: dashStats?.stats.total_exams ?? 0, label: "Total Ujian", sub: "Program aktif", icon: <FileText className="h-5 w-5 text-indigo-600" />, bg: "bg-indigo-50" },
                            { val: dashStats?.stats.total_completed ?? 0, label: "Ujian Selesai", sub: "Berhasil finish", icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />, bg: "bg-emerald-50" },
                            { val: monitoring.length, label: "Sedang Ujian", sub: "Live sekarang", icon: <Activity className="h-5 w-5 text-amber-600" />, bg: "bg-amber-50" },
                        ].map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-slate-100 transition-all">
                                <div className={`h-10 w-10 ${s.bg} rounded-2xl flex items-center justify-center mb-4`}>{s.icon}</div>
                                <div className="text-3xl font-black text-slate-900 mb-1">{s.val}</div>
                                <div className="text-xs font-black text-slate-900 uppercase tracking-widest">{s.label}</div>
                                <div className="text-[10px] text-slate-400 font-bold mt-1">{s.sub}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Live Monitoring */}
                        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3">
                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                <h3 className="font-black text-slate-900">Monitoring Live</h3>
                                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ml-auto">{monitoring.length} aktif</span>
                            </div>
                            {monitoring.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                                    <Activity className="h-10 w-10 mb-3 text-slate-200" />
                                    <p className="font-black text-sm">Tidak ada peserta aktif</p>
                                    <p className="text-xs text-slate-300 mt-1">Peserta yang sedang ujian akan muncul di sini</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {monitoring.map((enroll, i) => (
                                        <motion.div key={enroll.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                            className="px-6 py-4 grid grid-cols-[1fr_auto] items-center gap-4">
                                            <div>
                                                <div className="font-black text-slate-900 text-sm">ID Peserta #{enroll.user_id}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${enroll.for === "ept" ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"}`}>
                                                        {enroll.for?.toUpperCase()}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                        <BookOpen className="h-3 w-3" /> {enroll.submissions?.length ?? 0} jawaban
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1.5 justify-end">
                                                    <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                                                    <span className="text-[10px] font-black text-amber-600 uppercase">Live</span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold mt-1">{enroll.time}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="font-black text-slate-900">Aktivitas Terbaru</h3>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">5 terakhir</span>
                            </div>
                            {!dashStats?.recentActivity || dashStats.recentActivity.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                                    <Clock className="h-10 w-10 mb-3 text-slate-200" />
                                    <p className="font-black text-sm">Belum ada aktivitas</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {dashStats.recentActivity.map((enroll, i) => {
                                        const badge = statusBadge[enroll.status] ?? statusBadge.enrolled;
                                        return (
                                            <motion.div key={enroll.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                                className="px-6 py-4 grid grid-cols-[1fr_auto] items-center gap-4">
                                                <div>
                                                    <div className="font-black text-slate-900 text-sm">Enroll #{enroll.id}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${enroll.for === "ept" ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"}`}>
                                                            {enroll.for?.toUpperCase()}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold">{enroll.date}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`h-2 w-2 rounded-full ${badge.dot}`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${badge.class}`}>
                                                        {badge.label}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary card */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-8 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-[40px]" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                            <div className="flex-1">
                                <p className="text-blue-200 text-sm font-black uppercase tracking-widest mb-2">Ringkasan Platform</p>
                                <h3 className="text-3xl font-black text-white mb-1">
                                    {dashStats?.stats.total_completed ?? 0} Ujian Selesai
                                </h3>
                                <p className="text-blue-200 text-sm">dari {dashStats?.stats.total_participants ?? 0} peserta terdaftar</p>
                            </div>
                            <div className="flex gap-10">
                                {[
                                    { val: dashStats?.stats.total_exams ?? 0, label: "Program Ujian" },
                                    { val: monitoring.length, label: "Peserta Live" },
                                    { val: `${dashStats?.stats.total_completed ?? 0}`, label: "Selesai" },
                                ].map((s, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-3xl font-black text-white">{s.val}</div>
                                        <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest mt-1">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
