"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Zap,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/I18nProvider";

function RegisterForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ssoEnabled, setSsoEnabled] = useState(false);

  useEffect(() => {
    // Check SSO status
    api
      .get("/sso/status")
      .then((res) => {
        setSsoEnabled(res.data.enabled);
      })
      .catch(() => {});

    // Check for SSO error
    const ssoError = searchParams.get("sso_error");
    if (ssoError === "access_denied") {
      setError("Akses ditolak oleh penyedia SSO. Silakan coba lagi.");
    } else if (ssoError === "server_error") {
      setError("Terjadi kesalahan pada server SSO. Silakan coba lagi.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/register", { name, email, password });
      const loginRes = await api.post("/login", { email, password });
      localStorage.setItem("token", loginRes.data.value);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Pendaftaran gagal. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      num: "01",
      title: "Buat Akun",
      desc: "Isi nama, email, dan password Anda.",
    },
    {
      num: "02",
      title: "Pilih Program",
      desc: "Pilih EPT atau TOEIC di dashboard.",
    },
    {
      num: "03",
      title: "Ikuti Ujian",
      desc: "Akses ujian pada jadwal yang ditentukan.",
    },
    {
      num: "04",
      title: "Terima Sertifikat",
      desc: "Download sertifikat resmi setelah lulus.",
    },
  ];

  const inputClass =
    "w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-14 outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400";

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL — DARK ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#060b18] flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />

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

        {/* Center */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative z-10 space-y-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 px-3 py-1.5 rounded-full text-[10px] font-black text-blue-400 mb-6 uppercase tracking-[0.2em]">
              <Zap className="h-3 w-3" />
              Mulai dalam 2 menit
            </div>
            <h2 className="text-5xl font-black text-white leading-tight tracking-tight mb-5">
              Bergabunglah dengan <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Pusat Keunggulan.
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Daftarkan diri dan dapatkan akses penuh ke program sertifikasi
              bahasa berstandar internasional.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-5">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="h-9 w-9 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-blue-400">
                    {step.num}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-black text-white mb-0.5">
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    {step.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative z-10 flex gap-10"
        >
          {[
            { val: "5.8k+", label: "Peserta" },
            { val: "92%", label: "Lulus" },
            { val: "Gratis", label: "Daftar Akun" },
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
            {/* Mobile logo */}
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
                {t("auth.registerTitle")}
              </h1>
              <p className="text-slate-500 font-medium">
                {t("auth.registerSubtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  {t("auth.name")}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap Anda"
                    className={inputClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

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
                    className={inputClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  {t("auth.password")}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min. 8 karakter"
                    className={inputClass}
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
                {/* Password strength hints */}
                {password.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`h-1 flex-1 rounded-full transition-colors ${password.length >= 8 ? "bg-emerald-400" : "bg-slate-100"}`}
                    />
                    <div
                      className={`h-1 flex-1 rounded-full transition-colors ${password.length >= 12 ? "bg-emerald-400" : "bg-slate-100"}`}
                    />
                    <div
                      className={`h-1 flex-1 rounded-full transition-colors ${/[^a-zA-Z0-9]/.test(password) ? "bg-emerald-400" : "bg-slate-100"}`}
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {password.length < 8
                        ? "Lemah"
                        : password.length < 12
                          ? "Sedang"
                          : "Kuat"}
                    </span>
                  </div>
                )}
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

              {/* Terms note */}
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Dengan mendaftar, Anda menyetujui{" "}
                <span className="text-blue-600 font-black cursor-pointer hover:underline">
                  Syarat &amp; Ketentuan
                </span>{" "}
                dan{" "}
                <span className="text-blue-600 font-black cursor-pointer hover:underline">
                  Kebijakan Privasi
                </span>{" "}
                kami.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {t("nav.register")}
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    atau
                  </span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                {/* SSO Button */}
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href = `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/api/sso/redirect`)
                  }
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                  <GraduationCap className="h-5 w-5" />
                  Daftar dengan Akun Widyatama
                </button>
              </>
            )}

            {/* Login link */}
            <p className="text-center text-slate-500 font-bold text-xs uppercase tracking-widest mt-8">
              {t("auth.haveAccount")}{" "}
              <Link
                href="/login"
                className="text-blue-600 font-black hover:text-indigo-600 transition-colors"
              >
                {t("auth.loginHere")}
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="h-8 w-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
