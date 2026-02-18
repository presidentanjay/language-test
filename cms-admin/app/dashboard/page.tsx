import { getExams } from "@/app/actions/exam";
import ExamCard from "@/components/ExamCard";

export const dynamic = 'force-dynamic'; // Ensure fresh data

export default async function AdminDashboard() {
    const exams = await getExams();

    return (
        <div className="p-4 sm:ml-64">
            {/* sm:ml-64 matches the sidebar width in layout.tsx */}
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h1>

            <div className="flex flex-wrap gap-5">
                {exams.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No exams found. Please run seeder or create one.</p>
                ) : (
                    exams.map((exam) => (
                        <ExamCard key={Number(exam.id)} exam={exam} />
                    ))
                )}
            </div>
        </div>
    );
}
