"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import {
    GraduationCap,
    Mail,
    Lock,
    ChevronRight,
    ShieldCheck,
    ArrowLeft,
    LogIn
} from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post('/login', { email, password });
            localStorage.setItem('token', res.data.value);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || "Email atau password salah. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>

            <button
                onClick={() => router.push('/')}
                className="absolute top-12 left-8 md:left-12 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest z-10"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </button>

            <div className="w-full max-w-lg relative z-10 animate-fade-in">
                {/* Logo & Header */}
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="h-20 w-20 bg-blue-600 rounded-[30px] flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 mb-8 transform hover:scale-105 transition-transform duration-500">
                        <GraduationCap className="h-12 w-12" />
                    </div>
                    <div>
                        <span className="block font-black text-2xl leading-tight text-slate-900 uppercase tracking-tight mb-1">Lembaga Bahasa</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.4em]">Universitas Widyatama</span>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-2xl border border-white p-1 rounded-[40px] shadow-2xl shadow-slate-900/5 overflow-hidden">
                    <div className="bg-white p-10 md:p-14 rounded-[38px] space-y-10">
                        <div className="text-center">
                            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Login Peserta</h1>
                            <p className="text-slate-500 font-medium text-sm">Masukkan kredensial Anda untuk mengakses ujian.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-[22px] py-5 pl-14 pr-4 outline-none focus:border-blue-600/10 focus:bg-white focus:ring-8 focus:ring-blue-600/5 transition-all font-bold text-slate-900 placeholder:font-medium"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end mb-1 ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Password</label>
                                    <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-indigo-600 transition-colors">Forgot Password?</Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-[22px] py-5 pl-14 pr-4 outline-none focus:border-blue-600/10 focus:bg-white focus:ring-8 focus:ring-blue-600/5 transition-all font-bold text-slate-900 placeholder:font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-start gap-3 animate-shake">
                                    <ShieldCheck className="h-5 w-5 text-red-500 shrink-0" />
                                    <p className="text-[11px] font-bold text-red-600 leading-relaxed uppercase tracking-wide">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white font-black py-6 rounded-[22px] shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Sign In Now
                                        <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center pt-6">
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                                Belum memiliki akun?{" "}
                                <Link href="/register" className="text-blue-600 font-black hover:underline underline-offset-8">
                                    Daftar di sini
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center opacity-40">
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-900">
                        © 2026 Lembaga Bahasa Universitas Widyatama
                    </p>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
}
