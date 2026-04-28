"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, Flag, Loader2, AlertCircle, ShieldAlert } from "lucide-react";

interface Answer {
    id: number;
    answer: string;
}

interface Question {
    id: number;
    question: string;
    direction: string | null;
    audio: string | null;
    ordering: number;
    answers: Answer[];
}

interface SectionAudio {
    id: number;
    audioUrl: string;
    fromQuestion: number;
    toQuestion: number;
}

interface Section {
    id: number;
    title: string;
    section: string;
    duration: number;
    audio: string | null;
    questions: Question[];
    sectionAudios?: SectionAudio[];
}

export default function TestEngine() {
    const { enrollId } = useParams();
    const router = useRouter();
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(7200); // 120 mins default
    const [submissions, setSubmissions] = useState<Record<number, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [violation, setViolation] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    // Autosave timer
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const violationTriggered = useRef(false);

    // ─── ANTI-CHEAT: Reset exam on violation ───
    const handleViolation = useCallback(async () => {
        // Prevent multiple triggers
        if (violationTriggered.current) return;
        violationTriggered.current = true;
        setViolation(true);
        setIsResetting(true);

        try {
            await api.post(`/enrolls/${enrollId}/reset`);
        } catch (error) {
            console.error("Failed to reset exam", error);
        } finally {
            setIsResetting(false);
        }
    }, [enrollId]);

    // ─── ANTI-CHEAT: Detect tab switch / minimize ───
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !violationTriggered.current) {
                handleViolation();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [handleViolation]);

    // ─── ANTI-CHEAT: Block browser back button ───
    useEffect(() => {
        // Push a dummy state so pressing back pops our state instead of navigating
        window.history.pushState({ testGuard: true }, "");

        const handlePopState = (e: PopStateEvent) => {
            if (!violationTriggered.current) {
                // Push state again to keep them on this page, then trigger violation
                window.history.pushState({ testGuard: true }, "");
                handleViolation();
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [handleViolation]);

    // ─── ANTI-CHEAT: Warn on tab close / refresh ───
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!violationTriggered.current) {
                e.preventDefault();
                // Modern browsers ignore custom messages but will still show a prompt
                e.returnValue = "Anda sedang mengerjakan ujian. Jika meninggalkan halaman, ujian akan direset!";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const res = await api.get(`/enrolls/${enrollId}/questions`);
            setSections(res.data);

            // Fetch existing submissions/progress if any
            const resultRes = await api.get(`/enrolls/${enrollId}/result`);
            const subData: Record<number, number> = {};
            resultRes.data.submissions?.forEach((s: any) => {
                subData[s.questionId] = s.answerId;
            });
            setSubmissions(subData);
        } catch (error) {
            console.error("Failed to fetch questions", error);
        } finally {
            setLoading(false);
        }
    }, [enrollId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Timer logic
    useEffect(() => {
        if (loading || sections.length === 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [loading, sections]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = async (questionId: number, answerId: number) => {
        setSubmissions(prev => ({ ...prev, [questionId]: answerId }));
        try {
            await api.post(`/enrolls/${enrollId}/submit`, {
                question_id: questionId,
                answer_id: answerId
            });
        } catch (error) {
            console.error("Failed to save answer", error);
        }
    };

    const handleFinish = async () => {
        if (!window.confirm("Are you sure you want to finish the exam?")) return;
        setIsSubmitting(true);
        try {
            await api.post(`/enrolls/${enrollId}/finish`);
            // Remove the anti-cheat guard before navigating
            violationTriggered.current = true;
            router.push(`/result/${enrollId}`);
        } catch (error) {
            alert("Failed to submit exam. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    // ─── VIOLATION SCREEN ───
    if (violation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white rounded-3xl p-10 shadow-2xl shadow-red-100 border border-red-100 text-center">
                        <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <ShieldAlert className="h-10 w-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-3">
                            Pelanggaran Terdeteksi!
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-2">
                            Anda terdeteksi membuka tab lain atau mencoba meninggalkan halaman ujian.
                        </p>
                        <p className="text-red-600 font-bold text-sm mb-8">
                            Seluruh jawaban Anda telah direset. Anda harus mengulang ujian dari awal.
                        </p>
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-8">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                <div className="text-left">
                                    <p className="text-xs font-bold text-red-800 mb-1">Peraturan Ujian:</p>
                                    <ul className="text-xs text-red-600 space-y-1">
                                        <li>• Dilarang membuka tab atau jendela lain</li>
                                        <li>• Dilarang meminimalkan browser</li>
                                        <li>• Dilarang menekan tombol back browser</li>
                                        <li>• Pelanggaran akan mereset semua jawaban</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                violationTriggered.current = true;
                                router.push("/dashboard");
                            }}
                            disabled={isResetting}
                            className="w-full bg-red-600 text-white font-black py-4 px-8 rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-200 active:scale-[0.98] disabled:opacity-50"
                        >
                            {isResetting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Mereset Ujian...
                                </>
                            ) : (
                                "Kembali ke Dashboard"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentSection = sections[currentSectionIndex];
    if (!currentSection) return <div>No exam data found.</div>;

    const currentQuestion = currentSection.questions[currentQuestionIndex];
    const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);
    const answeredCount = Object.keys(submissions).length;

    // Find active audio segment for the current question number (currentQuestionIndex + 1)
    const activeAudioSegment = currentSection.sectionAudios?.find(
        seg => (currentQuestionIndex + 1) >= seg.fromQuestion && (currentQuestionIndex + 1) <= seg.toQuestion
    );

    // Fallback to section.audio if no segments or no active segment found
    const displayAudioUrl = activeAudioSegment?.audioUrl || currentSection.audio;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 text-white p-2 rounded-lg">
                        <GradCap className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-900">Official Certification</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{currentSection.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                        <Clock className={`h-4 w-4 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                        <span className={`text-sm font-mono font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-slate-700'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                    <button
                        onClick={handleFinish}
                        disabled={isSubmitting}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all px-4 py-2 rounded-xl text-sm font-bold border border-red-100"
                    >
                        {isSubmitting ? 'Submitting...' : 'Finish Test'}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Navigation Sidebar */}
                <aside className="w-80 bg-white border-r border-slate-200 hidden lg:flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4 flex justify-between items-center">
                            Questions
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                {answeredCount}/{totalQuestions}
                            </span>
                        </h3>
                        {/* Progress bar */}
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {sections.map((section, sIndex) => (
                            <div key={section.id} className="mb-8 last:mb-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                    {section.title}
                                </p>
                                <div className="grid grid-cols-5 gap-2">
                                    {section.questions.map((q, qIndex) => {
                                        const isCurrent = currentSectionIndex === sIndex && currentQuestionIndex === qIndex;
                                        const isAnswered = submissions[q.id] !== undefined;
                                        return (
                                            <button
                                                key={q.id}
                                                onClick={() => {
                                                    setCurrentSectionIndex(sIndex);
                                                    setCurrentQuestionIndex(qIndex);
                                                }}
                                                className={`h-10 w-10 text-xs font-bold rounded-lg transition-all border ${isCurrent
                                                        ? 'bg-slate-900 text-white border-slate-900 scale-110 shadow-lg shadow-slate-900/20'
                                                        : isAnswered
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                                                    }`}
                                            >
                                                {qIndex + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Workspace */}
                <main className="flex-1 overflow-y-auto p-6 md:p-12">
                    <div className="max-w-3xl mx-auto">
                        {/* Section Audio Player (Listening) */}
                        {displayAudioUrl && (
                            <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 rounded-2xl p-5 mb-6 border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-blue-800 uppercase tracking-wider">
                                            {activeAudioSegment ? `Listening Segment (Q${activeAudioSegment.fromQuestion}-Q${activeAudioSegment.toQuestion})` : 'Listening Audio'}
                                        </p>
                                        <p className="text-[10px] text-blue-500">{currentSection.title}</p>
                                    </div>
                                </div>
                                <audio
                                    key={displayAudioUrl} // Force re-render/reload when audio changes
                                    controls
                                    className="w-full h-10"
                                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}${displayAudioUrl}`}
                                >
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}

                        {/* Question Content */}
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
                            {/* Metadata */}
                            <div className="flex justify-between items-center mb-10">
                                <div className="text-sm font-bold text-blue-600">Question {currentQuestionIndex + 1}</div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Flag className="h-4 w-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Report Problem</span>
                                </div>
                            </div>

                            {/* Audio / Direction */}
                            {(currentQuestion.audio || currentQuestion.direction) && (
                                <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    {currentQuestion.direction && (
                                        <p className="text-sm text-slate-500 italic mb-4 whitespace-pre-line">{currentQuestion.direction}</p>
                                    )}
                                    {currentQuestion.audio && (
                                        <audio controls className="w-full">
                                            <source src={currentQuestion.audio} type="audio/mpeg" />
                                        </audio>
                                    )}
                                </div>
                            )}

                            {/* The Question */}
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-10 leading-relaxed">
                                {currentQuestion.question}
                            </h2>

                            {/* Answers Options */}
                            <div className="grid gap-4 mt-auto">
                                {currentQuestion.answers.map((answer, index) => {
                                    const optionChar = String.fromCharCode(65 + index);
                                    const isSelected = submissions[currentQuestion.id] === answer.id;
                                    return (
                                        <button
                                            key={answer.id}
                                            onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                                            className={`flex items-center p-5 rounded-2xl border-2 transition-all text-left group ${isSelected
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                    : 'bg-white border-slate-100 hover:border-blue-600 px-6'
                                                }`}
                                        >
                                            <span className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold mr-4 transition-colors ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white'
                                                }`}>
                                                {optionChar}
                                            </span>
                                            <span className={`font-semibold text-lg ${isSelected ? 'text-white' : 'text-slate-700'}`}>{answer.answer}</span>
                                            {isSelected && <CheckCircle className="h-6 w-6 ml-auto" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Navigation Buttons footer in mobile or main flow */}
                        <div className="mt-8 flex items-center justify-between">
                            <button
                                onClick={() => {
                                    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
                                    else if (currentSectionIndex > 0) {
                                        const prevSIndex = currentSectionIndex - 1;
                                        setCurrentSectionIndex(prevSIndex);
                                        setCurrentQuestionIndex(sections[prevSIndex].questions.length - 1);
                                    }
                                }}
                                disabled={currentQuestionIndex === 0 && currentSectionIndex === 0}
                                className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                            >
                                <ChevronLeft className="h-5 w-5" />
                                Previous
                            </button>

                            <button
                                onClick={() => {
                                    if (currentQuestionIndex < currentSection.questions.length - 1) {
                                        setCurrentQuestionIndex(prev => prev + 1);
                                    } else if (currentSectionIndex < sections.length - 1) {
                                        setCurrentSectionIndex(prev => prev + 1);
                                        setCurrentQuestionIndex(0);
                                    }
                                }}
                                disabled={currentQuestionIndex === currentSection.questions.length - 1 && currentSectionIndex === sections.length - 1}
                                className="bg-slate-900 text-white font-bold py-3 px-8 rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                            >
                                Next Question
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function GradCap(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    )
}
