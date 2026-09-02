"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

declare global {
  interface Window {
    snap: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;
  const [exam, setExam] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    // Load Snap JS
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
    );
    document.head.appendChild(script);

    fetchData();

    return () => {
      document.head.removeChild(script);
    };
  }, [examId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch exam details
      const examRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/exams/${examId}`,
        { headers },
      );
      const examData = await examRes.json();
      setExam(examData);

      // Fetch payment check
      if (examData.code) {
        const payRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/check/${examData.code}`,
          { headers },
        );
        const payData = await payRes.json();
        setPaymentStatus(payData);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    try {
      setPaying(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ examCode: exam.code }),
        },
      );
      const data = await res.json();

      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            router.push("/dashboard");
          },
          onPending: function (result: any) {
            router.push("/dashboard");
          },
          onError: function (result: any) {
            alert("Pembayaran gagal");
            setPaying(false);
          },
          onClose: function () {
            setPaying(false);
          },
        });
      } else {
        alert(data.message || "Gagal memulai pembayaran");
        setPaying(false);
      }
    } catch (error) {
      console.error("Payment error", error);
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-widest">
            Detail Pembayaran
          </h1>

          {exam && (
            <div className="space-y-4 mb-8">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  Ujian
                </p>
                <p className="text-lg font-bold text-slate-900">{exam.title}</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  Kode
                </p>
                <p className="text-md font-bold text-slate-900">{exam.code}</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  Harga
                </p>
                <p className="text-2xl font-black text-blue-600">
                  Rp {exam.price?.toLocaleString("id-ID") || 0}
                </p>
              </div>
            </div>
          )}

          {paymentStatus?.paid ? (
            <div className="space-y-6">
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl border border-emerald-100 font-bold flex justify-center items-center">
                Sudah Lunas
              </div>
              <Link
                href="/dashboard"
                className="block w-full text-center bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          ) : (
            <button
              onClick={handlePay}
              disabled={paying || !exam?.price}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {paying
                ? "Memproses..."
                : exam?.price
                  ? "Bayar Sekarang"
                  : "Gratis"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
