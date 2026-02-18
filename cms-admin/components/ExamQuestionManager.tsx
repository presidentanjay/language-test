"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSection, deleteSection, createQuestion, deleteQuestion } from "@/app/actions/question";
import { useParams } from "next/navigation";

export default function ExamQuestionManager({ exam }: { exam: any }) {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);

    // Simple state for adding section
    const [isAddingSection, setIsAddingSection] = useState(false);

    async function handleAddSection(formData: FormData) {
        setLoading(true);
        await createSection(exam.id, formData);
        setIsAddingSection(false);
        setLoading(false);
        router.refresh();
    }

    async function handleDeleteSection(id: string) {
        if (!confirm("Delete section and all its questions?")) return;
        setLoading(true);
        await deleteSection(id);
        setLoading(false);
        router.refresh();
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">Sections & Questions</h2>
                <button
                    onClick={() => setIsAddingSection(true)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                    + Add Section
                </button>
            </div>

            {isAddingSection && (
                <form action={handleAddSection} className="p-4 mb-6 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <div className="mb-3">
                        <label className="block mb-1 text-sm font-medium">Section Name (e.g., Listening)</label>
                        <input name="section" type="text" className="w-full p-2 border rounded" required />
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1 text-sm font-medium">Title (Optional)</label>
                        <input name="title" type="text" className="w-full p-2 border rounded" />
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1 text-sm font-medium">Description (Optional)</label>
                        <textarea name="description" className="w-full p-2 border rounded" rows={2}></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1 text-sm font-medium">Audio File (Optional)</label>
                        <input name="audio" type="file" className="w-full p-2 text-sm border rounded" />
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                        <button type="button" onClick={() => setIsAddingSection(false)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                    </div>
                </form>
            )}

            <div className="space-y-6">
                {exam.sections.map((section: any) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex justify-between items-start mb-4 border-b pb-2 dark:border-gray-700">
                            <div>
                                <h3 className="font-bold text-lg dark:text-white">{section.section.toUpperCase()} {section.title && `- ${section.title}`}</h3>
                                {section.description && <p className="text-sm text-gray-500 dark:text-gray-400">{section.description}</p>}
                                {section.audio && (
                                    <div className="mt-1">
                                        <audio controls src={`/${section.audio}`} className="h-8 w-60" />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button className="text-blue-600 text-sm hover:underline" onClick={() => alert("Edit section logic")}>Edit</button>
                                <button className="text-red-600 text-sm hover:underline" onClick={() => handleDeleteSection(section.id)}>Delete</button>
                            </div>
                        </div>

                        {/* Questions List */}
                        <QuestionsList section={section} />
                    </div>
                ))}

                {exam.sections.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No sections created yet.</p>
                )}
            </div>
        </div>
    );
}

function QuestionsList({ section }: { section: any }) {
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);

    async function handleAddQuestion(formData: FormData) {
        await createQuestion(section.id, formData);
        setIsAdding(false);
        router.refresh();
    }

    async function handleDeleteQuestion(id: string) {
        if (!confirm("Delete question?")) return;
        await deleteQuestion(id);
        router.refresh();
    }

    return (
        <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Questions ({section.questions.length})</h4>
                <button onClick={() => setIsAdding(true)} className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">+ Add Question</button>
            </div>

            {isAdding && (
                <form action={handleAddQuestion} className="mb-4 p-3 bg-gray-50 rounded dark:bg-gray-700">
                    <div className="mb-2">
                        <label className="block text-xs font-bold mb-1">Question Text</label>
                        {/* Rich text editor ideally, for now textarea */}
                        <textarea name="question" required className="w-full p-2 text-sm border rounded" rows={3}></textarea>
                    </div>
                    <div className="mb-2">
                        <label className="block text-xs font-bold mb-1">Audio (Optional)</label>
                        <input name="audio" type="file" className="w-full text-xs" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                        {['A', 'B', 'C', 'D'].map((opt) => (
                            <div key={opt}>
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="font-bold text-xs">{opt}</span>
                                    <input type="radio" name="correct_answer" value={opt} required className="w-3 h-3" />
                                    <span className="text-xs text-gray-500">Correct?</span>
                                </div>
                                <input name={`answer_${opt}`} placeholder={`Answer ${opt}`} required className="w-full p-1.5 text-sm border rounded" />
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 mt-2">
                        <button type="submit" className="text-xs bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                        <button type="button" onClick={() => setIsAdding(false)} className="text-xs bg-gray-300 px-3 py-1 rounded">Cancel</button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {section.questions.map((q: any, idx: number) => (
                    <div key={q.id} className="p-3 bg-white border border-gray-200 rounded shadow-sm dark:bg-gray-900 dark:border-gray-700">
                        <div className="flex justify-between">
                            <div className="flex-1">
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-500">#{idx + 1}</span>
                                    <div dangerouslySetInnerHTML={{ __html: q.question }} className="text-sm prose dark:prose-invert" />
                                </div>
                                {q.audio && <audio controls src={`/${q.audio}`} className="h-6 w-40 mt-1" />}

                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    {q.answers.map((a: any) => (
                                        <div key={a.id} className={`flex items-center gap-1 ${a.is_correct === 'yes' ? 'text-green-600 font-bold' : ''}`}>
                                            <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">{a.is_correct === 'yes' ? '✓' : '•'}</span>
                                            {a.answer}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-500 hover:text-red-700 self-start ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
