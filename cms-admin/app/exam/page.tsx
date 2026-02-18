import Link from "next/link";
import { getExams } from "@/app/actions/exam";
import ExamListTable from "@/components/ExamListTable";

export const dynamic = 'force-dynamic';

export default async function ManageExamPage() {
    const exams = await getExams();

    return (
        <div className="p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-center border-b-2 border-gray-200 dark:border-gray-700 mb-5 pb-2">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Manage Exams</h1>
                <Link href="/admin/exam/create" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Create New Exam
                </Link>
            </div>

            <ExamListTable exams={exams} />
        </div>
    );
}
