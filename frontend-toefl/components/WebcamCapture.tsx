"use client";
import { useRef, useState, useCallback, useEffect } from "react";

interface WebcamCaptureProps {
  onCapture: (photoBlob: Blob, audioBlob?: Blob) => void;
  autoCapture?: boolean;
  autoCaptureInterval?: number; // default 1800000ms = 30min
  audioDuration?: number; // default 30000ms = 30sec
  showPreview?: boolean;
  showCaptureButton?: boolean;
  mirrorVideo?: boolean;
  className?: string;
}

export default function WebcamCapture({
  onCapture,
  autoCapture = false,
  autoCaptureInterval = 1800000,
  audioDuration = 30000,
  showPreview = true,
  showCaptureButton = true,
  mirrorVideo = true,
  className = "",
}: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start camera + microphone
  useEffect(() => {
    let cancelled = false;

    const startDevices = async () => {
      try {
        // Request camera
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
        });
        if (cancelled) {
          videoStream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = videoStream;
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsReady(true);
          };
        }

        // Request microphone (separate, non-blocking)
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          if (cancelled) {
            audioStream.getTracks().forEach((t) => t.stop());
            return;
          }
          audioStreamRef.current = audioStream;
        } catch (audioErr) {
          console.warn(
            "Microphone access denied or unavailable, audio recording disabled.",
            audioErr,
          );
        }
      } catch (err: any) {
        if (!cancelled) {
          if (err.name === "NotAllowedError") {
            setError(
              "Izin kamera ditolak. Harap izinkan akses kamera di pengaturan browser Anda.",
            );
          } else if (err.name === "NotFoundError") {
            setError("Kamera tidak ditemukan pada perangkat ini.");
          } else {
            setError("Gagal mengakses kamera: " + err.message);
          }
        }
      }
    };

    startDevices();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Record a short audio clip
  const recordAudioClip = useCallback((): Promise<Blob | undefined> => {
    return new Promise((resolve) => {
      if (!audioStreamRef.current) {
        resolve(undefined);
        return;
      }

      try {
        const mediaRecorder = new MediaRecorder(audioStreamRef.current, {
          mimeType: "audio/webm;codecs=opus",
        });
        const chunks: BlobPart[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          resolve(audioBlob);
        };

        mediaRecorder.onerror = () => {
          resolve(undefined);
        };

        mediaRecorder.start();
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, audioDuration);
      } catch (e) {
        console.warn("MediaRecorder not supported, skipping audio.", e);
        resolve(undefined);
      }
    });
  }, [audioDuration]);

  const onCaptureRef = useRef(onCapture);
  useEffect(() => {
    onCaptureRef.current = onCapture;
  }, [onCapture]);

  // Capture a single frame + audio
  const captureFrame = useCallback((): void => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isReady) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        if (blob) {
          // Start recording audio clip in parallel
          const audioBlob = await recordAudioClip();
          if (onCaptureRef.current) {
            onCaptureRef.current(blob, audioBlob);
          }
        }
      },
      "image/jpeg",
      0.8,
    );
  }, [isReady, recordAudioClip]);

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
      <div
        className={`text-red-500 text-sm p-4 bg-red-50 rounded-xl border border-red-100 ${className}`}
      >
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
          display: showPreview ? "block" : "none",
          transform: mirrorVideo ? "scaleX(-1)" : "none",
          width: "100%",
          borderRadius: "16px",
        }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
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
