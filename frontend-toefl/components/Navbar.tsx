"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { GraduationCap, Menu, X } from "lucide-react";

interface NavbarProps {
    variant?: "light" | "dark";
}

export default function Navbar({ variant = "light" }: NavbarProps) {
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

    const isDark = variant === "dark";

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Tentang Kami", href: "/about" },
        { name: "Program Test", href: "/programs" },
        { name: "Kontak", href: "/contact" },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
                ? isDark
                    ? "h-16 bg-[#060b18]/80 backdrop-blur-xl border-b border-white/5 py-2"
                    : "h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm py-2"
                : "h-24 py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => router.push("/")}
                >
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-black text-lg leading-tight tracking-tight uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
                            Lembaga Bahasa
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
                            Universitas Widyatama
                        </span>
                    </div>
                </div>

                {/* Desktop Links */}
                <div className={`hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => router.push(link.href)}
                            className={`transition-colors relative group ${isDark ? "hover:text-white" : "hover:text-blue-600"}`}
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
                        </button>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={() => router.push("/login")}
                        className={`text-xs font-bold transition-colors uppercase tracking-widest ${isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-blue-600"}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => router.push("/register")}
                        className="bg-blue-600 text-white text-[10px] font-black px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 uppercase tracking-widest active:scale-95"
                    >
                        Register
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={`md:hidden p-2 ${isDark ? "text-white" : "text-slate-900"}`}
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
                        className={`absolute top-full left-0 w-full border-t flex flex-col p-6 gap-6 md:hidden shadow-2xl ${isDark
                            ? "bg-[#0d1526] border-white/5"
                            : "bg-white border-slate-100"
                            }`}
                    >
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => {
                                    router.push(link.href);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`text-left text-sm font-bold uppercase tracking-widest ${isDark ? "text-slate-300" : "text-slate-700"}`}
                            >
                                {link.name}
                            </button>
                        ))}
                        <hr className={isDark ? "border-white/5" : "border-slate-100"} />
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => router.push("/login")}
                                className={`text-left text-sm font-bold uppercase tracking-widest ${isDark ? "text-slate-300" : "text-slate-700"}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => router.push("/register")}
                                className="bg-blue-600 text-white text-xs font-black py-4 rounded-xl shadow-xl shadow-blue-600/20 uppercase tracking-widest"
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
