"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, Trophy, ChevronRight, GraduationCap } from "lucide-react";

interface Exam {
    id: number;
    title: string;
    category: string;
    description: string;
    duration: number;
}

export default function StudentDashboard() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await api.get('/exams');
                setExams(res.data);
            } catch (error) {
                console.error("Failed to fetch exams", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 h-20 px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-lg leading-tight tracking-tight uppercase">Lembaga Bahasa</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Dashboard</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push('/dashboard/history')}
                        className="text-xs font-bold text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors"
                    >
                        Riwayat & Sertifikat
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            router.push('/');
                        }}
                        className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 pt-12">
                <div className="flex flex-col gap-10">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900">Program Sertifikasi Tersedia</h2>
                        <p className="text-slate-500 mt-2">Pilih ujian yang ingin Anda ambil hari ini.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {exams.map((exam) => (
                            <div
                                key={exam.id}
                                className="group bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-2xl hover:shadow-blue-600/10 hover:border-blue-600/20 transition-all duration-500 flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${exam.category === 'ept'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-indigo-100 text-indigo-700'
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
                                    {exam.description || 'Program sertifikasi bahasa profesional standar Universitas Widyatama.'}
                                </p>

                                <div className="mt-auto">
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-8 pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            {exam.duration || 120} Mins
                                        </div>
                                        <div className="flex items-center gap-1.5 text-blue-600">
                                            <BookOpen className="h-4 w-4" />
                                            Sertifikat Resmi
                                        </div>
                                    </div>

                                    <button
                                        className="w-full bg-slate-900 text-white font-black py-4 px-6 rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95 group/btn"
                                        onClick={() => router.push(`/prep/${exam.id}`)}
                                    >
                                        Mulai Sertifikasi
                                        <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
