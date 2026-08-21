import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Users, FileText, Settings, LogOut,
    Activity, Database, Calculator, ClipboardList, GraduationCap,
    Menu, X, ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Peserta', href: '/users', icon: Users },
    { name: 'Bank Soal', href: '/bank-soal', icon: Database },
    { name: 'Ujian', href: '/exams', icon: FileText },
    { name: 'Monitoring', href: '/monitoring', icon: Activity },
    { name: 'Hasil Ujian', href: '/participant-scores', icon: ClipboardList },
    { name: 'Score Management', href: '/score-management', icon: Calculator },
    { name: 'Settings', href: '/settings', icon: Settings },
];

const pageTitles: Record<string, { title: string; sub: string }> = {
    dashboard: { title: 'Dashboard', sub: 'Ringkasan Platform' },
    users: { title: 'Kelola Peserta', sub: 'Manajemen Akun Pengguna' },
    'bank-soal': { title: 'Bank Soal', sub: 'Kelola Soal EPT & TOEIC' },
    exams: { title: 'Kelola Ujian', sub: 'Manajemen Program Ujian' },
    monitoring: { title: 'Monitoring', sub: 'Peserta Aktif Real-time' },
    'participant-scores': { title: 'Hasil Ujian', sub: 'Skor & Nilai Peserta' },
    'score-management': { title: 'Score Management', sub: 'Konfigurasi Skor' },
    settings: { title: 'Pengaturan', sub: 'Konfigurasi Sistem' },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const pageKey = location.pathname.split('/')[1] || 'dashboard';
    const pageInfo = pageTitles[pageKey] || { title: pageKey, sub: 'CMS Admin' };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── SIDEBAR ── */}
            <aside className={`fixed top-0 left-0 h-full z-50 w-72 bg-[#060b18] flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto`}>
                {/* Logo */}
                <div className="px-6 py-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <div className="font-black text-white uppercase tracking-tight text-sm leading-tight">Lembaga Bahasa</div>
                            <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.15em]">CMS Admin</div>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation
                        .filter(item => {
                            if (user?.role === 'supervisor') {
                                return ['Peserta', 'Ujian', 'Monitoring'].includes(item.name);
                            }
                            return true; // Admins see everything
                        })
                        .map((item) => {
                            const isActive = location.pathname.startsWith(item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    {item.name}
                                    {isActive && <ChevronRight className="h-4 w-4 ml-auto opacity-60" />}
                                </Link>
                            );
                        })}
                </nav>

                {/* User + logout */}
                <div className="px-4 py-4 border-t border-white/5">
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="h-5 w-5" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Top bar */}
                <header className="bg-white border-b border-slate-100 h-16 px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-slate-900">{pageInfo.title}</h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">{pageInfo.sub}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2">
                            <div className="h-7 w-7 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-black text-xs">
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-sm font-black text-slate-700">{user?.name}</span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
