"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteExam } from "@/app/actions/exam"; // We need to export this from actions/exam

export default function ExamListTable({ exams }: { exams: any[] }) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this exam?")) return;

        setIsDeleting(id);
        await deleteExam(id);
        setIsDeleting(null);
    };

    return (
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 display dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">No</th>
                        <th scope="col" className="px-6 py-3">Code</th>
                        <th scope="col" className="px-6 py-3">Title</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center">No exams found.</td>
                        </tr>
                    )}
                    {exams.map((exam, index) => (
                        <tr key={exam.id} className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {index + 1}
                            </th>
                            <td className="px-6 py-4">{exam.code}</td>
                            <td className="px-6 py-4">{exam.title}</td>
                            <td className="px-6 py-4 uppercase">{exam.category}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${exam.activated === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {exam.activated === 'yes' ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDelete(exam.id)}
                                        disabled={isDeleting === exam.id}
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                    >
                                        {isDeleting === exam.id ? '...' : 'Delete'}
                                    </button>
                                    <Link href={`/admin/exam/edit/${exam.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        Edit
                                    </Link>
                                    <Link href={`/admin/exam/${exam.id}/questions`} className="font-medium text-green-600 dark:text-green-500 hover:underline">
                                        Questions
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
