"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import { 
    ArrowLeft, 
    Clock, 
    BookOpen, 
    Layers, 
    CheckCircle, 
    ShieldAlert, 
    Info, 
    Zap, 
    ChevronRight,
    Headphones,
    Type,
    Book
} from "lucide-react";

interface Section {
    id: number;
    section: string;
    title: string;
    description: string;
    duration: number;
}

interface Exam {
    id: number;
    title: string;
    category: string;
    description: string;
}

export default function ExamPrep() {
    const { examId } = useParams();
    const router = useRouter();
    const [exam, setExam] = useState<Exam | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [examRes, sectionsRes] = await Promise.all([
                    api.get(`/exams/${examId}`),
                    api.get(`/sections?exam_id=${examId}`)
                ]);
                setExam(examRes.data);
                setSections(sectionsRes.data);
            } catch (error) {
                console.error("Failed to fetch exam details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [examId]);

    const handleStartTest = async () => {
        setIsEnrolling(true);
        try {
            const res = await api.post(`/exams/${examId}/enroll`);
            const enroll = res.data;
            router.push(`/test/${enroll.id}`);
        } catch (error) {
            alert("Failed to enroll in exam. Please try again.");
            setIsEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="h-20 w-20 animate-spin rounded-full border-[6px] border-slate-100 border-t-blue-600"></div>
                        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-600 animate-pulse" />
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Initializing Session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* Top Navigation */}
            <nav className="h-20 px-8 flex items-center bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all group font-bold text-sm"
                >
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <ArrowLeft className="h-5 w-5" />
                    </div>
                    Back to Dashboard
                </button>
            </nav>

            <div className="max-w-6xl mx-auto px-6 mt-12">
                <div className="grid lg:grid-cols-12 gap-12">
                    
                    {/* Left Column: Mission Info */}
                    <div className="lg:col-span-7 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-6">
                                <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{exam?.category} CERTIFICATION</span>
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                                {exam?.title}
                            </h1>
                            <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                {exam?.description || "Persiapkan diri Anda untuk ujian sertifikasi resmi. Pastikan lingkungan tenang dan koneksi internet stabil."}
                            </p>
                        </motion.div>

                        {/* Focus Mode Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3 group-hover:opacity-30 transition-opacity" />
                            
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <ShieldAlert className="h-8 w-8 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Ultra-Focus Mode Active</h3>
                                    <p className="text-blue-200/60 text-xs font-bold uppercase tracking-widest">Anti-Cheat Protocols Enabled</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {[
                                    { text: "Jangan berpindah tab browser", icon: <Layers className="h-4 w-4" /> },
                                    { text: "Jangan minimize jendela ujian", icon: <Zap className="h-4 w-4" /> },
                                    { text: "Sistem timer berbasis server", icon: <Clock className="h-4 w-4" /> },
                                    { text: "Pelanggaran mereset jawaban", icon: <ShieldAlert className="h-4 w-4" /> },
                                ].map((rule, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="text-blue-400">{rule.icon}</div>
                                        <span className="text-sm font-medium text-slate-300">{rule.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Sections Preview */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                <Layers className="h-4 w-4" />
                                Struktur Ujian
                            </h3>
                            <div className="grid gap-4">
                                {sections.map((section, i) => (
                                    <motion.div
                                        key={section.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        className="bg-white border border-slate-200/60 rounded-3xl p-6 flex items-center gap-6 group hover:border-blue-600/20 transition-all"
                                    >
                                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                            {section.section.toLowerCase().includes('listening') ? <Headphones /> : 
                                             section.section.toLowerCase().includes('structure') ? <Type /> : <Book />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{section.title}</h4>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{section.duration} Mins</span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">{section.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Summary & Start */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-[40px] p-10 border border-slate-200/60 shadow-xl shadow-slate-200/40"
                            >
                                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <Info className="h-6 w-6 text-blue-600" />
                                    Ringkasan Sesi
                                </h3>
                                
                                <div className="space-y-6 mb-10">
                                    <div className="flex items-center justify-between py-4 border-b border-slate-50">
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Durasi</span>
                                        <span className="text-lg font-black text-slate-900">120 Menit</span>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-b border-slate-50">
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Bagian</span>
                                        <span className="text-lg font-black text-slate-900">{sections.length} Seksi</span>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-b border-slate-50">
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Metode Penilaian</span>
                                        <span className="text-lg font-black text-blue-600">Scaled Score</span>
                                    </div>
                                </div>

                                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 mb-10">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                            <CheckCircle className="h-6 w-6 text-white" />
                                        </div>
                                        <p className="text-xs text-blue-900/60 leading-relaxed font-bold">
                                            Dengan menekan tombol di bawah, Anda setuju untuk mengikuti tata tertib ujian dan memulai timer sesi Anda.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleStartTest}
                                    disabled={isEnrolling || sections.length === 0}
                                    className="w-full h-20 bg-blue-600 text-white font-black rounded-[24px] shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:grayscale"
                                >
                                    {isEnrolling ? (
                                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-white/20 border-t-white" />
                                    ) : (
                                        <>
                                            <span className="text-lg uppercase tracking-widest">Mulai Ujian Sekarang</span>
                                            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.div>

                            {/* Help Box */}
                            <div className="px-10 py-6 bg-slate-100 rounded-[32px] flex items-center justify-between group cursor-pointer hover:bg-slate-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-white rounded-xl flex items-center justify-center">
                                        <Info className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Butuh Bantuan?</span>
                                </div>
                                <ArrowLeft className="h-4 w-4 text-slate-300 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
