import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      const tokenValue = res.data.value;
      localStorage.setItem("token", tokenValue);
      const userRes = await api.get("/me", {
        headers: { Authorization: `Bearer ${tokenValue}` },
      });
      login(tokenValue, userRes.data);
      navigate(userRes.data.role === "supervisor" ? "/users" : "/dashboard");
    } catch (err: any) {
      setError(`[DEBUG] Frontend: ${err.message} | Backend: ${err.response?.data?.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left – dark branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#060b18] flex-col justify-between p-12 relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-11 w-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="font-black text-white text-lg uppercase tracking-tight leading-tight">
              Lembaga Bahasa
            </div>
            <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
              CMS Admin Panel
            </div>
          </div>
        </div>

        {/* Center text */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-black text-blue-300 uppercase tracking-widest">
              Content Management System
            </span>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-4">
            Kelola
            <br />
            <span className="text-blue-400">Konten Ujian</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            Platform administrasi untuk mengelola soal, peserta, ujian, dan
            laporan dalam satu tempat.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            {[
              { val: "Bank Soal", desc: "EPT & TOEIC" },
              { val: "Monitoring", desc: "Real-time" },
              { val: "Laporan", desc: "PDF Export" },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-black text-white text-sm">{s.val}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          © 2025 Lembaga Bahasa · Universitas Widyatama
        </div>
      </div>

      {/* Right – login form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="font-black text-slate-900 uppercase tracking-tight">
              Lembaga Bahasa CMS
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-1">
              Masuk ke CMS
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Gunakan akun admin untuk mengakses panel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold p-4 rounded-2xl">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400 pointer-events-none">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-900 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-sm font-medium text-slate-900 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Masuk ke Panel <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400 font-bold mt-8 uppercase tracking-widest">
            Lembaga Bahasa Universitas Widyatama
          </p>
        </div>
      </div>
    </div>
  );
}
