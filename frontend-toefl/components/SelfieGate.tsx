'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

interface SelfieGateProps {
    enrollId: string;
    onVerified: () => void;
}

export default function SelfieGate({ enrollId, onVerified }: SelfieGateProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [isReady, setIsReady] = useState(false);
    const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
    const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);

    // Start camera
    useEffect(() => {
        let cancelled = false;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: 640, height: 480 },
                });
                if (cancelled) {
                    stream.getTracks().forEach((t) => t.stop());
                    return;
                }
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play();
                        setIsReady(true);
                    };
                }
            } catch (err: any) {
                if (!cancelled) {
                    if (err.name === 'NotAllowedError') {
                        setCameraError('Izin kamera ditolak. Harap izinkan akses kamera untuk melanjutkan ujian.');
                    } else if (err.name === 'NotFoundError') {
                        setCameraError('Kamera tidak ditemukan pada perangkat ini.');
                    } else {
                        setCameraError('Gagal mengakses kamera: ' + err.message);
                    }
                }
            }
        };

        startCamera();

        return () => {
            cancelled = true;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
            }
        };
    }, []);

    // Cleanup captured URL on unmount
    useEffect(() => {
        return () => {
            if (capturedUrl) {
                URL.revokeObjectURL(capturedUrl);
            }
        };
    }, [capturedUrl]);

    const capturePhoto = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Mirror the drawing to match the mirrored video preview
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    setCapturedBlob(blob);
                    const url = URL.createObjectURL(blob);
                    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
                    setCapturedUrl(url);
                }
            },
            'image/jpeg',
            0.8
        );
    }, [capturedUrl]);

    const retake = useCallback(() => {
        setCapturedBlob(null);
        if (capturedUrl) {
            URL.revokeObjectURL(capturedUrl);
            setCapturedUrl(null);
        }
        setError(null);
    }, [capturedUrl]);

    const confirmAndUpload = useCallback(async () => {
        if (!capturedBlob) return;

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('photo', capturedBlob, 'selfie.jpg');
            formData.append('type', 'initial');

            await api.post(`/enrolls/${enrollId}/snapshot`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Stop camera before transitioning
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
            }

            onVerified();
        } catch (err: any) {
            console.error('Selfie upload failed', err);
            setError('Gagal mengunggah foto. Silakan coba lagi.');
        } finally {
            setIsUploading(false);
        }
    }, [capturedBlob, enrollId, onVerified]);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 fixed inset-0 z-[100]">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl shadow-black/30">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                        Verifikasi Wajah
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                        Ambil foto wajah Anda sebelum memulai ujian
                    </p>
                </div>

                {/* Camera Error */}
                {cameraError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-red-800 mb-1">Kamera Tidak Tersedia</p>
                                <p className="text-xs text-red-600">{cameraError}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Camera Feed / Captured Image */}
                {!cameraError && (
                    <div className="relative mb-6">
                        <div className="relative overflow-hidden rounded-2xl bg-slate-900 aspect-[4/3]">
                            {/* Live video feed */}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                style={{
                                    display: capturedUrl ? 'none' : 'block',
                                    transform: 'scaleX(-1)',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />

                            {/* Captured image preview */}
                            {capturedUrl && (
                                <img
                                    src={capturedUrl}
                                    alt="Captured selfie"
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* Face outline overlay (only when live) */}
                            {!capturedUrl && isReady && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-48 h-60 border-2 border-dashed border-white/40 rounded-[50%]" />
                                </div>
                            )}

                            {/* Loading state */}
                            {!isReady && !capturedUrl && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-white/50 mx-auto mb-2" />
                                        <p className="text-white/50 text-xs font-bold">Memuat kamera...</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                )}

                {/* Upload error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                        <p className="text-xs font-bold text-red-700">{error}</p>
                    </div>
                )}

                {/* Action Buttons */}
                {!cameraError && (
                    <div className="space-y-3">
                        {!capturedUrl ? (
                            /* Capture button */
                            <button
                                onClick={capturePhoto}
                                disabled={!isReady}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black py-4 px-6 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 disabled:shadow-none"
                            >
                                <Camera className="h-5 w-5" />
                                Ambil Foto
                            </button>
                        ) : (
                            /* Retake & Confirm buttons */
                            <div className="flex gap-3">
                                <button
                                    onClick={retake}
                                    disabled={isUploading}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold py-4 px-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Ulangi
                                </button>
                                <button
                                    onClick={confirmAndUpload}
                                    disabled={isUploading}
                                    className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 px-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Mengunggah...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4" />
                                            Konfirmasi & Mulai Ujian
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Petunjuk</p>
                    <ul className="text-xs text-slate-500 space-y-1">
                        <li>• Pastikan wajah Anda terlihat jelas</li>
                        <li>• Pastikan pencahayaan cukup</li>
                        <li>• Foto ini akan digunakan untuk verifikasi identitas</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
