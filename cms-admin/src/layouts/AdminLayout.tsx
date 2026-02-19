import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Activity, Database, Calculator, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Peserta', href: '/users', icon: Users },
    { name: 'Bank Soal', href: '/bank-soal', icon: Database },
    { name: 'Ujian', href: '/exams', icon: FileText },
    { name: 'Monitoring', href: '/monitoring', icon: Activity },
    { name: 'Hasil Ujian', href: '/participant-scores', icon: ClipboardList },
    { name: 'Score Management', href: '/score-management', icon: Calculator },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { logout, user } = useAuth();
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">CMS Admin</h1>
                </div>
                <nav className="mt-6 space-y-1 px-4">
                    {navigation.map((item) => {
                        const isActive = location.pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-slate-800 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="absolute bottom-4 left-4 right-4">
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                <header className="bg-white px-8 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 capitalize">
                            {location.pathname.split('/')[1] || 'Dashboard'}
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-600">{user?.name}</span>
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                                alt="Avatar"
                                className="h-8 w-8 rounded-full"
                            />
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
