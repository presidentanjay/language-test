"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { GraduationCap, Menu, X } from "lucide-react";

export default function Navbar() {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Tentang Kami", href: "/about" },
        { name: "Program Test", href: "/programs" },
        { name: "Kontak", href: "/contact" },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "h-16 glass py-2" : "h-24 py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => router.push('/')}
                >
                    <div className="h-10 w-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-lg leading-tight tracking-tight uppercase">Lembaga Bahasa</span>
                        <span className="text-[10px] font-bold text-brand uppercase tracking-[0.2em]">Universitas Widyatama</span>
                    </div>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => router.push(link.href)}
                            className="hover:text-brand transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
                        </button>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={() => router.push('/login')}
                        className="text-xs font-bold text-slate-900 hover:text-brand transition-colors uppercase tracking-widest"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => router.push('/register')}
                        className="bg-slate-900 text-white text-[10px] font-black px-6 py-3 rounded-lg hover:bg-brand transition-all shadow-xl shadow-slate-900/10 uppercase tracking-widest active:scale-95"
                    >
                        Register
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-slate-900"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full glass border-t border-slate-100 flex flex-col p-6 gap-6 md:hidden shadow-2xl"
                    >
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => {
                                    router.push(link.href);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="text-left text-sm font-bold text-slate-900 uppercase tracking-widest"
                            >
                                {link.name}
                            </button>
                        ))}
                        <hr className="border-slate-100" />
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => router.push('/login')}
                                className="text-left text-sm font-bold text-slate-900 uppercase tracking-widest"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => router.push('/register')}
                                className="bg-brand text-white text-xs font-black py-4 rounded-xl shadow-xl shadow-blue-600/20 uppercase tracking-widest"
                            >
                                Register
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
