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
    Camera,
    X,
    Ban,
    Eye,
} from 'lucide-react';

interface Enrollment {
    id: number;
    userId: string;
    examCode: string;
    status: string;
    updatedAt: string;
    user?: {
        name: string;
        profile?: {
            facePhoto: string | null;
            ktmPhoto: string | null;
        };
    };
    meta?: {
        submissions_count: number;
    };
    snapshots?: Array<{ id: number; photoUrl: string; snapshotType: string; createdAt: string }>;
}

export default function Monitoring() {
    const [activeUsers, setActiveUsers] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [selectedUser, setSelectedUser] = useState<Enrollment | null>(null);

    const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3333/api').replace('/api', '');

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

    const fetchActiveUsers = fetchMonitoring;

    const handleUnblock = async (enrollId: number) => {
        try {
            await api.post(`/enrolls/${enrollId}/unblock`);
            fetchMonitoring(); // Refresh list
        } catch (error) {
            console.error('Failed to unblock participant', error);
            alert('Gagal membuka blokir peserta.');
        }
    };

    const handleKick = async (enrollId: number) => {
        if (!window.confirm('Apakah Anda yakin ingin mengeluarkan peserta ini?')) return;
        try {
            await api.post(`/enrolls/${enrollId}/block`);
            fetchActiveUsers();
        } catch (error) {
            console.error('Failed to kick user', error);
            alert('Gagal mengeluarkan peserta');
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
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Verifikasi Wajah</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-24 text-center">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-200" />
                                        </td>
                                    </tr>
                                ) : activeUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-24 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">
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
                                                {user.status === 'enrolled' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                                        Belum Mulai
                                                    </span>
                                                ) : user.status === 'kick' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest animate-pulse border border-red-200">
                                                        BLOCKED
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                                        Mengerjakan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-blue-600 rounded-full"
                                                            style={{ width: `${Math.min(100, ((user.meta?.submissions_count || 0) / 140) * 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">
                                                        {user.meta?.submissions_count || 0} Jwb
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {new Date(user.updatedAt).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            {/* Face Verification Column */}
                                            <td className="px-8 py-5">
                                                <div
                                                    className="flex items-center gap-2 cursor-pointer group"
                                                    onClick={() => setSelectedUser(user)}
                                                >
                                                    {/* Registration face photo */}
                                                    <div className="relative">
                                                        {user.user?.profile?.facePhoto ? (
                                                            <img
                                                                src={BACKEND_URL + user.user.profile.facePhoto}
                                                                alt="Face"
                                                                className="h-10 w-10 rounded-full object-cover border-2 border-slate-200 group-hover:border-blue-400 transition-colors"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200">
                                                                <User className="h-4 w-4 text-slate-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Latest snapshot */}
                                                    <div className="relative">
                                                        {user.snapshots?.[0]?.photoUrl ? (
                                                            <img
                                                                src={BACKEND_URL + user.snapshots[0].photoUrl}
                                                                alt="Snapshot"
                                                                className="h-10 w-10 rounded-full object-cover border-2 border-slate-200 group-hover:border-blue-400 transition-colors"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200">
                                                                <Camera className="h-4 w-4 text-slate-300" />
                                                            </div>
                                                        )}
                                                        {(user.snapshots?.length || 0) > 0 && (
                                                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center">
                                                                {user.snapshots!.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Eye className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500 transition-colors ml-1" />
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {user.status === 'kick' && (
                                                        <button
                                                            onClick={() => handleUnblock(user.id)}
                                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl uppercase tracking-widest shadow-lg shadow-red-200 active:scale-95 transition-all"
                                                        >
                                                            UNBLOCK
                                                        </button>
                                                    )}
                                                    {user.status !== 'kick' && user.status !== 'enrolled' && (
                                                        <button
                                                            onClick={() => handleKick(user.id)}
                                                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-xl uppercase tracking-widest shadow-lg shadow-orange-200 active:scale-95 transition-all flex items-center gap-1.5"
                                                        >
                                                            <Ban className="h-3 w-3" />
                                                            KICK
                                                        </button>
                                                    )}
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

            {/* Snapshot Gallery Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6" onClick={() => setSelectedUser(null)}>
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">
                                    {selectedUser.user?.name || `User ID: ${selectedUser.userId}`}
                                </h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Verifikasi Wajah — {selectedUser.examCode}</p>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            >
                                <X className="h-5 w-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left: Registration Photo */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Foto Pendaftaran</p>
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                        {selectedUser.user?.profile?.facePhoto ? (
                                            <img
                                                src={BACKEND_URL + selectedUser.user.profile.facePhoto}
                                                alt="Registration face"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-center">
                                                    <User className="h-16 w-16 text-slate-200 mx-auto mb-2" />
                                                    <p className="text-xs text-slate-300 font-bold">Tidak ada foto</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Snapshots Grid */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                        Snapshot Ujian ({selectedUser.snapshots?.length || 0})
                                    </p>
                                    {(!selectedUser.snapshots || selectedUser.snapshots.length === 0) ? (
                                        <div className="aspect-[3/4] rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                            <div className="text-center">
                                                <Camera className="h-12 w-12 text-slate-200 mx-auto mb-2" />
                                                <p className="text-xs text-slate-300 font-bold">Belum ada snapshot</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedUser.snapshots.map((snap) => (
                                                <div key={snap.id} className="relative group">
                                                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                                        <img
                                                            src={BACKEND_URL + snap.photoUrl}
                                                            alt={`Snapshot ${snap.id}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="mt-1.5">
                                                        <p className="text-[9px] font-bold text-slate-400">
                                                            {new Date(snap.createdAt).toLocaleTimeString()}
                                                        </p>
                                                        <p className="text-[9px] font-black text-slate-300 uppercase">
                                                            {snap.snapshotType}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
