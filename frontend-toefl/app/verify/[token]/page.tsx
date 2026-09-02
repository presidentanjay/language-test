"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyPage() {
  const { token } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        // Use full URL to bypass the auth interceptor if necessary, but nextjs will proxy it or use env
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";
        const res = await fetch(`${apiUrl}/verify/${token}`);
        if (!res.ok) {
          setError(true);
        } else {
          const result = await res.json();
          if (result.valid) {
            setData(result);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchVerification();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-center border-b-4 border-blue-600">
          <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-2">
            Verifikasi Sertifikat
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Lembaga Bahasa Universitas Widyatama
          </p>
        </div>

        <div className="p-8">
          {error || !data ? (
            <div className="text-center">
              <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Sertifikat Tidak Ditemukan
              </h2>
              <p className="text-slate-500">
                Sertifikat dengan token tersebut tidak valid atau tidak
                ditemukan dalam sistem kami.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Sertifikat Valid
              </h2>

              <div className="mt-8 space-y-4 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Nama Peserta
                  </p>
                  <p className="font-bold text-slate-900">
                    {data.participant.name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Nomor Sertifikat
                  </p>
                  <p className="font-bold text-slate-900">
                    {data.certificateNumber}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Ujian
                  </p>
                  <p className="font-bold text-slate-900">{data.exam.title}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Tanggal
                  </p>
                  <p className="font-bold text-slate-900">{data.exam.date}</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Skor
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Listening</p>
                      <p className="font-bold">{data.scores.listening}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Structure</p>
                      <p className="font-bold">{data.scores.structure}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Reading</p>
                      <p className="font-bold">{data.scores.reading}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">Total</p>
                      <p className="font-black text-blue-600">
                        {data.scores.overall}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            © 2025 Widyatama Language Center
          </p>
        </div>
      </div>
    </div>
  );
}
