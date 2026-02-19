"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Trophy, CheckCircle, ArrowRight, Home, BarChart2, Star } from "lucide-react";

interface Submission {
    id: number;
    isCorrect: 'yes' | 'no';
}

interface Enroll {
    id: number;
    examCode: string;
    category: string;
    status: string;
    submissions: Submission[];
}

export default function TestResult() {
    const { enrollId } = useParams();
    const router = useRouter();
    const [enroll, setEnroll] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await api.get(`/enrolls/${enrollId}/result`);
                setEnroll(res.data);
            } catch (error) {
                console.error("Failed to fetch result", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [enrollId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="text-slate-500 font-medium">Calculating your score...</p>
                </div>
            </div>
        );
    }

    if (!enroll) return <div className="p-10 text-center">Result not found.</div>;

    const correctAnswers = enroll.submissions?.filter((s: any) => s.isCorrect === 'yes').length || 0;
    const totalQuestions = enroll.submissions?.length || 0;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden text-center">
                    {/* Header Decoration */}
                    <div className="bg-slate-900 pt-16 pb-24 px-8 relative">
                        <div className="relative z-10">
                            <div className="h-24 w-24 bg-blue-600 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-blue-600/50 mx-auto mb-8">
                                <Trophy className="h-12 w-12 text-white -rotate-12" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Certification Completed!</h1>
                            <p className="text-slate-400">Great job completing your {enroll.examCode} assessment.</p>
                        </div>

                        {/* Background Shapes */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600 rounded-full blur-3xl"></div>
                            <div className="absolute top-20 -right-10 w-32 h-32 bg-indigo-600 rounded-full blur-2xl"></div>
                        </div>
                    </div>

                    {/* Result Card Body */}
                    <div className="px-8 pb-12 -mt-12 relative z-20">
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 mb-8">
                            <div className="mb-10">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Final Score Achievement</div>
                                <div className="text-7xl font-black text-slate-900 mb-2">{scorePercentage}%</div>
                                <div className="flex items-center justify-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-5 w-5 ${i < Math.round(scorePercentage / 20) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-50">
                                <div className="text-center">
                                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Correct Answers</div>
                                    <div className="flex items-center justify-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-xl font-bold text-slate-900">{correctAnswers}</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total Questions</div>
                                    <div className="flex items-center justify-center gap-2">
                                        <BarChart2 className="h-4 w-4 text-blue-500" />
                                        <span className="text-xl font-bold text-slate-900">{totalQuestions}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => router.push("/")}
                                className="w-full bg-slate-900 text-white font-bold py-4 px-8 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
                            >
                                <Home className="h-5 w-5" />
                                Return to Dashboard
                            </button>

                            <button
                                className="w-full bg-blue-50 text-blue-600 font-bold py-4 px-8 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                onClick={() => alert("Printing certificate...")}
                            >
                                <ArrowRight className="h-5 w-5" />
                                Download Certificate
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-sm mt-8">
                    Need help? Contact our support team at <span className="text-slate-600 font-medium">support@certification.com</span>
                </p>
            </div>
        </div>
    );
}
