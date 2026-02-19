
import AdminLayout from '../layouts/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Settings() {
    const { user } = useAuth();

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                        <p className="text-sm text-gray-500 italic mt-1 font-serif font-light">Update your account detail profile.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Name" defaultValue={user?.name} />
                            <Input label="Email" defaultValue={user?.email} disabled />
                        </div>
                        <div className="flex justify-end">
                            <Button>Save Changes</Button>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                        <p className="text-sm text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="space-y-4">
                            <Input label="Current Password" type="password" />
                            <Input label="New Password" type="password" />
                            <Input label="Confirm New Password" type="password" />
                        </div>
                        <div className="flex justify-end">
                            <Button>Update Password</Button>
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
