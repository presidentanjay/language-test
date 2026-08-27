"use client";

import { updateUser } from "@/app/actions/user";
import { useState } from "react";
// import Image from "next/image"; // Optional if we configure domains, but <img> is fine for local uploads often

export default function UserEditForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const updateUserWithId = updateUser.bind(null, user.id);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const result = await updateUserWithId(formData);
    setLoading(false);

    if (result.success) {
      alert("User updated successfully");
      // Redirect handled by server action or we can router.push
    } else {
      alert("Failed to update user");
    }
  };

  return (
    <form action={handleSubmit}>
      <div className="max-w-screen-sm p-5 mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="border-b-2 border-gray-200 dark:border-gray-700">
          <h1 className="pb-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Update User
          </h1>
        </div>
        <div className="mt-5">
          <div className="flex justify-center mb-5">
            {/* Fallback image if picture is null or strictly local file not served yet. 
                       For now assuming picture path is relative to public or a url. 
                       If logic is strictly local file system path, we might need a route to serve it or just use placeholder 
                   */}
            {user.picture ? (
              <img
                className="object-cover rounded-full w-52 h-52 bg-gray-50"
                src={
                  user.picture
                    ? user.picture.startsWith("http")
                      ? user.picture
                      : `/${user.picture}`
                    : ""
                }
                alt="profile-picture"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://ui-avatars.com/api/?name=" + user.name;
                }}
              />
            ) : (
              <div className="rounded-full w-52 h-52 bg-gray-200 flex items-center justify-center text-4xl text-gray-500">
                {user.name?.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <div className="w-3/4">
              <div className="mb-5">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="picture"
                >
                  Change Picture
                </label>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="picture"
                  name="picture"
                  type="file"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  defaultValue={user.name}
                  required
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="npm"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  NPM
                </label>
                <input
                  type="text"
                  id="npm"
                  name="npm"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  defaultValue={user.profile?.npm || ""}
                />
              </div>

              {/* Read-only fields */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Faculty
                </label>
                <input
                  type="text"
                  className="bg-gray-50 cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={user.profile?.faculty || ""}
                  disabled
                />
              </div>

              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Program Study
                </label>
                <input
                  type="text"
                  className="bg-gray-50 cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={user.profile?.program_study || ""}
                  disabled
                />
              </div>

              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="text"
                  className="bg-gray-50 cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={user.email}
                  disabled
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <a
                  href="/admin/manage-users"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
