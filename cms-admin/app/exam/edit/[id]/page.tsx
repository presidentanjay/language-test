import Link from "next/link";
// import { getExam } from "@/app/actions/exam"; // Will implement
import { notFound } from "next/navigation";

export default function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
    //   const { id } = await params;
    //   const exam = await getExam(id);

    //   if (!exam) notFound();

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Edit Exam: {'exam.title'}</h1>
                <div className="flex gap-2">
                    <Link href={`/admin/exam/${'id'}/questions`} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Manage Questions
                    </Link>
                    <Link href="/admin/exam" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        Back to List
                    </Link>
                </div>
            </div>

            {/* <CreateExamForm initialData={exam} /> */}
            <p>Form to edit exam core details (title, dates, etc) goes here.</p>
        </div>
    );
}
