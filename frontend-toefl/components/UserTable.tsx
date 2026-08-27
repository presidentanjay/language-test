"use client";

import { useState } from "react";
import { deleteUser } from "@/app/actions/user";
import Link from "next/link";
import { format } from "date-fns";

export default function UserTable({ users }: { users: any[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    await deleteUser(id);
    setIsDeleting(null);
    setShowDeleteModal(null);
  };

  return (
    <>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 display dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                NPM
              </th>
              <th scope="col" className="px-6 py-3">
                Faculty
              </th>
              <th scope="col" className="px-6 py-3">
                Program Study
              </th>
              <th scope="col" className="px-6 py-3">
                Account Created
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {index + 1}
                </th>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.profile?.npm || "-"}</td>
                <td className="px-6 py-4">{user.profile?.faculty || "-"}</td>
                <td className="px-6 py-4">
                  {user.profile?.program_study || "-"}
                </td>
                <td className="px-6 py-4">
                  {user.email_verified_at
                    ? format(new Date(user.email_verified_at), "yyyy-MM-dd")
                    : "-"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteModal(user.id)}
                      className="inline-flex items-center px-2 py-2 text-sm font-medium text-center text-white bg-white border border-red-200 rounded-lg hover:bg-red-100 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-600 dark:bg-red-800 dark:border-red-700 dark:text-white dark:hover:bg-red-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-white fill-red-700 dark:fill-white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
                        <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
                      </svg>
                    </button>

                    <Link
                      href={`/admin/manage-users/edit/${user.id}`}
                      className="inline-flex items-center px-2 py-2 text-xs font-medium text-center text-white bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-white dark:border-gray-700 dark:text-white dark:hover:bg-gray-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-white fill-blue-700 dark:fill-blue-600"
                        viewBox="0 0 24 24"
                      >
                        <path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"></path>
                        <path d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"></path>
                      </svg>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 dark:bg-gray-700 max-w-sm w-full mx-4">
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Are you sure want to delete this User?
              </h3>
              <p className="text-gray-500 mb-6 font-normal">
                This action is irreversible and will lead to the removal of User
                Account forever from the system.
              </p>
              <div className="flex justify-center gap-2">
                <button
                  disabled={isDeleting === showDeleteModal}
                  onClick={() => handleDelete(showDeleteModal)}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium text-sm"
                >
                  {isDeleting === showDeleteModal
                    ? "Deleting..."
                    : "Yes, I'm sure"}
                </button>
                <button
                  disabled={isDeleting === showDeleteModal}
                  onClick={() => setShowDeleteModal(null)}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-900 focus:ring-4 focus:ring-gray-200 font-medium text-sm dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
