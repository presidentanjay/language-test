"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../lib/axios";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Pencil,
  Headphones,
  Layout,
  BookOpen,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Play,
  Clock,
  FolderPlus,
  ArrowLeft,
  Layers,
  MessageSquare,
  Upload,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

interface Answer {
  id?: number;
  answer_text: string;
  is_correct: "yes" | "no";
}

interface QuestionBankItem {
  id: number;
  bankPackageId: number;
  questionText: string;
  direction: string | null;
  audio: string | null;
  answers: Answer[];
}

interface BankPackage {
  id: number;
  name: string;
  category: "listening" | "structure" | "reading";
  duration: number;
  description: string | null;
  questions?: QuestionBankItem[];
  _count?: {
    questions: number;
  };
}

export default function BankSoal() {
  const [view, setView] = useState<"packages" | "questions">("packages");
  const [packages, setPackages] = useState<BankPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<BankPackage | null>(
    null,
  );
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  const [isQueModalOpen, setIsQueModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Package Form State
  const [pkgFormData, setPkgFormData] = useState({
    id: null as number | null,
    name: "",
    category: "listening" as "listening" | "structure" | "reading",
    duration: 30,
    description: "",
  });

  // Question Form State
  const [queFormData, setQueFormData] = useState({
    id: null as number | null,
    bank_package_id: null as number | null,
    question_text: "",
    direction: "",
    audio: "",
    answers: [
      { answer_text: "", is_correct: "yes" },
      { answer_text: "", is_correct: "no" },
      { answer_text: "", is_correct: "no" },
      { answer_text: "", is_correct: "no" },
    ] as Answer[],
  });

  useEffect(() => {
    if (view === "packages") {
      fetchPackages();
    } else if (selectedPackage) {
      fetchQuestions(selectedPackage.id);
    }
  }, [view, filterCategory]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCategory) params.append("category", filterCategory);
      const res = await api.get(`/bank-packages?${params.toString()}`);
      setPackages(res.data);
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (pkgId: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/bank-soal?bank_package_id=${pkgId}`);
      setQuestions(res.data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  };

  // PACKAGE HANDLERS
  const handlePkgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (pkgFormData.id) {
        await api.put(`/bank-packages/${pkgFormData.id}`, pkgFormData);
      } else {
        await api.post("/bank-packages", pkgFormData);
      }
      setIsPkgModalOpen(false);
      fetchPackages();
    } catch (error) {
      alert("Gagal menyimpan paket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePkgDelete = async (id: number) => {
    if (!window.confirm("Hapus paket ini beserta SEMUA soal didalamnya?"))
      return;
    try {
      await api.delete(`/bank-packages/${id}`);
      fetchPackages();
    } catch (error) {
      alert("Gagal menghapus paket");
    }
  };

  const handlePkgEdit = (pkg: BankPackage) => {
    setPkgFormData({
      id: pkg.id,
      name: pkg.name,
      category: pkg.category,
      duration: pkg.duration,
      description: pkg.description || "",
    });
    setIsPkgModalOpen(true);
  };

  const enterPackage = (pkg: BankPackage) => {
    setSelectedPackage(pkg);
    setView("questions");
  };

  // QUESTION HANDLERS
  const handleQueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...queFormData, bank_package_id: selectedPackage?.id };
      if (queFormData.id) {
        await api.put(`/bank-soal/${queFormData.id}`, payload);
      } else {
        await api.post("/bank-soal", payload);
      }
      setIsQueModalOpen(false);
      if (selectedPackage) fetchQuestions(selectedPackage.id);
    } catch (error) {
      alert("Gagal menyimpan soal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQueDelete = async (id: number) => {
    if (!window.confirm("Hapus soal ini?")) return;
    try {
      await api.delete(`/bank-soal/${id}`);
      if (selectedPackage) fetchQuestions(selectedPackage.id);
    } catch (error) {
      alert("Gagal menghapus soal");
    }
  };

  const handleQueEdit = (q: QuestionBankItem) => {
    setQueFormData({
      id: q.id,
      bank_package_id: q.bankPackageId,
      question_text: q.questionText,
      direction: q.direction || "",
      audio: q.audio || "",
      answers: q.answers.map((ans) => ({
        id: ans.id,
        answer_text: ans.answer_text,
        is_correct: ans.is_correct,
      })),
    });
    setIsQueModalOpen(true);
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFile || !selectedPackage) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", bulkFile);

    try {
      await api.post(
        `/bank-packages/${selectedPackage.id}/bulk-upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      alert("Bulk upload berhasil!");
      setIsBulkModalOpen(false);
      setBulkFile(null);
      fetchQuestions(selectedPackage.id);
    } catch (error: any) {
      console.error("Bulk upload failed", error);
      alert(error.response?.data?.message || "Gagal melakukan bulk upload");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQueForm = () => {
    setQueFormData({
      id: null,
      bank_package_id: selectedPackage?.id || null,
      question_text: "",
      direction: "",
      audio: "",
      answers: [
        { answer_text: "", is_correct: "yes" },
        { answer_text: "", is_correct: "no" },
        { answer_text: "", is_correct: "no" },
        { answer_text: "", is_correct: "no" },
      ],
    });
  };

  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case "listening":
        return {
          icon: Headphones,
          color: "blue",
          label: "Listening",
          bg: "bg-blue-50",
          text: "text-blue-600",
          border: "border-blue-100",
        };
      case "structure":
        return {
          icon: Layout,
          color: "indigo",
          label: "Structure",
          bg: "bg-indigo-50",
          text: "text-indigo-600",
          border: "border-indigo-100",
        };
      case "reading":
        return {
          icon: BookOpen,
          color: "emerald",
          label: "Reading",
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          border: "border-emerald-100",
        };
      default:
        return {
          icon: BookOpen,
          color: "slate",
          label: cat,
          bg: "bg-slate-50",
          text: "text-slate-600",
          border: "border-slate-100",
        };
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              {view === "questions" && (
                <button
                  onClick={() => setView("packages")}
                  className="h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                {view === "packages"
                  ? "Bank Soal (Paket)"
                  : `Paket: ${selectedPackage?.name}`}
              </h2>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
              {view === "packages"
                ? "Kelola koleksi soal berdasarkan folder paket ujian"
                : `Mengelola pertanyaan dalam paket ${selectedPackage?.category.toUpperCase()}`}
            </p>
          </div>

          <Button
            onClick={() => {
              if (view === "packages") {
                setPkgFormData({
                  id: null,
                  name: "",
                  category: "listening",
                  duration: 30,
                  description: "",
                });
                setIsPkgModalOpen(true);
              } else {
                resetQueForm();
                setIsQueModalOpen(true);
              }
            }}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 rounded-2xl flex items-center gap-3 active:scale-95 transition-all"
          >
            {view === "packages" ? (
              <FolderPlus className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
            {view === "packages" ? "Tambah Paket Baru" : "Tambah Soal Baru"}
          </Button>
        </div>

        {/* Main Content Area */}
        {view === "packages" ? (
          <div className="space-y-8">
            {/* Filters for Packages */}
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 min-w-[220px]">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none w-full"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  <option value="listening">Listening</option>
                  <option value="structure">Structure</option>
                  <option value="reading">Reading</option>
                </select>
              </div>
              <div className="flex-1 min-w-[300px] relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Cari nama paket..."
                  className="w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Package Cards Grid */}
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-6" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Memuat Paket Bank Soal...
                </p>
              </div>
            ) : packages.length === 0 ? (
              <div className="py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                <Layers className="h-16 w-16 text-slate-100 mx-auto mb-6" />
                <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">
                  Belum ada paket yang dibuat.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                  const style = getCategoryStyles(pkg.category);
                  return (
                    <div
                      key={pkg.id}
                      className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-lg shadow-slate-200/20 hover:shadow-2xl hover:shadow-blue-600/10 transition-all group relative overflow-hidden"
                    >
                      <div
                        className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity`}
                      >
                        <style.icon className="h-20 w-20" />
                      </div>

                      <div className="flex justify-between items-start mb-6">
                        <div
                          className={`px-4 py-1.5 ${style.bg} ${style.text} ${style.border} border rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2`}
                        >
                          <style.icon className="h-3 w-3" />
                          {style.label}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                          <button
                            onClick={() => handlePkgEdit(pkg)}
                            className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePkgDelete(pkg.id)}
                            className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 mb-2">
                        {pkg.name}
                      </h3>
                      <div className="flex items-center gap-4 text-slate-400 mb-8">
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <Clock className="h-4 w-4" />
                          {pkg.duration} Menit
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <MessageSquare className="h-4 w-4" />
                          {pkg.questions?.length || 0} Soal
                        </div>
                      </div>

                      <Button
                        onClick={() => enterPackage(pkg)}
                        className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 group/btn"
                      >
                        Kelola Soal
                        <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Questions List for Selected Package */}
            <div className="bg-slate-900 text-white p-8 rounded-[32px] flex items-center justify-between shadow-2xl shadow-slate-900/20">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 text-blue-400">
                  {selectedPackage &&
                    (() => {
                      const Style = getCategoryStyles(selectedPackage.category);
                      return <Style.icon className="h-8 w-8" />;
                    })()}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-black uppercase tracking-tight">
                      {selectedPackage?.name}
                    </h3>
                    <span className="px-3 py-0.5 bg-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {selectedPackage?.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-bold flex items-center gap-2">
                    <Clock className="h-3 w-3" /> {selectedPackage?.duration}{" "}
                    Menit Sesi Ujian
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsBulkModalOpen(true)}
                  className="h-14 px-6 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 rounded-2xl flex items-center gap-3 transition-all"
                >
                  <Upload className="h-5 w-5" />
                  Bulk Upload PDF
                </Button>
                <div className="text-right">
                  <div className="text-3xl font-black text-blue-400">
                    {questions.length}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Total Pertanyaan
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="py-20 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                </div>
              ) : questions.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                  <p className="text-slate-300 font-bold uppercase tracking-widest text-xs italic">
                    Belum ada pertanyaan di paket ini. Ayo tambahkan!
                  </p>
                </div>
              ) : (
                questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all group relative"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                          <span className="h-8 w-8 bg-slate-50 rounded-xl flex items-center justify-center text-xs font-black text-slate-400 border border-slate-100">
                            {idx + 1}
                          </span>
                          {q.audio && (
                            <div className="px-4 py-1.5 bg-pink-50 text-pink-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                              <Play className="h-3 w-3" /> Audio File Connected
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          {q.direction && (
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 italic whitespace-pre-line line-clamp-3">
                              {q.direction}
                            </div>
                          )}
                          <p className="text-lg font-bold text-slate-900 leading-relaxed pr-12 italic">
                            "{q.questionText}"
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.answers.map((ans, aIdx) => (
                              <div
                                key={aIdx}
                                className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${ans.is_correct === "yes" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400"}`}
                              >
                                <div
                                  className={`h-2 w-2 rounded-full ${ans.is_correct === "yes" ? "bg-emerald-500 shadow-lg shadow-emerald-500/40" : "bg-slate-300"}`}
                                ></div>
                                {ans.answer_text}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col gap-3 justify-end items-center md:items-end min-w-[100px]">
                        <button
                          onClick={() => handleQueEdit(q)}
                          className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleQueDelete(q.id)}
                          className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* MODAL: Package CRUD */}
        <Modal
          isOpen={isPkgModalOpen}
          onClose={() => setIsPkgModalOpen(false)}
          title={pkgFormData.id ? "Edit Paket Bank" : "Buat Paket Baru"}
        >
          <form onSubmit={handlePkgSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Nama Paket
              </label>
              <Input
                required
                value={pkgFormData.name}
                onChange={(e) =>
                  setPkgFormData({ ...pkgFormData, name: e.target.value })
                }
                placeholder="Contoh: Paket A - Listening Standard"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Kategori
                </label>
                <select
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold text-sm focus:outline-none focus:border-blue-600/20"
                  value={pkgFormData.category}
                  onChange={(e) =>
                    setPkgFormData({
                      ...pkgFormData,
                      category: e.target.value as any,
                    })
                  }
                >
                  <option value="listening">Listening</option>
                  <option value="structure">Structure</option>
                  <option value="reading">Reading</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Durasi (Menit)
                </label>
                <Input
                  type="number"
                  required
                  value={pkgFormData.duration}
                  onChange={(e) =>
                    setPkgFormData({
                      ...pkgFormData,
                      duration: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Deskripsi (Opsional)
              </label>
              <textarea
                className="w-full h-24 p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold text-sm focus:outline-none focus:border-blue-600/20"
                value={pkgFormData.description}
                onChange={(e) =>
                  setPkgFormData({
                    ...pkgFormData,
                    description: e.target.value,
                  })
                }
                placeholder="Keterangan mengenai paket ini..."
              ></textarea>
            </div>
            <div className="flex justify-end gap-4 pt-6">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setIsPkgModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                disabled={isSubmitting}
                type="submit"
                className="bg-slate-900 text-white px-10 h-14 rounded-2xl"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : pkgFormData.id ? (
                  "Simpan Perubahan"
                ) : (
                  "Buat Paket"
                )}
              </Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: Question CRUD */}
        <Modal
          isOpen={isQueModalOpen}
          onClose={() => setIsQueModalOpen(false)}
          title={
            queFormData.id ? "Edit Pertanyaan" : "Tambah Pertanyaan ke Paket"
          }
        >
          <form
            onSubmit={handleQueSubmit}
            className="space-y-6 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Reading Passage / Soal Cerita (Opsional)
              </label>
              <textarea
                className="w-full h-32 p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:outline-none focus:border-blue-600/20 font-bold text-slate-900"
                value={queFormData.direction}
                onChange={(e) =>
                  setQueFormData({ ...queFormData, direction: e.target.value })
                }
                placeholder="Masukkan teks cerita atau passage di sini jika ada..."
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Teks Pertanyaan
              </label>
              <textarea
                className="w-full h-24 p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:outline-none focus:border-blue-600/20 font-bold text-slate-900"
                required
                value={queFormData.question_text}
                onChange={(e) =>
                  setQueFormData({
                    ...queFormData,
                    question_text: e.target.value,
                  })
                }
                placeholder="Masukkan teks pertanyaan di sini..."
              ></textarea>
            </div>

            {selectedPackage?.category === "listening" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Link File Audio (MP3/URL)
                </label>
                <Input
                  value={queFormData.audio}
                  onChange={(e) =>
                    setQueFormData({ ...queFormData, audio: e.target.value })
                  }
                  placeholder="https://storage.com/audio.mp3"
                />
              </div>
            )}

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  Opsi Jawaban
                </h4>
                <span className="text-[10px] text-slate-400 font-bold">
                  Klik icon centang untuk set jawaban benar
                </span>
              </div>
              <div className="space-y-3">
                {queFormData.answers.map((ans, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const newAnswers = queFormData.answers.map((a, i) => ({
                          ...a,
                          is_correct:
                            i === idx ? "yes" : ("no" as "yes" | "no"),
                        }));
                        setQueFormData({ ...queFormData, answers: newAnswers });
                      }}
                      className={`h-12 w-12 min-w-[48px] rounded-xl flex items-center justify-center transition-all ${ans.is_correct === "yes" ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-50 text-slate-300"}`}
                    >
                      <CheckCircle2 className="h-6 w-6" />
                    </button>
                    <Input
                      className="flex-1"
                      placeholder={`Pilihan ${String.fromCharCode(65 + idx)}`}
                      value={ans.answer_text}
                      onChange={(e) => {
                        const newAnswers = [...queFormData.answers];
                        newAnswers[idx].answer_text = e.target.value;
                        setQueFormData({ ...queFormData, answers: newAnswers });
                      }}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setIsQueModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                disabled={isSubmitting}
                type="submit"
                className="bg-slate-900 text-white px-10 rounded-2xl h-14"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : queFormData.id ? (
                  "Perbarui Soal"
                ) : (
                  "Simpan ke Paket"
                )}
              </Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: Bulk Upload PDF */}
        <Modal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          title="Bulk Upload Soal via PDF"
        >
          <form onSubmit={handleBulkUpload} className="space-y-6">
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50 flex flex-col items-center justify-center text-center group hover:border-blue-400 transition-colors">
              <div className="h-20 w-20 bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="h-10 w-10 text-blue-600" />
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">
                Pilih File PDF
              </h4>
              <p className="text-xs font-bold text-slate-400 mb-6 max-w-[280px]">
                Format PDF harus rapi dengan nomor pertanyaan dan opsi A-D.
              </p>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setBulkFile(e.target.files ? e.target.files[0] : null)
                }
                className="hidden"
                id="bulk-pdf-input"
              />
              <label
                htmlFor="bulk-pdf-input"
                className="px-8 h-12 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-600 hover:border-blue-600 hover:text-blue-600 cursor-pointer transition-all"
              >
                {bulkFile ? bulkFile.name : "Browser File..."}
              </label>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Aturan Format PDF
              </h5>
              <ul className="text-[11px] font-bold text-slate-500 space-y-2 list-disc pl-4">
                <li>Gunakan nomor soal (Contoh: "1. Apa itu...")</li>
                <li>Gunakan alfabet untuk opsi (Contoh: "A. Pilihan...")</li>
                <li>
                  Tandai jawaban benar dengan kata "(Benar)" di akhir baris opsi
                </li>
              </ul>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                disabled={isSubmitting || !bulkFile}
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 h-14 rounded-2xl shadow-lg shadow-emerald-600/20"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Mulai Ekstrak Soal"
                )}
              </Button>
            </div>
          </form>
        </Modal>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `,
        }}
      />
    </AdminLayout>
  );
}
