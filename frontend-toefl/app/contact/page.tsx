"use client";

import { useRouter } from "next/navigation";
import {
    ChevronRight,
    GraduationCap,
    Mail,
    Phone,
    MapPin,
    Globe,
    Clock,
    MessageSquare,
    Send,
    ExternalLink
} from "lucide-react";

export default function ContactPage() {
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
                    </div>

                    <button
                        onClick={() => router.push('/login')}
                        className="bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/11 uppercase tracking-widest"
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Header Section */}
            <section className="relative pt-44 pb-24 px-6 bg-slate-50 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-100 px-4 py-2 rounded-full text-xs font-bold text-blue-600 mb-8 uppercase tracking-widest">
                        <MessageSquare className="h-4 w-4" />
                        Hubungi Kami
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                        Ada Pertanyaan? <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Kami Siap Membantu.</span>
                    </h1>
                    <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
                        Tim Lembaga Bahasa Universitas Widyatama siap memberikan informasi yang Anda butuhkan seputar pelatihan dan sertifikasi bahasa.
                    </p>
                </div>
            </section>

            {/* Contact Grid */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8 mb-24">
                        {/* Address Card */}
                        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group hover:bg-slate-900 transition-all duration-500">
                            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <MapPin className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">Alamat Lengkap</h3>
                            <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                                Jl. Cikutra No. 204A, Bandung <br />
                                Jawa Barat, 40124 - Indonesia
                            </p>
                        </div>

                        {/* Phone Card */}
                        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group hover:bg-blue-600 transition-all duration-500">
                            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-white transition-all">
                                <Phone className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">Nomor Telepon</h3>
                            <p className="text-slate-500 text-sm leading-relaxed group-hover:text-blue-50 transition-colors">
                                (022) 7275855 <br />
                                ext. 228 / 229
                            </p>
                        </div>

                        {/* Website Card */}
                        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group hover:bg-slate-900 transition-all duration-500">
                            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <Globe className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">Website Resmi</h3>
                            <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                                www.widyatama.ac.id <br />
                                lb.widyatama.ac.id
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-stretch">
                        {/* Map Section */}
                        <div className="bg-slate-100 rounded-[50px] overflow-hidden min-h-[500px] border-8 border-white shadow-2xl relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9386642225986!2d107.64192017503116!3d-6.8979396675037705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e797d4ff9d55%3A0x7255df8d69db4d3a!2sUniversitas%20Widyatama!5e0!3m2!1sid!2sid!4v1771442605167!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 grayscale contrast-[1.2] opacity-80"
                            ></iframe>
                            <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-3 w-3 rounded-full bg-blue-600 animate-pulse"></div>
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-900">Lokasi Kampus</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 leading-tight">Gedung Pusat, Lt. 1 Universitas Widyatama</p>
                            </div>
                        </div>

                        {/* Work Hours & CTA */}
                        <div className="bg-slate-50 p-12 md:p-16 rounded-[50px] flex flex-col justify-center">
                            <div className="mb-12">
                                <h3 className="text-3xl font-black mb-6">Jam Operasional</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-4 border-b border-slate-200">
                                        <div className="flex items-center gap-3 font-bold">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                            Senin - Jumat
                                        </div>
                                        <span className="text-slate-500 font-medium">08:00 - 16:00 WIB</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-b border-slate-200">
                                        <div className="flex items-center gap-3 font-bold">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                            Sabtu
                                        </div>
                                        <span className="text-slate-500 font-medium">08:00 - 14:00 WIB</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4 text-red-500 opacity-50">
                                        <div className="flex items-center gap-3 font-bold">
                                            <Clock className="h-5 w-5" />
                                            Minggu & Libur Nasional
                                        </div>
                                        <span className="font-medium">Tutup</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-600 p-10 rounded-[40px] text-white">
                                <h4 className="text-xl font-black mb-4">Butuh Respon Cepat?</h4>
                                <p className="text-blue-100 text-sm mb-8 leading-relaxed">
                                    Silakan login ke portal peserta untuk mengirimkan tiket bantuan atau tanya jawab seputar ujian.
                                </p>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="w-full bg-white text-blue-600 font-bold py-5 rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Log In ke Portal
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12 px-6 mt-12 text-center">
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <span className="font-black text-sm uppercase tracking-widest text-blue-400">Lembaga Bahasa Universitas Widyatama</span>
                    </div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.3em]">© 2026 Crafted for Excellence</p>
                </div>
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
