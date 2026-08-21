"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Upload } from "lucide-react";
import api from "@/lib/axios";

interface IdentityUploadModalProps {
    onComplete: () => void;
}

export default function IdentityUploadModal({ onComplete }: IdentityUploadModalProps) {
    const [facePhoto, setFacePhoto] = useState<File | null>(null);
    const [ktmPhoto, setKtmPhoto] = useState<File | null>(null);
    const [facePreview, setFacePreview] = useState<string | null>(null);
    const [ktmPreview, setKtmPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const faceInputRef = useRef<HTMLInputElement>(null);
    const ktmInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'face' | 'ktm') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ukuran (Max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError(`Ukuran file ${type === 'face' ? 'Foto Wajah' : 'KTM'} terlalu besar (Max 5MB).`);
            return;
        }

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'face') {
                setFacePhoto(file);
                setFacePreview(reader.result as string);
            } else {
                setKtmPhoto(file);
                setKtmPreview(reader.result as string);
            }
            setError(null);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!facePhoto || !ktmPhoto) {
            setError("Harap unggah kedua foto (Wajah Asli & KTM) untuk melanjutkan.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("face_photo", facePhoto);
        formData.append("ktm_photo", ktmPhoto);

        try {
            await api.post("/me/upload-identity", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            onComplete();
        } catch (err: any) {
            console.error("Identity upload failed:", err);
            
            // Extract detailed validation errors from AdonisJS if available
            let errorMsg = err.response?.data?.message || "Gagal mengunggah foto. Silakan coba lagi.";
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                // Adonis file validation errors usually have { field, message, type }
                const details = err.response.data.errors.map((e: any) => e.message || e.clientName || "Invalid file").join(', ');
                errorMsg = `${errorMsg}: ${details}`;
            }
            
            setError(errorMsg);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#060b18]/80 backdrop-blur-xl p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4 shadow-lg">
                            <Camera className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Verifikasi Identitas</h2>
                        <p className="text-blue-100 mt-2 font-medium">Harap lengkapi foto wajah asli dan KTM Anda sebelum memulai ujian.</p>
                    </div>
                </div>

                <div className="p-8">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3"
                            >
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <p className="text-sm font-medium">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Box Foto Wajah */}
                        <div className="flex flex-col items-center">
                            <p className="font-bold text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                                <UserIcon /> 1. Foto Wajah Asli
                            </p>
                            <button
                                onClick={() => faceInputRef.current?.click()}
                                className="relative w-full aspect-[3/4] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden hover:border-blue-400 hover:bg-blue-50/50 transition-all group flex flex-col items-center justify-center"
                            >
                                {facePreview ? (
                                    <img src={facePreview} alt="Preview Wajah" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-500 transition-colors p-4 text-center">
                                        <Upload className="h-10 w-10 mb-3" />
                                        <span className="text-sm font-bold">Klik untuk Upload</span>
                                        <span className="text-xs mt-1">Jelas & tidak terpotong (Max 5MB)</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-bold bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">Ganti Foto</span>
                                </div>
                            </button>
                            <input type="file" ref={faceInputRef} onChange={(e) => handleFileChange(e, 'face')} accept="image/*" className="hidden" />
                        </div>

                        {/* Box Foto KTM */}
                        <div className="flex flex-col items-center">
                            <p className="font-bold text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" /> 2. Foto KTM
                            </p>
                            <button
                                onClick={() => ktmInputRef.current?.click()}
                                className="relative w-full aspect-[3/4] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden hover:border-blue-400 hover:bg-blue-50/50 transition-all group flex flex-col items-center justify-center"
                            >
                                {ktmPreview ? (
                                    <img src={ktmPreview} alt="Preview KTM" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-500 transition-colors p-4 text-center">
                                        <Upload className="h-10 w-10 mb-3" />
                                        <span className="text-sm font-bold">Klik untuk Upload</span>
                                        <span className="text-xs mt-1">Terbaca dengan jelas (Max 5MB)</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-bold bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">Ganti Foto</span>
                                </div>
                            </button>
                            <input type="file" ref={ktmInputRef} onChange={(e) => handleFileChange(e, 'ktm')} accept="image/*" className="hidden" />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !facePhoto || !ktmPhoto}
                        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black uppercase tracking-widest text-sm py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 disabled:shadow-none flex items-center justify-center gap-3 group"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Mengunggah...
                            </>
                        ) : (
                            <>
                                Konfirmasi & Simpan
                                <CheckCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// Custom UserIcon to avoid clashing with next/router or something
const UserIcon = ({ className = "h-4 w-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);
