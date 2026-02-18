"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import api from '../lib/axios';
import {
    Plus,
    Trash2,
    ArrowLeft,
    Loader2,
    Pencil,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

interface Answer {
    id: number;
    answer: string;
    isCorrect: 'yes' | 'no';
}

interface Question {
    id: number;
    question: string;
    answers: Answer[];
}

interface Section {
    id: number;
    title: string;
    section: string;
}

export default function ManageQuestions() {
    const { sectionId } = useParams();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [section, setSection] = useState<Section | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        question: '',
        answers: [
            { answer: '', isCorrect: 'yes' as const },
            { answer: '', isCorrect: 'no' as const },
            { answer: '', isCorrect: 'no' as const },
            { answer: '', isCorrect: 'no' as const },
        ]
    });

    useEffect(() => {
        fetchQuestions();
    }, [sectionId]);

    const fetchQuestions = async () => {
        try {
            const [qRes, sRes] = await Promise.all([
                api.get(`/questions?section_id=${sectionId}`),
                api.get(`/sections/${sectionId}`)
            ]);
            setQuestions(qRes.data);
            setSection(sRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddOption = () => {
        setFormData({
            ...formData,
            answers: [...formData.answers, { answer: '', isCorrect: 'no' }]
        });
    };

    const handleRemoveOption = (index: number) => {
        const newAnswers = [...formData.answers];
        newAnswers.splice(index, 1);
        setFormData({ ...formData, answers: newAnswers });
    };

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...formData.answers];
        newAnswers[index].answer = value;
        setFormData({ ...formData, answers: newAnswers });
    };

    const handleSetCorrect = (index: number) => {
        const newAnswers = formData.answers.map((a, i) => ({
            ...a,
            isCorrect: i === index ? ('yes' as const) : ('no' as const)
        }));
        setFormData({ ...formData, answers: newAnswers });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/questions', {
                section_id: sectionId,
                ...formData
            });
            setIsModalOpen(false);
            fetchQuestions();
            setFormData({
                question: '',
                answers: [
                    { answer: '', isCorrect: 'yes' },
                    { answer: '', isCorrect: 'no' },
                    { answer: '', isCorrect: 'no' },
                    { answer: '', isCorrect: 'no' },
                ]
            });
        } catch (error) {
            alert('Failed to save question');
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteQuestion = async (id: number) => {
        if (!window.confirm('Hapus pertanyaan ini?')) return;
        try {
            await api.delete(`/questions/${id}`);
            setQuestions(questions.filter(q => q.id !== id));
        } catch (error) {
            alert('Failed to delete question');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => window.history.back()} className="p-2 text-slate-400 hover:text-slate-900 transition-colors bg-white rounded-xl shadow-sm">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Kelola Soal</h2>
                        <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{section?.title} - {section?.section}</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-slate-900 shadow-xl shadow-slate-900/10">
                        <Plus className="h-4 w-4" />
                        Tambah Pertanyaan
                    </Button>
                </div>

                {/* Questions List */}
                <div className="grid gap-6">
                    {loading ? (
                        <div className="text-center py-24 text-slate-400">
                            <Loader2 className="mx-auto h-12 w-12 animate-spin mb-4" />
                            Memuat daftar soal...
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="rounded-[40px] border-2 border-dashed border-slate-100 bg-white p-24 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Belum ada soal untuk paket ini.
                        </div>
                    ) : (
                        questions.map((q, idx) => (
                            <div key={q.id} className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 p-10 group overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-start gap-4">
                                        <span className="flex items-center justify-center h-10 w-10 rounded-2xl bg-slate-50 text-slate-900 font-black text-sm">
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-bold text-slate-900 leading-relaxed">{q.question}</h4>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors bg-slate-50 rounded-xl">
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteQuestion(q.id)}
                                            className="p-2 text-slate-300 hover:text-red-600 transition-colors bg-slate-50 rounded-xl"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.answers.map((a) => (
                                        <div
                                            key={a.id}
                                            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${a.isCorrect === 'yes'
                                                ? 'bg-blue-50 border-blue-600/20 text-blue-700'
                                                : 'bg-white border-slate-50 text-slate-500'
                                                }`}
                                        >
                                            {a.isCorrect === 'yes' ? (
                                                <CheckCircle2 className="h-5 w-5 shrink-0" />
                                            ) : (
                                                <div className="h-5 w-5 rounded-full border-2 border-slate-200 shrink-0"></div>
                                            )}
                                            <span className="font-bold text-sm tracking-tight">{a.answer}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Question Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Tambah Pertanyaan Baru"
                >
                    <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1">
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 block">Pertanyaan</label>
                            <textarea
                                className="w-full h-32 p-5 rounded-3xl bg-slate-50 border-2 border-slate-100 focus:outline-none focus:border-blue-600/20 focus:ring-8 focus:ring-blue-600/5 transition-all font-bold text-slate-900"
                                required
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                placeholder="Masukkan teks pertanyaan di sini..."
                            ></textarea>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Pilihan Jawaban</label>
                                <button
                                    type="button"
                                    onClick={handleAddOption}
                                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                                >
                                    <Plus className="h-3 w-3" />
                                    Tambah Opsi
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.answers.map((ans, idx) => (
                                    <div key={idx} className="flex items-center gap-3 group">
                                        <button
                                            type="button"
                                            onClick={() => handleSetCorrect(idx)}
                                            className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${ans.isCorrect === 'yes'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                                                }`}
                                        >
                                            <CheckCircle2 className="h-5 w-5" />
                                        </button>
                                        <input
                                            className="flex-1 h-12 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-blue-600/20 transition-all text-slate-900"
                                            placeholder={`Opsi ${idx + 1}`}
                                            required
                                            value={ans.answer}
                                            onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                        />
                                        {formData.answers.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOption(idx)}
                                                className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-8 border-t">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-black text-white px-8">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Soal'
                                )}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
