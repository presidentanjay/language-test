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
  Plus,
  Pencil,
  Trash2,
  X,
  Menu,
  ChevronRight,
  CheckCircle2,
  Clock,
  Link2,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Calendar,
} from "lucide-react";

interface Exam {
  id: number;
  code: string;
  title: string;
  category: "ept" | "toeic";
  first_date: string | null;
  second_date: string | null;
  third_date: string | null;
  fourth_date: string | null;
  first_time: string | null;
  second_time: string | null;
  third_time: string | null;
  fourth_time: string | null;
  conference_link: string | null;
  activated: "yes" | "no";
  status: "publish" | "progress";
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const defaultForm: Partial<Exam> = {
  code: "",
  title: "",
  category: "ept",
  first_date: "",
  second_date: "",
  third_date: "",
  fourth_date: "",
  first_time: "",
  second_time: "",
  third_time: "",
  fourth_time: "",
  conference_link: "",
  activated: "no",
  status: "progress",
};

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

export default function AdminExamsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editExam, setEditExam] = useState<Exam | null>(null);
  const [form, setForm] = useState<Partial<Exam>>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Exam | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [meRes, examsRes] = await Promise.all([
          api.get("/me"),
          api.get("/exams"),
        ]);
        if (meRes.data.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        setUser(meRes.data);
        setExams(examsRes.data);
      } catch {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const openCreate = () => {
    setEditExam(null);
    setForm(defaultForm);
    setFormError("");
    setModalOpen(true);
  };
  const openEdit = (exam: Exam) => {
    setEditExam(exam);
    setForm({ ...exam });
    setFormError("");
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditExam(null);
  };

  const handleSave = async () => {
    if (!form.title || !form.code || !form.category) {
      setFormError("Judul, kode, dan kategori wajib diisi.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (editExam) {
        const res = await api.put(`/exams/${editExam.id}`, form);
        setExams((prev) =>
          prev.map((e) => (e.id === editExam.id ? res.data : e)),
        );
      } else {
        const res = await api.post("/exams", form);
        setExams((prev) => [res.data, ...prev]);
      }
      closeModal();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Gagal menyimpan ujian.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/exams/${deleteTarget.id}`);
      setExams((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      // handle silently
    } finally {
      setDeleting(false);
    }
  };

  const toggleActivated = async (exam: Exam) => {
    const newVal = exam.activated === "yes" ? "no" : "yes";
    try {
      await api.put(`/exams/${exam.id}`, { activated: newVal });
      setExams((prev) =>
        prev.map((e) => (e.id === exam.id ? { ...e, activated: newVal } : e)),
      );
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400";
  const labelClass =
    "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5";

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Overlay mobile */}
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
            const active = item.href === "/admin/exams";
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
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-white truncate">
                  {user?.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {user?.email}
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
        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 h-16 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-50"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900">
                Kelola Ujian
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">
                Manajemen Program Ujian
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-blue-600 text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              <Plus className="h-4 w-4" /> Tambah Ujian
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 p-6">
          {exams.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white border border-slate-100 rounded-3xl">
              <FileText className="h-12 w-12 text-slate-200 mb-4" />
              <p className="font-black text-slate-400 mb-4">Belum ada ujian</p>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 bg-blue-600 text-white text-xs font-black px-5 py-3 rounded-xl hover:bg-blue-700 transition-all"
              >
                <Plus className="h-4 w-4" /> Buat Ujian Pertama
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                <span className="text-sm font-black text-slate-700">
                  {exams.length} ujian terdaftar
                </span>
              </div>
              <div className="divide-y divide-slate-50">
                {exams.map((exam, i) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-6 py-5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Category badge */}
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center text-[10px] font-black text-white shrink-0 ${exam.category === "ept" ? "bg-blue-600" : "bg-indigo-600"}`}
                    >
                      {exam.category.toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-slate-900 truncate">
                          {exam.title}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md hidden sm:block">
                          {exam.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${exam.status === "publish" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                        >
                          {exam.status === "publish" ? "Published" : "Draft"}
                        </span>
                        {exam.first_date && (
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {exam.first_date}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Activated toggle */}
                    <button
                      onClick={() => toggleActivated(exam)}
                      title={
                        exam.activated === "yes" ? "Nonaktifkan" : "Aktifkan"
                      }
                      className="hidden sm:flex items-center gap-1.5 text-xs font-black transition-colors shrink-0"
                    >
                      {exam.activated === "yes" ? (
                        <ToggleRight className="h-7 w-7 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="h-7 w-7 text-slate-300" />
                      )}
                      <span
                        className={`hidden md:block ${exam.activated === "yes" ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {exam.activated === "yes" ? "Aktif" : "Nonaktif"}
                      </span>
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => openEdit(exam)}
                        className="h-9 w-9 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(exam)}
                        className="h-9 w-9 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── CREATE/EDIT MODAL ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-[32px] z-10">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {editExam ? "Edit Ujian" : "Tambah Ujian Baru"}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {editExam
                      ? `ID: ${editExam.id}`
                      : "Isi detail ujian di bawah"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="h-10 w-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              {/* Form */}
              <div className="px-8 py-6 space-y-5">
                {/* Title + Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Judul Ujian *</label>
                    <input
                      className={inputClass}
                      placeholder="TOEIC Prediction Test 1"
                      value={form.title || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Kode Ujian *</label>
                    <input
                      className={inputClass}
                      placeholder="EPT-2025-01"
                      value={form.code || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, code: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* Category + Status + Activated */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Kategori *</label>
                    <select
                      className={inputClass}
                      value={form.category}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          category: e.target.value as "ept" | "toeic",
                        }))
                      }
                    >
                      <option value="ept">EPT</option>
                      <option value="toeic">TOEIC</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      className={inputClass}
                      value={form.status}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          status: e.target.value as "publish" | "progress",
                        }))
                      }
                    >
                      <option value="progress">Draft</option>
                      <option value="publish">Publish</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Aktivasi</label>
                    <select
                      className={inputClass}
                      value={form.activated}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          activated: e.target.value as "yes" | "no",
                        }))
                      }
                    >
                      <option value="no">Nonaktif</option>
                      <option value="yes">Aktif</option>
                    </select>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <label className={labelClass}>
                    Jadwal Tanggal (maks. 4 sesi)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "first_date",
                      "second_date",
                      "third_date",
                      "fourth_date",
                    ].map((key, i) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 w-4 shrink-0">
                          S{i + 1}
                        </span>
                        <input
                          type="date"
                          className={inputClass}
                          value={(form as any)[key] || ""}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, [key]: e.target.value }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Times */}
                <div>
                  <label className={labelClass}>Jadwal Waktu</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "first_time",
                      "second_time",
                      "third_time",
                      "fourth_time",
                    ].map((key, i) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 w-4 shrink-0">
                          S{i + 1}
                        </span>
                        <input
                          type="time"
                          className={inputClass}
                          value={(form as any)[key] || ""}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, [key]: e.target.value }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conference link */}
                <div>
                  <label className={labelClass}>
                    Link Konferensi (opsional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                      <Link2 className="h-4 w-4" />
                    </div>
                    <input
                      className={inputClass + " pl-10"}
                      placeholder="https://meet.google.com/..."
                      value={form.conference_link || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          conference_link: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Error */}
                {formError && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                    <p className="text-xs font-bold text-red-600">
                      {formError}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 text-sm font-black text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
                >
                  {saving ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {editExam ? "Simpan Perubahan" : "Buat Ujian"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRM ── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[28px] w-full max-w-md p-8 shadow-2xl text-center"
            >
              <div className="h-16 w-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Hapus Ujian?
              </h3>
              <p className="text-slate-500 text-sm mb-2">
                Aksi ini tidak dapat dibatalkan.
              </p>
              <p className="text-slate-900 font-black text-sm mb-8 bg-slate-50 px-4 py-3 rounded-xl">
                "{deleteTarget.title}"
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-3 text-sm font-black bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 text-sm font-black text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
