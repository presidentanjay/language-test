'use client';
import { useRef, useState, useCallback, useEffect } from 'react';

interface WebcamCaptureProps {
    onCapture: (blob: Blob) => void;
    autoCapture?: boolean;
    autoCaptureInterval?: number; // default 180000ms = 3min
    showPreview?: boolean;
    showCaptureButton?: boolean;
    mirrorVideo?: boolean;
    className?: string;
}

export default function WebcamCapture({
    onCapture,
    autoCapture = false,
    autoCaptureInterval = 180000,
    showPreview = true,
    showCaptureButton = true,
    mirrorVideo = true,
    className = '',
}: WebcamCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                        setError('Izin kamera ditolak. Harap izinkan akses kamera di pengaturan browser Anda.');
                    } else if (err.name === 'NotFoundError') {
                        setError('Kamera tidak ditemukan pada perangkat ini.');
                    } else {
                        setError('Gagal mengakses kamera: ' + err.message);
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
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    // Capture a single frame
    const captureFrame = useCallback((): Blob | null => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !isReady) return null;

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Synchronously convert to blob via toDataURL (for return value)
        // But for onCapture callback, use toBlob for better quality
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    onCapture(blob);
                }
            },
            'image/jpeg',
            0.8
        );

        return null; // blob is sent via callback
    }, [isReady, onCapture]);

    // Auto-capture interval
    useEffect(() => {
        if (!autoCapture || !isReady) return;

        // Take first snapshot immediately
        captureFrame();

        intervalRef.current = setInterval(() => {
            captureFrame();
        }, autoCaptureInterval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [autoCapture, autoCaptureInterval, isReady, captureFrame]);

    if (error) {
        return (
            <div className={`text-red-500 text-sm p-4 bg-red-50 rounded-xl border border-red-100 ${className}`}>
                <p className="font-bold mb-1">⚠️ Kamera Error</p>
                <p className="text-xs">{error}</p>
            </div>
        );
    }

    return (
        <div className={className}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    display: showPreview ? 'block' : 'none',
                    transform: mirrorVideo ? 'scaleX(-1)' : 'none',
                    width: '100%',
                    borderRadius: '16px',
                }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {showCaptureButton && isReady && showPreview && (
                <button
                    onClick={captureFrame}
                    className="mt-3 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all active:scale-95"
                >
                    Ambil Foto
                </button>
            )}
        </div>
    );
}
