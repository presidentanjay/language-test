"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { ArrowLeft, Clock, BookOpen, Layers, CheckCircle } from "lucide-react";

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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="text-slate-500 font-medium">Preparing your exam session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 group"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-900 p-8 md:p-12 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-blue-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                                {exam?.category}
                            </span>
                            <span className="text-slate-400 text-sm">Exam Code: {examId}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">{exam?.title}</h1>
                        <p className="text-slate-400 max-w-2xl leading-relaxed">
                            {exam?.description || "Prepare yourself for the exam. This session will be recorded and timed. Ensure a stable internet connection."}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Left: Info */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                        Exam Rules & Info
                                    </h3>
                                    <ul className="space-y-4">
                                        {[
                                            "Do not refresh the page during the exam",
                                            "All answers are automatically saved",
                                            "Timer starts immediately after clicking Start Now",
                                            "The result will be calculated automatically at the end"
                                        ].map((rule, i) => (
                                            <li key={i} className="flex gap-3 text-slate-600 text-sm">
                                                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                                {rule}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="font-bold text-slate-900 mb-4">Exam Summary</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600">
                                                <Layers className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Packages</p>
                                                <p className="font-bold text-slate-900">{sections.length}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estimate</p>
                                                <p className="font-bold text-slate-900">120 mins</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Packages */}
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-blue-600" />
                                    Available Packages
                                </h3>

                                <div className="space-y-4 mb-8 flex-1">
                                    {sections.map((section) => (
                                        <div
                                            key={section.id}
                                            className="p-4 rounded-2xl border-2 border-slate-100 bg-white hover:border-blue-600/20 hover:bg-blue-50/30 transition-all cursor-default group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="font-bold text-slate-900">{section.title}</p>
                                                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                                                    {section.section}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 line-clamp-1">{section.description}</p>
                                            <div className="mt-2 text-[10px] text-slate-400 font-medium">
                                                Duration: {section.duration} mins
                                            </div>
                                        </div>
                                    ))}

                                    {sections.length === 0 && (
                                        <p className="text-sm text-slate-400 italic">No packages available for this exam yet.</p>
                                    )}
                                </div>

                                <button
                                    onClick={handleStartTest}
                                    disabled={isEnrolling || sections.length === 0}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {isEnrolling ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                                    ) : (
                                        "Start Exam Now"
                                    )}
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-4">
                                    By clicking start, you agree to our terms and conditions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
