"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import api from '../lib/axios';
import {
    Users,
    FileText,
    CheckCircle2,
    Activity,
    Loader2,
    ArrowUpRight,
    Clock,
    UserCircle
} from 'lucide-react';

interface Stats {
    total_participants: number;
    total_exams: number;
    total_completed: number;
}

interface ActivityItem {
    id: number;
    userId: string;
    examCode: string;
    status: string;
    createdAt: string;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/dashboard/stats');
            setStats(res.data.stats);
            setRecentActivity(res.data.recentActivity);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                    <Loader2 className="h-12 w-12 animate-spin mb-4 text-blue-600" />
                    <p className="font-black uppercase tracking-widest text-xs">Memuat Dashboard...</p>
                </div>
            </AdminLayout>
        );
    }

    const statCards = [
        {
            title: 'Total Peserta',
            value: stats?.total_participants || 0,
            icon: Users,
            color: 'blue',
            description: 'Siswa terdaftar di sistem'
        },
        {
            title: 'Total Sesi Ujian',
            value: stats?.total_exams || 0,
            icon: FileText,
            color: 'indigo',
            description: 'Paket ujian yang tersedia'
        },
        {
            title: 'Ujian Selesai',
            value: stats?.total_completed || 0,
            icon: CheckCircle2,
            color: 'green',
            description: 'Total test yang telah divalidasi'
        }
    ];

    return (
        <AdminLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Statistik Overview</h2>
                    <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">Ringkasan operasional Lembaga Bahasa</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {statCards.map((card, idx) => (
                        <div key={idx} className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 group hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500 translate-y-0 hover:-translate-y-2">
                            <div className="flex items-start justify-between mb-8">
                                <div className={`h-16 w-16 rounded-[22px] bg-${card.color}-50 flex items-center justify-center text-${card.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                                    <card.icon className="h-8 w-8" />
                                </div>
                                <div className="bg-slate-50 p-2 rounded-full">
                                    <ArrowUpRight className="h-4 w-4 text-slate-300" />
                                </div>
                            </div>
                            <h4 className="font-black text-slate-400 uppercase tracking-widest text-[10px] mb-2">{card.title}</h4>
                            <p className="text-5xl font-black text-slate-900 leading-none mb-4">{card.value.toLocaleString()}</p>
                            <p className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-wider">{card.description}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg flex items-center gap-3">
                                <Activity className="h-6 w-6 text-blue-600" />
                                Aktivitas Terbaru
                            </h3>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Live Now</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {recentActivity.length === 0 ? (
                                <div className="p-20 text-center">
                                    <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Belum ada aktivitas terekam.</p>
                                </div>
                            ) : (
                                recentActivity.map((activity) => (
                                    <div key={activity.id} className="p-8 hover:bg-slate-50 transition-colors group flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                                <UserCircle className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">Peserta <span className="text-blue-600">ID #{activity.userId}</span> mendaftar ujian</p>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{activity.examCode}</span>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(activity.createdAt).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${activity.status === 'finish' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {activity.status}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions / Tips */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 h-40 w-40 bg-blue-600 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <h3 className="text-xl font-black mb-6 relative z-10 leading-tight">Mulai Sesi Ujian Baru?</h3>
                            <p className="text-slate-400 text-sm mb-8 relative z-10 font-medium">Buat paket soal baru dan atur jadwal untuk peserta Universitas Widyatama.</p>
                            <button className="w-full bg-white text-slate-900 h-14 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5 relative z-10">
                                Pergi ke Menu Ujian
                            </button>
                        </div>

                        <div className="bg-blue-50 rounded-[40px] p-10 border border-blue-100 group">
                            <h4 className="text-blue-600 font-black uppercase tracking-widest text-[10px] mb-4">System Health</h4>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-blue-900/60 transition-colors uppercase tracking-widest">Database</span>
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-blue-900/60 transition-colors uppercase tracking-widest">Storage</span>
                                <span className="text-xs font-black text-blue-600">92% FREE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
