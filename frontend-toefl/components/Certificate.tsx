import { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, X, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

interface CertificateProps {
    data: {
        participant: {
            name: string;
            email: string;
            npm: string;
            program_study: string;
            faculty: string;
        };
        exam: {
            title: string;
            date: string;
            category: string;
        };
        scores: {
            listening: number;
            structure: number;
            reading: number;
            overall: number;
        };
    };
    onClose: () => void;
}

export default function Certificate({ data, onClose }: CertificateProps) {
    const certRef = useRef<HTMLDivElement>(null);
    const [settings, setSettings] = useState<any>(null);
    const [loadingSettings, setLoadingSettings] = useState(true);

    useEffect(() => {
        api.get('/settings').then(res => {
            setSettings(res.data);
            setLoadingSettings(false);
        }).catch(() => setLoadingSettings(false));
    }, []);

    const handleDownload = async () => {
        if (!certRef.current) return;

        try {
            const canvas = await html2canvas(certRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            } as any);

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Certificate-${data.participant.name.replace(/\s+/g, '-')}.pdf`);
        } catch (error) {
            console.error('Failed to generate PDF', error);
            alert('Gagal membuat PDF sertifikat');
        }
    };

    // Format date specifically for certificate (e.g., "11 February 2025")
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    };

    // Calculate valid until (2 years from test date)
    const getValidUntil = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        date.setFullYear(date.getFullYear() + 2);
        return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col max-h-[90vh]">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Preview Sertifikat</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" /> Download PDF
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-slate-100 p-8 flex justify-center relative">
                    {loadingSettings && (
                        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    )}
                    {/* Certificate Container - Scaled to fit A4 aspect ratio */}
                    <div
                        ref={certRef}
                        className="relative bg-white shadow-lg text-slate-900 overflow-hidden"
                        style={{
                            width: '1123px', // A4 Landscape width at 96 DPI approx (297mm)
                            height: '794px', // A4 Landscape height at 96 DPI approx (210mm)
                            backgroundImage: `url(${settings?.cert_template_path ? api.defaults.baseURL?.replace('/api', '') + settings.cert_template_path : '/assets/certificate-template.jpg'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {/* Name */}
                        <div className="absolute top-[32%] w-full text-center">
                            <h1 className="text-5xl font-serif font-bold uppercase tracking-wide text-slate-900" style={{ fontFamily: 'Times New Roman' }}>
                                {data.participant.name}
                            </h1>
                        </div>

                        {/* Student ID */}
                        <div className="absolute top-[42%] w-full text-center">
                            <p className="text-xl font-serif" style={{ fontFamily: 'Times New Roman' }}>
                                Student ID No : {data.participant.npm}
                            </p>
                        </div>

                        {/* Exam Type & Date */}
                        <div className="absolute top-[47%] w-full text-center">
                            <p className="text-xl font-serif" style={{ fontFamily: 'Times New Roman' }}>
                                has taken the {data.exam.category.toUpperCase()} - Utama on<br />
                                {formatDate(data.exam.date)}
                            </p>
                        </div>

                        {/* Scores */}
                        <div className="absolute top-[58%] w-full flex flex-col items-center gap-1">
                            <div className="text-xl font-serif flex justify-between w-[200px]" style={{ fontFamily: 'Times New Roman' }}>
                                <span>Listening</span> <span>: {data.scores.listening}</span>
                            </div>
                            <div className="text-xl font-serif flex justify-between w-[200px]" style={{ fontFamily: 'Times New Roman' }}>
                                <span>Structure</span> <span>: {data.scores.structure}</span>
                            </div>
                            <div className="text-xl font-serif flex justify-between w-[200px]" style={{ fontFamily: 'Times New Roman' }}>
                                <span>Reading</span> <span>: {data.scores.reading}</span>
                            </div>
                            <div className="text-xl font-serif font-bold flex justify-between w-[200px] mt-2" style={{ fontFamily: 'Times New Roman' }}>
                                <span>OVERALL</span> <span>: {data.scores.overall}</span>
                            </div>
                        </div>

                        {/* Valid Until */}
                        <div className="absolute bottom-[28%] left-[8%] text-left">
                            <p className="text-lg font-serif" style={{ fontFamily: 'Times New Roman' }}>
                                Valid until : {getValidUntil(data.exam.date)}
                            </p>
                        </div>

                        {/* Dynamic Signature and Director Info */}
                        <div className="absolute bottom-[10%] right-[10%] w-[350px] text-center flex flex-col items-center">
                            {settings?.cert_signature_path ? (
                                <img 
                                    src={`${api.defaults.baseURL?.replace('/api', '')}${settings.cert_signature_path}`} 
                                    alt="Signature" 
                                    className="h-28 object-contain mb-[-10px] z-10"
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                <div className="h-28 w-full" />
                            )}
                            <div className="border-b border-black font-serif font-bold text-xl px-4 z-0" style={{ fontFamily: 'Times New Roman' }}>
                                {settings?.cert_director_name || 'Ida Zuraida, Hj., S.S., M.Pd.'}
                            </div>
                            <div className="font-serif text-lg mt-1" style={{ fontFamily: 'Times New Roman' }}>
                                {settings?.cert_director_nip || 'Head of Lembaga Bahasa'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
