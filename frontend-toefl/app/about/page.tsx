"use client";

import { useRouter } from "next/navigation";
import {
    ChevronRight,
    GraduationCap,
    Globe,
    ShieldCheck,
    Users,
    Mail,
    Phone,
    MapPin,
    Target,
    Flag,
    Award,
    CheckCircle2
} from "lucide-react";

export default function AboutPage() {
    const router = useRouter();

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
            <section className="relative pt-44 pb-32 px-6 bg-slate-50 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-100/50 border border-blue-100 px-4 py-2 rounded-full text-xs font-bold text-blue-600 mb-8 uppercase tracking-widest animate-fade-in">
                        <Award className="h-4 w-4" />
                        Pusat Unggulan Bahasa
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                        Tentang Lembaga Bahasa <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Universitas Widyatama.</span>
                    </h1>
                    <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
                        Berkomitmen memberikan standar pelatihan dan sertifikasi bahasa tertinggi untuk mendukung prestasi akademik dan profesional dalam kancah internasional.
                    </p>
                </div>

                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                    <div className="absolute top-40 -left-10 w-72 h-72 bg-blue-600 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-10 -right-10 w-96 h-96 bg-indigo-600 rounded-full blur-[150px]"></div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-24 items-center mb-40">
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2070"
                                    alt="University Campus"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -right-10 bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100 hidden md:block">
                                <div className="text-4xl font-black text-blue-600 mb-2">20+</div>
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tahun Pengalaman</div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-4xl font-black leading-tight text-slate-900">Sejarah & Dedikasi Kami</h2>
                            <p className="text-slate-500 text-lg leading-relaxed">
                                Lembaga Bahasa Universitas Widyatama (UTama Language Center) telah berdiri sebagai garda terdepan dalam pengembangan kompetensi bahasa di lingkungan kampus dan masyarakat umum di Bandung.
                            </p>
                            <p className="text-slate-500 text-lg leading-relaxed">
                                Kami percaya bahwa penguasaan bahasa adalah kunci utama untuk membuka pintu peluang global. Dengan kurikulum yang terus diperbarui dan fasilitas modern, kami memastikan setiap peserta mendapatkan pengalaman belajar yang optimal.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                                <div className="flex gap-4 items-start">
                                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Terakreditasi</h4>
                                        <p className="text-xs text-slate-400">Standar pendidikan yang diakui secara nasional.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Ekspertis</h4>
                                        <p className="text-xs text-slate-400">Instruktur berpengalaman di bidangnya.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visi Misi Section */}
                    <div className="grid md:grid-cols-2 gap-12 mb-40">
                        <div className="bg-slate-900 p-16 rounded-[60px] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                                <Target className="h-32 w-32" />
                            </div>
                            <div className="relative z-10">
                                <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-8">
                                    <Target className="h-6 w-6" />
                                </div>
                                <h3 className="text-3xl font-black mb-6">Visi Kami</h3>
                                <p className="text-slate-400 text-xl leading-relaxed">
                                    Menjadi pusat pelatihan dan sertifikasi bahasa yang terkemuka, inovatif, dan berdaya saing internasional pada tahun 2030.
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-600 p-16 rounded-[60px] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                                <Flag className="h-32 w-32" />
                            </div>
                            <div className="relative z-10">
                                <div className="h-12 w-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                                    <Flag className="h-6 w-6" />
                                </div>
                                <h3 className="text-3xl font-black mb-6">Misi Kami</h3>
                                <ul className="space-y-4 text-white/80 text-lg leading-relaxed">
                                    <li className="flex gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-white mt-3 shrink-0"></div>
                                        Menyelenggarakan kursus bahasa yang berkualitas bagi mahasiswa dan umum.
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-white mt-3 shrink-0"></div>
                                        Menyediakan layanan pengujian bahasa (EPT, TOEFL, dll) yang akurat dan terpercaya.
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-white mt-3 shrink-0"></div>
                                        Mengembangkan penelitian di bidang pengajaran bahasa secara berkelanjutan.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center py-24 bg-slate-50 rounded-[60px] px-6 border border-slate-100">
                        <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">
                            Bergabunglah Bersama Kami.
                        </h2>
                        <p className="text-slate-500 text-xl max-w-2xl mx-auto mb-12">
                            Langkah pertama menuju penguasaan bahasa internasional dimulai dari sini. Pilih program Anda sekarang.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => router.push('/login')}
                                className="bg-blue-600 text-white font-bold py-5 px-12 rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-105 transition-all w-full sm:w-auto"
                            >
                                Daftar Program
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="bg-white text-slate-900 border-2 border-slate-200 font-bold py-5 px-12 rounded-2xl hover:border-blue-600/20 transition-all w-full sm:w-auto"
                            >
                                Kembali ke Beranda
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white pt-24 pb-12 px-6 mt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-2 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-lg leading-tight uppercase">Lembaga Bahasa</span>
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Universitas Widyatama</span>
                                </div>
                            </div>
                            <p className="text-slate-400 max-w-sm leading-relaxed">
                                Pusat keunggulan dalam pelatihan dan sertifikasi bahasa, mendukung prestasi akademik dan karir melalui penguasaan bahasa internasional.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-8 uppercase tracking-[0.2em] text-xs text-blue-400">Kontak</h4>
                            <ul className="space-y-6 text-sm text-slate-300">
                                <li className="flex gap-3">
                                    <MapPin className="h-5 w-5 shrink-0 text-blue-500" />
                                    Jl. Cikutra No. 204A, Bandung
                                </li>
                                <li className="flex gap-3 text-blue-400 font-bold">
                                    <Globe className="h-5 w-5 shrink-0" />
                                    widyatama.ac.id
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-8 uppercase tracking-[0.2em] text-xs text-blue-400">Ikuti Kami</h4>
                            <div className="flex gap-4">
                                {[Globe, Mail, Phone].map((Icon, i) => (
                                    <div key={i} className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all cursor-pointer">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-slate-800 text-center text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                        <p>© 2024 Lembaga Bahasa Universitas Widyatama</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
