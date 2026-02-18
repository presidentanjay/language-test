import Link from "next/link";
import { getExam } from "@/app/actions/exam";
import ExamQuestionManager from "@/components/ExamQuestionManager";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ManageExamQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const exam = await getExam(id);

    if (!exam) notFound();

    return (
        <div className="p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                    <Link href="/admin/exam" className="text-sm text-blue-600 hover:underline mb-1 inline-block">&larr; Back to Exams</Link>
                    <h1 className="text-2xl font-bold dark:text-white">Manage Questions: {exam.title}</h1>
                    <p className="text-gray-500 text-sm">Code: {exam.code} | Category: {exam.category.toUpperCase()}</p>
                </div>
            </div>

            <ExamQuestionManager exam={exam} />
        </div>
    );
}
