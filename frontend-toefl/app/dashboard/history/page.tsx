"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Trophy,
  Calendar,
  Clock,
  Award,
  Printer,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import dynamic from "next/dynamic";

const Certificate = dynamic(() => import("@/components/Certificate"), {
  ssr: false,
});

interface ExamHistory {
  id: number;
  score: number;
  status: string;
  date: string;
  time: string;
  exam: {
    title: string;
    category: string;
  };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<ExamHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [certLoading, setCertLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/reports/me");
        setHistory(res.data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handlePrintCertificate = async (id: number) => {
    setCertLoading(true);
    try {
      const res = await api.get(`/certificates/${id}`);
      setSelectedCertificate(res.data);
    } catch (error) {
      console.error("Failed to fetch certificate data", error);
      alert("Gagal memuat data sertifikat");
    } finally {
      setCertLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-20 px-6 flex items-center justify-between sticky top-0 z-50">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg leading-tight tracking-tight uppercase">
              Riwayat Ujian
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Kembali ke Dashboard
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-12">
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              Riwayat & Sertifikat
            </h2>
            <p className="text-slate-500 mt-2">
              Unduh sertifikat ujian yang telah Anda selesaikan.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {history.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-bold">
                Belum ada riwayat ujian.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Paket Ujian</th>
                      <th className="px-6 py-4">Waktu Tes</th>
                      <th className="px-6 py-4 text-center">Skor</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Sertifikat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${item.exam.category === "toeic" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}
                            >
                              <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 line-clamp-1">
                                {item.exam.title}
                              </div>
                              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                {item.exam.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex flex-col gap-1 text-xs font-bold text-slate-500">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {item.date}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {item.time}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-100 bg-white text-sm font-black text-slate-900 shadow-sm">
                            <Award className="h-3 w-3 text-yellow-500" />
                            {item.score}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              item.status === "finish" || item.status === "good"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {item.status === "good"
                              ? "FINISH"
                              : item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-center">
                          {(item.status === "finish" ||
                            item.status === "good") && (
                            <button
                              onClick={() => handlePrintCertificate(item.id)}
                              disabled={certLoading}
                              className="h-10 w-10 rounded-xl bg-slate-900 text-white hover:bg-blue-600 flex items-center justify-center transition-all mx-auto shadow-lg shadow-slate-900/10 active:scale-95"
                              title="Download Sertifikat"
                            >
                              {certLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Printer className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedCertificate && (
        <Certificate
          data={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
}
