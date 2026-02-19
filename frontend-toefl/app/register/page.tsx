"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import {
    GraduationCap,
    User,
    Mail,
    Lock,
    ChevronRight,
    ShieldCheck,
    CheckCircle2,
    ArrowLeft
} from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post('/register', { name, email, password });
            // After register, we usually auto-login or redirect to login
            // Based on Adonis AuthController, it might return a token or just success
            // Let's assume it returns a token for UX or just redirect to login
            const loginRes = await api.post('/login', { email, password });
            localStorage.setItem('token', loginRes.data.value);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex overflow-hidden">
            {/* Left Side: Branding & Info (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-24 overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-4 mb-12 animate-fade-in">
                        <div className="h-16 w-16 bg-blue-600 rounded-[22px] flex items-center justify-center text-white shadow-2xl shadow-blue-600/30">
                            <GraduationCap className="h-10 w-10" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-2xl leading-tight text-white uppercase tracking-tight">Lembaga Bahasa</span>
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.3em]">Universitas Widyatama</span>
                        </div>
                    </div>

                    <h2 className="text-5xl font-black text-white leading-tight mb-8 tracking-tight">
                        Bergabunglah dengan <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Pusat Keunggulan.</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-12">
                        Dapatkan akses ke program pelatihan dan sertifikasi bahasa berstandar internasional untuk mendukung masa depan global Anda.
                    </p>

                    <div className="space-y-6">
                        {[
                            "Akses ke EPT & TOEIC Certification",
                            "Sertifikat Resmi Terakreditasi",
                            "Sistem Ujian Online Fleksibel"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 text-slate-300 font-bold">
                                <CheckCircle2 className="h-6 w-6 text-blue-500" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[120px] animate-pulse [animation-delay:1s]"></div>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-24 bg-white relative">
                <button
                    onClick={() => router.push('/')}
                    className="absolute top-12 left-8 md:left-24 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </button>

                <div className="w-full max-w-md">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Buat Akun Baru</h1>
                        <p className="text-slate-500 font-medium">Lengkapi formulir di bawah untuk memulai perjalanan Anda.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 block ml-1">Nama Lengkap</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="Masukkan nama Anda"
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-600/20 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-slate-900"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 block ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-600/20 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-slate-900"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 block ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="Min. 8 characters"
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-600/20 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-slate-900"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 animate-shake">
                                <ShieldCheck className="h-5 w-5 text-red-500 shrink-0" />
                                <p className="text-xs font-bold text-red-600 leading-relaxed">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Register Account
                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-500 font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 font-black hover:underline underline-offset-4">
                                Sign In here.
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-24 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                        © 2026 Lembaga Bahasa Universitas Widyatama
                    </p>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
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
