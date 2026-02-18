import { getUser } from "@/app/actions/user";
import UserEditForm from "@/components/UserEditForm";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUser(id);

    if (!user) {
        notFound();
    }

    return (
        <div className="p-4">
            <UserEditForm user={user} />
        </div>
    );
}
