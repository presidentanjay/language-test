"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import api from '../lib/axios';
import {
    Users,
    Activity,
    RefreshCcw,
    Loader2,
    Clock,
    User,
} from 'lucide-react';

interface Enrollment {
    id: number;
    userId: string;
    examCode: string;
    status: string;
    updatedAt: string;
    user?: {
        name: string;
    };
    meta?: {
        submissions_count: number;
    };
}

export default function Monitoring() {
    const [activeUsers, setActiveUsers] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        fetchMonitoring();
        const interval = setInterval(fetchMonitoring, 10000); // Auto refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const fetchMonitoring = async () => {
        try {
            const res = await api.get('/monitoring');
            setActiveUsers(res.data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to fetch monitoring data', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                            <Activity className="h-6 w-6 text-blue-600 animate-pulse" />
                            Monitoring Peserta Aktif
                        </h2>
                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
                            Terakhir diperbarui: {lastUpdated.toLocaleTimeString()}
                        </p>
                    </div>
                    <button
                        onClick={fetchMonitoring}
                        className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors group"
                    >
                        <RefreshCcw className="h-5 w-5 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Users className="h-6 w-6" />
                            </div>
                            <h4 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Total Sedang Ujian</h4>
                        </div>
                        <p className="text-4xl font-black text-slate-900 leading-none">{activeUsers.length}</p>
                    </div>
                </div>

                {/* Participants Table */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="p-8 border-b border-slate-50">
                        <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Daftar Peserta Real-time</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Peserta</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ujian</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Progress</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Terakhir Aktif</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-24 text-center">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-200" />
                                        </td>
                                    </tr>
                                ) : activeUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-24 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                                            Tidak ada peserta yang sedang mengerjakan ujian saat ini.
                                        </td>
                                    </tr>
                                ) : (
                                    activeUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{user.user?.name || `User ID: ${user.userId}`}</p>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Peserta Ujian</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                    {user.examCode}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Working</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-600 transition-all duration-1000"
                                                            style={{ width: `${Math.min(((user.meta?.submissions_count || 0) / 50) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs">{user.meta?.submissions_count || 0} Soal</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4 justify-between">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                        <Clock className="h-3 w-3" />
                                                        {user.updatedAt ? new Date(user.updatedAt).toLocaleTimeString() : '-'}
                                                    </div>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Reset sesi peserta ini? Semua jawaban akan dihapus.')) {
                                                                try {
                                                                    await api.post(`/exams/${user.id}/reset`);
                                                                    fetchMonitoring();
                                                                } catch (e) {
                                                                    alert('Gagal mereset sesi');
                                                                }
                                                            }
                                                        }}
                                                        className="p-2 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                                        title="Reset Sesi Secara Paksa"
                                                    >
                                                        <RefreshCcw className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
