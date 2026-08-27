"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  Menu,
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Globe,
} from "lucide-react";

interface Me {
  id: number;
  name: string;
  email: string;
  role: string;
}

const sidebarNav = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "Kelola Ujian",
    href: "/admin/exams",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "Peserta",
    href: "/admin/users",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    label: "Laporan",
    href: "/admin/results",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: "Pengaturan",
    href: "/admin/settings",
  },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await api.get("/me");
        if (meRes.data.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        setMe(meRes.data);
        setForm((f) => ({
          ...f,
          name: meRes.data.name,
          email: meRes.data.email,
        }));
      } catch {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.email) {
      setMsg({ type: "error", text: "Nama dan email wajib diisi." });
      return;
    }
    if (form.password && form.password.length < 8) {
      setMsg({ type: "error", text: "Password minimal 8 karakter." });
      return;
    }
    if (form.password && form.password !== form.confirm) {
      setMsg({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }

    setSaving(true);
    setMsg(null);
    try {
      const payload: any = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      await api.put(`/users/${me!.id}`, payload);
      setMe((prev) =>
        prev ? { ...prev, name: form.name, email: form.email } : prev,
      );
      setForm((f) => ({ ...f, password: "", confirm: "" }));
      setMsg({
        type: "success",
        text: form.password
          ? "Profil dan password berhasil diperbarui."
          : "Profil berhasil diperbarui.",
      });
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Gagal menyimpan perubahan.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-400";
  const labelClass =
    "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2";

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-72 bg-[#060b18] flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="px-6 py-8 border-b border-white/5">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-black text-white uppercase tracking-tight text-base block leading-tight">
                Lembaga Bahasa
              </span>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                Admin Panel
              </span>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {sidebarNav.map((item, i) => {
            const active = item.href === "/admin/settings";
            return (
              <button
                key={i}
                onClick={() => {
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
              >
                {item.icon}
                {item.label}
                {active && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-white/60" />
                )}
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
                <div className="text-sm font-black text-white truncate">
                  {me?.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {me?.email}
                </div>
              </div>
              <div className="h-6 px-2 bg-amber-500/20 rounded-lg flex items-center shrink-0">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-slate-100 h-16 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-50"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900">Pengaturan</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">
                Konfigurasi Akun Admin
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-3xl">
            {/* Combined profile + password card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm"
            >
              {/* Card header */}
              <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3">
                <div className="h-9 w-9 bg-blue-50 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">Profil Admin</h3>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Perbarui informasi akun dan password Anda
                  </p>
                </div>
              </div>

              {/* Avatar */}
              <div className="px-8 pt-6 pb-2 flex items-center gap-4">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-200">
                  {me?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="font-black text-slate-900">{me?.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-5 px-2 bg-amber-50 border border-amber-100 rounded-md flex items-center gap-1">
                      <Shield className="h-3 w-3 text-amber-500" />
                      <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider">
                        Admin
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {me?.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form fields */}
              <div className="px-8 py-6 space-y-4">
                {/* Name */}
                <div>
                  <label className={labelClass}>Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      className={inputClass + " pl-12"}
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      className={inputClass + " pl-12"}
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Lock className="h-3 w-3" /> Ganti Password
                  </span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium -mt-2">
                  Kosongkan jika tidak ingin mengganti password.
                </p>

                {/* New password */}
                <div>
                  <label className={labelClass}>Password Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPw ? "text" : "password"}
                      className={inputClass + " pl-12 pr-12"}
                      placeholder="Min. 8 karakter"
                      value={form.password}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, password: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {showPw ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {form.password.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className={`h-1 flex-1 rounded-full transition-colors ${form.password.length >= 8 ? "bg-emerald-400" : "bg-slate-100"}`}
                      />
                      <div
                        className={`h-1 flex-1 rounded-full transition-colors ${form.password.length >= 12 ? "bg-emerald-400" : "bg-slate-100"}`}
                      />
                      <div
                        className={`h-1 flex-1 rounded-full transition-colors ${/[^a-zA-Z0-9]/.test(form.password) ? "bg-emerald-400" : "bg-slate-100"}`}
                      />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {form.password.length < 8
                          ? "Lemah"
                          : form.password.length < 12
                            ? "Sedang"
                            : "Kuat"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className={labelClass}>Konfirmasi Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showConfirm ? "text" : "password"}
                      className={inputClass + " pl-12 pr-12"}
                      placeholder="Ulangi password baru"
                      value={form.confirm}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, confirm: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {form.confirm.length > 0 && (
                    <p
                      className={`text-[10px] font-black mt-2 ${form.password === form.confirm ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {form.password === form.confirm
                        ? "✓ Password cocok"
                        : "✗ Password tidak cocok"}
                    </p>
                  )}
                </div>

                {/* Unified msg */}
                {msg && (
                  <div
                    className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold ${msg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}
                  >
                    {msg.type === "success" ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0" />
                    )}
                    {msg.text}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-slate-50 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 text-white font-black text-sm px-7 py-3 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-60"
                >
                  {saving ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Simpan Perubahan
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
