import Link from "next/link";
import { getUsers } from "@/app/actions/user";
import UserTable from "@/components/UserTable";

export const dynamic = 'force-dynamic';

export default async function ManageUsersPage() {
    const users = await getUsers();

    return (
        <div className="p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="border-b-2 border-gray-200 dark:border-gray-700 mb-5">
                <h1 className="pb-1 text-2xl font-semibold text-gray-900 dark:text-white">Manage User</h1>
            </div>

            {/* We could add Search or Filters here later */}

            <UserTable users={users} />
        </div>
    );
}
