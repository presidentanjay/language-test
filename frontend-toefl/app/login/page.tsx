"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import {
  GraduationCap,
  Mail,
  Lock,
  LogIn,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Globe,
  Award,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/I18nProvider";

function LoginForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ssoEnabled, setSsoEnabled] = useState(false);

  useEffect(() => {
    // Check SSO status
    api.get("/sso/status").then((res) => {
      setSsoEnabled(res.data.enabled);
    }).catch(() => {});

    // Check for SSO error
    const ssoError = searchParams.get("sso_error");
    if (ssoError === "access_denied") {
      setError("Akses ditolak oleh penyedia SSO. Silakan coba lagi.");
    } else if (ssoError === "server_error") {
      setError("Terjadi kesalahan pada server SSO. Silakan coba lagi.");
    }
  }, [searchParams]);

  const handleSsoLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/sso`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.value);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Email atau password salah. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      text: "Sertifikat resmi terakreditasi",
    },
    { icon: <Globe className="h-5 w-5" />, text: "Diakui secara nasional" },
    {
      icon: <Award className="h-5 w-5" />,
      text: "Standar internasional EPT & TOEIC",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL — DARK ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#060b18] flex-col justify-between p-14 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3 relative z-10 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/30">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <div>
            <span className="font-black text-xl text-white uppercase tracking-tight block leading-tight">
              Lembaga Bahasa
            </span>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
              Universitas Widyatama
            </span>
          </div>
        </motion.div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative z-10 space-y-10"
        >
          <div>
            <h2 className="text-5xl font-black text-white leading-tight tracking-tight mb-5">
              Selamat Datang <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Kembali.
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Masuk dan akses portar ujian, hasil tes, dan sertifikat Anda.
            </p>
          </div>

          <div className="space-y-4">
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="h-10 w-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                  {perk.icon}
                </div>
                <span className="text-slate-300 font-medium text-sm">
                  {perk.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 flex gap-10"
        >
          {[
            { val: "5.8k+", label: "Peserta" },
            { val: "92%", label: "Lulus" },
            { val: "2001", label: "Berdiri" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-2xl font-black text-white">{s.val}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT PANEL — LIGHT (form) ── */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Back button */}
        <div className="p-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo (hidden on desktop) */}
            <div className="flex items-center gap-3 mb-10 lg:hidden">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-black text-slate-900 uppercase tracking-tight block leading-tight">
                  Lembaga Bahasa
                </span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                  Universitas Widyatama
                </span>
              </div>
            </div>

            <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                {t("auth.loginTitle")}
              </h1>
              <p className="text-slate-500 font-medium">
                {t("auth.loginSubtitle")}
              </p>
            </div>

            {ssoEnabled && (
              <div className="mb-8">
                <button
                  type="button"
                  onClick={handleSsoLogin}
                  className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                >
                  <Lock className="h-5 w-5" />
                  Masuk dengan SSO Widyatama
                  <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform opacity-50" />
                </button>

                <div className="flex items-center gap-4 mt-8">
                  <div className="h-px bg-slate-100 flex-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Atau gunakan email
                  </span>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  {t("auth.email")}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-4 outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                    {t("auth.password")}
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-indigo-600 transition-colors"
                  >
                    {t("auth.forgotPassword")}
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-14 outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-red-600 leading-relaxed">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed group mt-2"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {t("auth.login")}
                    <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* SSO */}
            {ssoEnabled && (
              <>
                {/* SSO Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">atau</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                {/* SSO Button */}
                <button
                  type="button"
                  onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/sso/redirect`}
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                  <GraduationCap className="h-5 w-5" />
                  Login dengan Akun Widyatama
                </button>
              </>
            )}
            {/* Register link */}
            <p className="text-center text-slate-500 font-bold text-xs uppercase tracking-widest mt-8">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-blue-600 font-black hover:text-indigo-600 transition-colors"
              >
                Daftar di sini
              </Link>
            </p>

            <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mt-16">
              © 2025 Lembaga Bahasa Universitas Widyatama
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-8 w-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

