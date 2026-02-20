"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
    GraduationCap,
    FileText,
    Users,
    BarChart3,
    Settings,
    Home,
    LogOut,
    Pencil,
    Trash2,
    X,
    Menu,
    CheckCircle2,
    AlertTriangle,
    Shield,
    UserCheck,
    UserX,
    Search,
} from "lucide-react";

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: "admin" | "test_taker" | "guest";
    picture: string | null;
    created_at: string;
}

interface Me {
    id: number;
    name: string;
    email: string;
    role: string;
}

const sidebarNav = [
    { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
    { icon: <FileText className="h-5 w-5" />, label: "Kelola Ujian", href: "/admin/exams" },
    { icon: <Users className="h-5 w-5" />, label: "Peserta", href: "/admin/users" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "Laporan", href: "/admin/results" },
    { icon: <Settings className="h-5 w-5" />, label: "Pengaturan", href: "/admin/settings" },
];

const roleBadge: Record<string, { label: string; class: string }> = {
    admin: { label: "Admin", class: "bg-amber-50 text-amber-600" },
    test_taker: { label: "Peserta", class: "bg-blue-50 text-blue-600" },
    guest: { label: "Guest", class: "bg-slate-100 text-slate-500" },
};

export default function AdminUsersPage() {
    const router = useRouter();
    const [me, setMe] = useState<Me | null>(null);
    const [users, setUsers] = useState<UserItem[]>([]);
    const [filtered, setFiltered] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");

    // Edit modal
    const [editUser, setEditUser] = useState<UserItem | null>(null);
    const [form, setForm] = useState({ name: "", email: "", role: "guest" });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    // Delete confirm
    const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const [meRes, usersRes] = await Promise.all([api.get("/me"), api.get("/users")]);
                if (meRes.data.role !== "admin") { router.push("/dashboard"); return; }
                setMe(meRes.data);
                setUsers(usersRes.data);
                setFiltered(usersRes.data);
            } catch {
                localStorage.removeItem("token");
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // Filter
    useEffect(() => {
        let result = users;
        if (roleFilter !== "all") result = result.filter(u => u.role === roleFilter);
        if (search.trim()) result = result.filter(u =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(result);
    }, [search, roleFilter, users]);

    const openEdit = (u: UserItem) => {
        setEditUser(u);
        setForm({ name: u.name, email: u.email, role: u.role });
        setFormError("");
    };

    const handleSave = async () => {
        if (!form.name || !form.email) { setFormError("Nama dan email wajib diisi."); return; }
        setSaving(true);
        setFormError("");
        try {
            const res = await api.put(`/users/${editUser!.id}`, form);
            setUsers(prev => prev.map(u => u.id === editUser!.id ? { ...u, ...res.data } : u));
            setEditUser(null);
        } catch (err: any) {
            setFormError(err.response?.data?.message || "Gagal menyimpan perubahan.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await api.delete(`/users/${deleteTarget.id}`);
            setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch { } finally {
            setDeleting(false);
        }
    };

    const handleLogout = () => { localStorage.removeItem("token"); router.push("/"); };

    const counts = {
        all: users.length,
        admin: users.filter(u => u.role === "admin").length,
        test_taker: users.filter(u => u.role === "test_taker").length,
        guest: users.filter(u => u.role === "guest").length,
    };

    const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400";
    const labelClass = "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5";

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {sidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* ── SIDEBAR ── */}
            <aside className={`fixed top-0 left-0 h-full z-50 w-72 bg-[#060b18] flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}>
                <div className="px-6 py-8 border-b border-white/5">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="font-black text-white uppercase tracking-tight text-base block leading-tight">Lembaga Bahasa</span>
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Admin Panel</span>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {sidebarNav.map((item, i) => {
                        const active = item.href === "/admin/users";
                        return (
                            <button key={i} onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
                                {item.icon}{item.label}
                                {active && <div className="ml-auto h-2 w-2 rounded-full bg-white/60" />}
                            </button>
                        );
                    })}
                </nav>
                <div className="px-4 py-4 border-t border-white/5">
                    <div className="bg-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                                {me?.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-black text-white truncate">{me?.name}</div>
                                <div className="text-[10px] text-slate-500 truncate">{me?.email}</div>
                            </div>
                            <div className="h-6 px-2 bg-amber-500/20 rounded-lg flex items-center shrink-0">
                                <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider">Admin</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <div className="flex-1 min-w-0 flex flex-col">
                <header className="bg-white border-b border-slate-100 h-16 px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-50">
                            <Menu className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-slate-900">Kelola Peserta</h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">Manajemen Akun Pengguna</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                        <LogOut className="h-4 w-4" />
                    </button>
                </header>

                <main className="flex-1 p-6 space-y-5">
                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: "Total", val: counts.all, icon: <Users className="h-5 w-5 text-slate-600" />, bg: "bg-slate-50", active: roleFilter === "all", filter: "all" },
                            { label: "Admin", val: counts.admin, icon: <Shield className="h-5 w-5 text-amber-600" />, bg: "bg-amber-50", active: roleFilter === "admin", filter: "admin" },
                            { label: "Peserta", val: counts.test_taker, icon: <UserCheck className="h-5 w-5 text-blue-600" />, bg: "bg-blue-50", active: roleFilter === "test_taker", filter: "test_taker" },
                            { label: "Guest", val: counts.guest, icon: <UserX className="h-5 w-5 text-slate-400" />, bg: "bg-slate-50", active: roleFilter === "guest", filter: "guest" },
                        ].map((s, i) => (
                            <button key={i} onClick={() => setRoleFilter(s.filter)}
                                className={`flex items-center gap-3 p-5 rounded-2xl border text-left transition-all ${s.active ? "border-blue-200 bg-blue-50 shadow-md shadow-blue-100" : "bg-white border-slate-100 hover:border-blue-100 hover:shadow-sm"}`}>
                                <div className={`h-10 w-10 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>{s.icon}</div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900">{s.val}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-medium text-slate-900 outline-none focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-400 shadow-sm"
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)} />
                    </div>

                    {/* Table */}
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                            <span className="text-sm font-black text-slate-700">{filtered.length} pengguna</span>
                            {search && <button onClick={() => setSearch("")} className="text-xs font-bold text-slate-400 hover:text-slate-600">Clear</button>}
                        </div>

                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <Users className="h-10 w-10 mb-3 text-slate-200" />
                                <p className="font-black text-sm">Tidak ada pengguna ditemukan</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {filtered.map((u, i) => (
                                    <motion.div key={u.id}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="px-6 py-4 grid grid-cols-[44px_1fr_100px_140px_80px] items-center gap-4 hover:bg-slate-50/50 transition-colors group"
                                    >
                                        {/* Avatar */}
                                        <div className="h-11 w-11 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-base">
                                            {u.name?.[0]?.toUpperCase()}
                                        </div>

                                        {/* Info */}
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-black text-slate-900 text-sm truncate">{u.name}</span>
                                                {u.id === me?.id && (
                                                    <span className="text-[9px] font-black bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-md shrink-0">Anda</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-slate-400 font-medium truncate block">{u.email}</span>
                                        </div>

                                        {/* Role badge */}
                                        <div className="flex items-center">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${roleBadge[u.role]?.class}`}>
                                                {roleBadge[u.role]?.label}
                                            </span>
                                        </div>

                                        {/* Joined date */}
                                        <div className="hidden md:flex items-center">
                                            <span className="text-[10px] text-slate-300 font-bold">
                                                {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(u)}
                                                className="h-9 w-9 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            {u.id !== me?.id && (
                                                <button onClick={() => setDeleteTarget(u)}
                                                    className="h-9 w-9 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* ── EDIT MODAL ── */}
            <AnimatePresence>
                {editUser && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setEditUser(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[32px] w-full max-w-md shadow-2xl"
                            onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">Edit Pengguna</h2>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">ID: {editUser.id}</p>
                                </div>
                                <button onClick={() => setEditUser(null)} className="h-10 w-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center">
                                    <X className="h-5 w-5 text-slate-500" />
                                </button>
                            </div>
                            <div className="px-8 py-6 space-y-4">
                                <div>
                                    <label className={labelClass}>Nama Lengkap</label>
                                    <input className={inputClass} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div>
                                    <label className={labelClass}>Email</label>
                                    <input type="email" className={inputClass} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                </div>
                                <div>
                                    <label className={labelClass}>Role</label>
                                    <select className={inputClass} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                                        <option value="guest">Guest</option>
                                        <option value="test_taker">Peserta (Test Taker)</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                {formError && (
                                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3">
                                        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                                        <p className="text-xs font-bold text-red-600">{formError}</p>
                                    </div>
                                )}
                            </div>
                            <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3">
                                <button onClick={() => setEditUser(null)} className="px-6 py-3 text-sm font-black text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">Batal</button>
                                <button onClick={handleSave} disabled={saving}
                                    className="px-8 py-3 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2">
                                    {saving ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                    Simpan Perubahan
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── DELETE CONFIRM ── */}
            <AnimatePresence>
                {deleteTarget && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[28px] w-full max-w-md p-8 shadow-2xl text-center">
                            <div className="h-16 w-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Trash2 className="h-8 w-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Hapus Pengguna?</h3>
                            <p className="text-slate-500 text-sm mb-2">Aksi ini tidak dapat dibatalkan.</p>
                            <p className="text-slate-900 font-black text-sm mb-8 bg-slate-50 px-4 py-3 rounded-xl">"{deleteTarget.name}"</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 text-sm font-black bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl">Batal</button>
                                <button onClick={handleDelete} disabled={deleting}
                                    className="flex-1 py-3 text-sm font-black text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                    {deleting ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Ya, Hapus"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
