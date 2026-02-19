"use client";

import { useRouter } from "next/navigation";
import {
    ChevronRight,
    GraduationCap,
    ShieldCheck,
    Users,
    Clock,
    CreditCard,
    FileText,
    UserPlus,
    Laptop,
    Trophy,
    CheckCircle2,
    Info
} from "lucide-react";

export default function ProgramsPage() {
    const router = useRouter();

    const programs = [
        {
            title: "English Proficiency Test (EPT)",
            category: "Standard",
            price: "Rp 150.000",
            duration: "120 Menit",
            description: "Tes standar untuk mengukur kemampuan bahasa Inggris akademik bagi mahasiswa Universitas Widyatama.",
            benefits: ["Sertifikat Resmi", "Masa Berlaku 2 Tahun", "Diterima Internal Kampus"]
        },
        {
            title: "TOEIC Prediction",
            category: "Professional",
            price: "Rp 250.000",
            duration: "120 Menit",
            description: "Simulasi tes TOEIC untuk persiapan sertifikasi internasional di dunia kerja.",
            benefits: ["Analisis Skor Detil", "Latihan Standar Kerja", "Feedback Instruktur"]
        }
    ];

    const steps = [
        {
            icon: <UserPlus className="h-6 w-6" />,
            title: "Pendaftaran Akun",
            desc: "Klik tombol Register untuk membuat akun peserta baru di sistem Lembaga Bahasa."
        },
        {
            icon: <FileText className="h-6 w-6" />,
            title: "Pilih Program",
            desc: "Pilih jenis test yang ingin Anda ambil dari daftar program yang tersedia di Dashboard."
        },
        {
            icon: <CreditCard className="h-6 w-6" />,
            title: "Pembayaran & Konfirmasi",
            desc: "Lakukan pembayaran administrasi ke kasir atau via transfer sesuai petunjuk."
        },
        {
            icon: <Laptop className="h-6 w-6" />,
            title: "Mengerjakan Ujian",
            desc: "Akses ujian secara online melalui platform ini pada jadwal yang ditentukan."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 h-20 flex items-center px-6 md:px-12">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg leading-tight tracking-tight uppercase">Lembaga Bahasa</span>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Universitas Widyatama</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
                        <button onClick={() => router.push('/')} className="hover:text-blue-600 transition-colors uppercase">Home</button>
                        <button onClick={() => router.push('/about')} className="hover:text-blue-600 transition-colors uppercase">Tentang Kami</button>
                        <button onClick={() => router.push('/programs')} className="hover:text-blue-600 transition-colors uppercase">Program Test</button>
                        <button onClick={() => router.push('/contact')} className="hover:text-blue-600 transition-colors uppercase">Kontak</button>
                    </div>

                    <button
                        onClick={() => router.push('/login')}
                        className="bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 uppercase tracking-widest active:scale-95"
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-44 pb-32 px-6 bg-slate-900 overflow-hidden text-center">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-blue-400 mb-8 uppercase tracking-widest">
                        <ShieldCheck className="h-4 w-4" />
                        Sertifikasi & Ujian Tersedia
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                        Program Ujian <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Bahasa Profesional.</span>
                    </h1>
                    <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        Cek daftar ujian, rincian biaya, dan pelajari cara mengikuti sertifikasi di Lembaga Bahasa Universitas Widyatama.
                    </p>
                </div>

                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-40 -left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-10 -right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[150px]"></div>
                </div>
            </section>

            {/* Test Catalog & Pricing */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">Katalog Ujian & Biaya</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Pilih program yang sesuai dengan kebutuhan kualifikasi Anda.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {programs.map((prog, i) => (
                            <div key={i} className="bg-white border-2 border-slate-100 rounded-[40px] p-10 hover:border-blue-600 transition-all group relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                    <Trophy className="h-24 w-24 text-slate-900" />
                                </div>
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-6 inline-block">
                                        {prog.category}
                                    </span>
                                    <h3 className="text-3xl font-black mb-4 text-slate-900">
                                        {prog.title}
                                    </h3>
                                    <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                                        {prog.description}
                                    </p>

                                    <div className="text-4xl font-black text-slate-900 mb-8">
                                        {prog.price}
                                        <span className="text-sm font-bold text-slate-400 ml-2 uppercase">/ Test</span>
                                    </div>

                                    <ul className="space-y-4 mb-10">
                                        {prog.benefits.map((benefit, j) => (
                                            <li key={j} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => router.push('/login')}
                                        className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10 group-hover:shadow-blue-600/20"
                                    >
                                        Pilih Program Ini
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 bg-blue-50 border border-blue-100 p-8 rounded-[32px] max-w-3xl mx-auto flex gap-4">
                        <Info className="h-6 w-6 text-blue-600 shrink-0" />
                        <p className="text-sm text-blue-900 leading-relaxed italic">
                            *Biaya yang tercantum dapat berubah sewaktu-waktu sesuai kebijakan Lembaga Bahasa Universitas Widyatama. Silakan konfirmasi kembali melalui bagian pendaftaran.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-32 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">Bagaimana Caranya?</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Ikuti panduan langkah pendaftaran ujian berikut ini.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {steps.map((step, i) => (
                            <div key={i} className="relative group">
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-[60%] w-full h-[2px] bg-slate-200 group-hover:bg-blue-600/30 transition-colors"></div>
                                )}
                                <div className="bg-white h-20 w-20 rounded-3xl flex items-center justify-center text-blue-600 shadow-xl shadow-slate-200 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all mb-8 relative z-10">
                                    {step.icon}
                                    <span className="absolute -top-3 -right-3 h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 border-4 border-white">
                                        0{i + 1}
                                    </span>
                                </div>
                                <h4 className="text-xl font-black mb-4 text-slate-900">{step.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto bg-blue-600 rounded-[60px] p-24 text-center text-white relative overflow-hidden flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">Mulai Persiapan Ujian Anda.</h2>
                    <p className="text-white/80 text-xl max-w-xl mb-12 relative z-10 leading-relaxed">
                        Sudah tahu tes mana yang akan diambil? Langsung buat akun dan tentukan jadwal ujian Anda.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto">
                        <button
                            onClick={() => router.push('/register')}
                            className="bg-white text-blue-600 font-black py-5 px-12 rounded-2xl hover:scale-105 transition-all shadow-2xl"
                        >
                            Daftar Sekarang
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-blue-700 text-white font-black py-5 px-12 rounded-2xl border-2 border-white/10 hover:bg-blue-800 transition-all"
                        >
                            Log In Peserta
                        </button>
                    </div>

                    {/* Shapes */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                <p>© 2024 Lembaga Bahasa Universitas Widyatama</p>
            </footer>

            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
