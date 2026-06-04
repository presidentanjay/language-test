import { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import api from '../lib/axios';
import { Loader2 } from 'lucide-react';

export default function Settings() {
    const { user, setUser } = useAuth();
    
    const [name, setName] = useState(user?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [directorName, setDirectorName] = useState('');
    const [directorNip, setDirectorNip] = useState('');
    const [certTemplate, setCertTemplate] = useState<File | null>(null);
    const [certSignature, setCertSignature] = useState<File | null>(null);
    
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isSavingCert, setIsSavingCert] = useState(false);

    useEffect(() => {
        api.get('/settings').then((res) => {
            const data = res.data;
            if (data.cert_director_name) setDirectorName(data.cert_director_name);
            if (data.cert_director_nip) setDirectorNip(data.cert_director_nip);
        }).catch(console.error);
    }, []);

    const handleUpdateProfile = async () => {
        setIsSavingProfile(true);
        try {
            const res = await api.put('/me/profile', { name });
            setUser(res.data);
            alert('Profil berhasil diperbarui!');
        } catch (error) {
            alert('Gagal memperbarui profil.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            return alert('Password baru tidak cocok dengan konfirmasi password.');
        }
        if (newPassword.length < 6) {
            return alert('Password baru harus minimal 6 karakter.');
        }
        
        setIsSavingPassword(true);
        try {
            await api.put('/me/password', { currentPassword, newPassword });
            alert('Password berhasil diperbarui!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal memperbarui password.');
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleUpdateCertSettings = async () => {
        setIsSavingCert(true);
        try {
            const formData = new FormData();
            formData.append('cert_director_name', directorName);
            formData.append('cert_director_nip', directorNip);
            if (certTemplate) formData.append('cert_template', certTemplate);
            if (certSignature) formData.append('cert_signature', certSignature);

            await api.post('/settings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Pengaturan sertifikat berhasil disimpan!');
            setCertTemplate(null);
            setCertSignature(null);
        } catch (error) {
            alert('Gagal menyimpan pengaturan sertifikat.');
        } finally {
            setIsSavingCert(false);
        }
    };

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
                            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            <Input label="Email" defaultValue={user?.email} disabled />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleUpdateProfile} disabled={isSavingProfile || !name}>
                                {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> : null}
                                Save Changes
                            </Button>
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
                            <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                            <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleUpdatePassword} disabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword}>
                                {isSavingPassword ? <Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> : null}
                                Update Password
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Certificate Configuration</h3>
                        <p className="text-sm text-gray-500">Configure certificate signatures and background template dynamically.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Director Name (e.g. Ida Zuraida, Hj., S.S., M.Pd.)" value={directorName} onChange={(e) => setDirectorName(e.target.value)} />
                            <Input label="Director Title / NIP (e.g. Head of Lembaga Bahasa)" value={directorNip} onChange={(e) => setDirectorNip(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Background Template Image (Optional)</label>
                                <input type="file" accept="image/*" onChange={(e) => setCertTemplate(e.target.files?.[0] || null)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                                <p className="text-xs text-gray-400 mt-1">Upload a new blank certificate template.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Signature Image (PNG Transparent)</label>
                                <input type="file" accept="image/png" onChange={(e) => setCertSignature(e.target.files?.[0] || null)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                                <p className="text-xs text-gray-400 mt-1">Upload the director's signature (transparent background).</p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleUpdateCertSettings} disabled={isSavingCert || !directorName || !directorNip}>
                                {isSavingCert ? <Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> : null}
                                Save Certificate Settings
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
