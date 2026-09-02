"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import {
  Trophy,
  CheckCircle,
  ArrowRight,
  Home,
  BarChart2,
  Star,
  Download,
  Share2,
  ShieldCheck,
  Headphones,
  Type,
  BookOpen,
} from "lucide-react";

export default function TestResult() {
  const { enrollId } = useParams();
  const router = useRouter();
  const [enroll, setEnroll] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/enrolls/${enrollId}/result`);
        setEnroll(res.data);
      } catch (error) {
        console.error("Failed to fetch result", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [enrollId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="h-20 w-20 relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-75"></div>
            <div className="relative h-20 w-20 animate-spin rounded-full border-[6px] border-slate-100 border-t-blue-600"></div>
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
            Analyzing Your Performance...
          </p>
        </div>
      </div>
    );
  }

  if (!enroll) return <div className="p-10 text-center">Result not found.</div>;

  const scores = enroll.sectionalScores || {
    listening: 0,
    structure: 0,
    reading: 0,
    overall: 0,
  };
  const isEPT = enroll.category === "ept";

  const generateCertificate = async () => {
    try {
      const res = await api.get(`/certificates/${enrollId}`);
      const certData = res.data;
      
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });
      
      // Background and Borders
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(2);
      doc.rect(10, 10, 277, 190);
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text("LEMBAGA BAHASA UNIVERSITAS WIDYATAMA", 148.5, 40, { align: "center" });
      
      // Subtitle
      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.text("SERTIFIKAT ENGLISH PROFICIENCY TEST", 148.5, 52, { align: "center" });
      
      // Certificate Number
      doc.setFontSize(12);
      doc.text(`No: ${certData.certificateNumber}`, 148.5, 62, { align: "center" });
      
      // Participant Name
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(certData.participant.name, 148.5, 90, { align: "center" });
      
      // Participant Info
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`NPM: ${certData.participant.npm} | Program Studi: ${certData.participant.program_study}`, 148.5, 102, { align: "center" });
      
      // Exam Info
      doc.text(`Telah mengikuti ${certData.exam.title} pada tanggal ${certData.exam.date}`, 148.5, 120, { align: "center" });
      
      // Scores
      doc.setFont("helvetica", "bold");
      doc.text(`Listening: ${certData.scores.listening} | Structure: ${certData.scores.structure} | Reading: ${certData.scores.reading}`, 148.5, 135, { align: "center" });
      doc.setFontSize(14);
      doc.text(`Total Score: ${certData.scores.overall}`, 148.5, 145, { align: "center" });
      
      // QR Code
      const verifyUrl = `${window.location.origin}${certData.verifyUrl}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl);
      doc.addImage(qrDataUrl, "PNG", 30, 150, 30, 30);
      
      // Footer
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Kepala Lembaga Bahasa", 230, 160, { align: "center" });
      doc.text("Universitas Widyatama", 230, 180, { align: "center" });
      
      doc.save(`Certificate_${certData.certificateNumber}.pdf`);
    } catch (error) {
      console.error("Failed to generate certificate", error);
      alert("Gagal mencetak sertifikat. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Decoration */}
      <div className="h-[40vh] bg-slate-900 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-600/20 to-transparent" />

        {/* Floating particles (simulated) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100],
              x: [0, i % 2 === 0 ? 50 : -50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute bottom-0 h-2 w-2 bg-blue-400 rounded-full blur-sm"
            style={{ left: `${15 + i * 15}%` }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-[20vh] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[48px] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden"
        >
          {/* Achievement Header */}
          <div className="p-10 md:p-16 text-center border-b border-slate-50">
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="h-28 w-28 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-600/40 mx-auto mb-10"
            >
              <Trophy className="h-14 w-14 text-white" />
            </motion.div>

            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full mb-4 border border-emerald-100">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Assessment Validated
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Ujian Selesai!
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-md mx-auto leading-relaxed">
              Selamat! Anda telah menyelesaikan sesi sertifikasi{" "}
              <span className="text-slate-900 font-bold">
                {enroll.examCode}
              </span>
              .
            </p>
          </div>

          {/* Score Matrix */}
          <div className="p-10 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Main Score Circle */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <svg className="h-56 w-56 transform -rotate-90">
                    <circle
                      cx="112"
                      cy="112"
                      r="100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="16"
                      className="text-slate-50"
                    />
                    <motion.circle
                      cx="112"
                      cy="112"
                      r="100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="16"
                      strokeDasharray="628"
                      initial={{ strokeDashoffset: 628 }}
                      animate={{
                        strokeDashoffset:
                          628 - 628 * (scores.overall / (isEPT ? 677 : 100)),
                      }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                      className="text-blue-600"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                      Overall Score
                    </span>
                    <span className="text-6xl font-black text-slate-900 tracking-tighter">
                      {scores.overall}
                    </span>
                    {isEPT && (
                      <span className="text-xs font-bold text-blue-600 uppercase mt-1">
                        EPT Scale
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section Breakdown */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                  Performance Breakdown
                </h3>

                {isEPT ? (
                  <>
                    <ScoreBar
                      label="Listening Comprehension"
                      score={scores.listening}
                      max={68}
                      icon={<Headphones className="h-4 w-4" />}
                      color="bg-blue-600"
                    />
                    <ScoreBar
                      label="Structure & Written"
                      score={scores.structure}
                      max={68}
                      icon={<Type className="h-4 w-4" />}
                      color="bg-indigo-600"
                    />
                    <ScoreBar
                      label="Reading Comprehension"
                      score={scores.reading}
                      max={67}
                      icon={<BookOpen className="h-4 w-4" />}
                      color="bg-violet-600"
                    />
                  </>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Total Correct
                        </p>
                        <p className="text-xl font-black text-slate-900">
                          {scores.overall} Points
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1 pt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.round((scores.overall / (isEPT ? 677 : 100)) * 5) ? "text-amber-400 fill-amber-400" : "text-slate-100"}`}
                    />
                  ))}
                  <span className="text-xs font-black ml-2 text-slate-900 uppercase">
                    Achievement Level
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid sm:grid-cols-2 gap-4 mt-16">
              <button
                onClick={() => router.push("/dashboard")}
                className="h-16 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </button>
              <button
                className="h-16 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                onClick={generateCertificate}
              >
                <Download className="h-4 w-4" />
                Cetak Sertifikat
              </button>
            </div>

            <div className="flex justify-center mt-8">
              <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                <Share2 className="h-3 w-3" />
                Share achievement
              </button>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-12">
          Lembaga Bahasa Universitas Widyatama © 2025
        </p>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, max, icon, color }: any) {
  const percentage = (score / max) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-2 text-slate-500">
          {icon}
          {label}
        </div>
        <div className="text-slate-900">
          {score} <span className="text-slate-300">/ {max}</span>
        </div>
      </div>
      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
