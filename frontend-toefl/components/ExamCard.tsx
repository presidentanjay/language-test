"use client";

import { useState } from "react";
import { Exam } from "@prisma/client";
import { toggleExamActivation, deleteExam, goToExamControl } from "@/app/actions/exam";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Helper to serialize BigInt
const serialize = (obj: any): any => {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    ));
}

export default function ExamCard({ exam: rawExam }: { exam: Exam }) {
    const exam = serialize(rawExam); // Handle BigInt for client
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStartModal, setShowStartModal] = useState(false);

    const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await toggleExamActivation(Number(exam.id), e.target.checked);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        await deleteExam(Number(exam.id));
        setIsDeleting(false);
        setShowDeleteModal(false);
    };

    return (
        <div className="w-full md:w-5/12 p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h1 className="pb-1 text-2xl font-semibold text-gray-900 border-b-2 border-gray-200 dark:border-gray-700 dark:text-white">
                STARTING {exam.category === "ept" ? "EPT" : "TOEIC"}
            </h1>

            <div className="flex justify-between mt-5">
                <div className="flex items-center gap-3">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-full me-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
                        {/* Time diff - tedious to implement perfectly client side without date-fns, roughly: */}
                        {exam.updated_at ? formatDistanceToNow(new Date(exam.updated_at), { addSuffix: true }) : ''}
                    </span>
                    {exam.status === 'publish' ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-green-400 border border-green-400">Published</span>
                    ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 border border-gray-500">Draft</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 ms-3 dark:text-gray-300">Activate</span>
                    <label className={`relative inline-flex items-center ${exam.status === 'progress' ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            disabled={exam.status === 'progress'}
                            defaultChecked={exam.activated === 'yes'}
                            onChange={handleToggle}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <div className="mt-5 space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <input type="text" disabled value={exam.title} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Exam Code</label>
                    <input type="text" disabled value={exam.code} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                {/* Question Count omitted for now (need relation count) */}
            </div>

            <div className="flex justify-between gap-2 mt-5">
                <div className="flex gap-2">
                    <a href={exam.conference_link || '#'} target="_blank" className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800">
                        Conference
                    </a>
                    <button
                        onClick={() => setShowStartModal(true)}
                        disabled={exam.activated === 'no'}
                        className="px-5 py-2.5 text-sm font-medium text-white disabled:bg-gray-500 disabled:cursor-not-allowed bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Go
                    </button>
                </div>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-white bg-white px-3 py-2.5 text-sm hover:bg-red-100 border border-red-200 focus:ring-4 focus:outline-none focus:ring-red-100 font-medium rounded-lg text-center inline-flex items-center dark:focus:ring-red-600 dark:bg-red-800 dark:border-red-700 dark:text-white dark:hover:bg-red-500"
                >
                    Delete
                </button>
            </div>

            {/* Start Exam Modal */}
            {showStartModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 dark:bg-gray-700 max-w-md w-full relative">
                        <button onClick={() => setShowStartModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            X
                        </button>
                        <h3 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-white">Select the Test Date</h3>

                        <form action={goToExamControl} className="space-y-4">
                            <input type="hidden" name="exam_code" value={exam.code} />
                            <input type="hidden" name="category" value={exam.category} />

                            <div>
                                <select name="date" required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                                    <option value="" disabled selected>Select the Date</option>
                                    {/* Dates are stored as strings in DB, assuming YYYY-MM-DD or similar, usually would parse. 
                                  Original code used Carbon parse. Here we just display them. 
                                  For better UX, we should format them. */}
                                    <option value="0">{exam.first_date}</option>
                                    <option value="1">{exam.second_date}</option>
                                    <option value="2">{exam.third_date}</option>
                                </select>
                            </div>
                            <div>
                                <select name="time" required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                                    <option value="" disabled selected>Select the Time</option>
                                    <option value="0">{exam.first_time} WIB</option>
                                    <option value="1">{exam.second_time} WIB</option>
                                    <option value="2">{exam.third_time} WIB</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowStartModal(false)} className="px-4 py-2 bg-gray-200 rounded text-gray-800">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Go</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 dark:bg-gray-700 max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Are you sure want to delete this {exam.category === "ept" ? "EPT" : "TOEIC"}?</h3>
                        <p className="text-gray-500 text-sm mb-6">It will also delete all data inside, such as questions, stories, directions, etc.</p>
                        <div className="flex justify-end gap-2">
                            <button disabled={isDeleting} onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-200 rounded text-gray-800">No, cancel</button>
                            <button disabled={isDeleting} onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">{isDeleting ? 'Deleting...' : 'Yes, I\'m sure'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}