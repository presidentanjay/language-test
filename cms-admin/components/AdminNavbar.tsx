"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function AdminNavbar() {
    const { data: session } = useSession();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
    const [isReportingDropdownOpen, setIsReportingDropdownOpen] = useState(false);

    return (
        <nav className="fixed z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-950">
            <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
                <Link href="/admin/dashboard" className="flex items-center">
                    {/* Using a placeholder or the actual asset if available. 
                Original path: img/lembaga-bahasa.png. 
                I need to ensure this image is in public/img/ in Next.js */}
                    <img className="w-20 h-auto" src="/img/lembaga-bahasa.png" alt="logo" />
                </Link>

                <div className="flex items-center md:order-2 relative">
                    <button
                        type="button"
                        className="flex mr-3 text-sm bg-gray-300 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    >
                        <span className="sr-only">Open user menu</span>
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white overflow-hidden">
                            {/* Placeholder for avatar */}
                            {/* <img src="..." /> */}
                            <span>{session?.user?.name?.[0] || 'A'}</span>
                        </div>
                    </button>

                    {/* User Dropdown */}
                    {isUserDropdownOpen && (
                        <div className="z-50 absolute top-12 right-0 min-w-[175px] my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                            <div className="px-4 py-3">
                                <span className="block text-sm text-gray-900 dark:text-white">{session?.user?.name}</span>
                                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{session?.user?.email}</span>
                            </div>
                            <ul className="py-2">
                                <li>
                                    <Link href="/admin/manage-users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                        Manage Users
                                    </Link>
                                </li>
                                <li className="relative group">
                                    <button
                                        onClick={() => setIsExamDropdownOpen(!isExamDropdownOpen)}
                                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                    >
                                        Manage Exam
                                        <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                    </button>
                                    {isExamDropdownOpen && (
                                        <div className="z-10 absolute right-full top-0 mr-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                                <li><Link href="/admin/exam/ept" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">EPT</Link></li>
                                                <li><Link href="/admin/exam/toeic" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">TOEIC</Link></li>
                                            </ul>
                                        </div>
                                    )}
                                </li>
                                <li>
                                    <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 dark:hover:bg-gray-500 dark:text-gray-200 dark:hover:text-red-600">
                                        Sign Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    <button
                        type="button"
                        className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>

                <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                    <ul className="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg md:p-0 bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link href="/admin/dashboard" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Dashboard</Link>
                        </li>
                        <li>
                            <Link href="/admin/certification" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Certification</Link>
                        </li>
                        <li className="relative">
                            <button
                                onClick={() => setIsReportingDropdownOpen(!isReportingDropdownOpen)}
                                className="flex items-center justify-between w-full px-3 py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                            >
                                Reporting
                                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>
                            {isReportingDropdownOpen && (
                                <div className="z-10 absolute left-0 mt-2 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-400">
                                        <li>
                                            <Link href="/admin/ept/reporting" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">EPT</Link>
                                        </li>
                                        <li>
                                            <Link href="/admin/toeic/reporting" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">TOEIC</Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
