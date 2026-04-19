import { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import api from '../lib/axios';
import { Loader2, Search, FileText, Calendar, User, Filter, Award, Printer } from 'lucide-react';
import { Input } from '../components/ui/Input';
import Certificate from '../components/Certificate';

interface ParticipantScore {
    id: number;
    userId: string | number;
    score: number;
    status: string;
    date: string;
    time: string;
    user: {
        name: string;
        email: string;
    };
    exam: {
        title: string;
        category: string;
    };
}

export default function ParticipantScores() {
    const [scores, setScores] = useState<ParticipantScore[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
    const [certLoading, setCertLoading] = useState(false);

    useEffect(() => {
        fetchScores();
    }, []);

    const fetchScores = async () => {
        setLoading(true);
        try {
            const res = await api.get('/reports/participants');
            setScores(res.data);
        } catch (error) {
            console.error('Failed to fetch scores', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintCertificate = async (id: number) => {
        setCertLoading(true);
        try {
            const res = await api.get(`/certificates/${id}`);
            setSelectedCertificate(res.data);
        } catch (error) {
            console.error('Failed to fetch certificate data', error);
            alert('Gagal memuat data sertifikat');
        } finally {
            setCertLoading(false);
        }
    };

    const filteredScores = scores.filter(item => {
        const matchSearch = (item.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (item.user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
            (item.exam?.title || '').toLowerCase().includes(search.toLowerCase());
        const matchCategory = categoryFilter ? item.exam?.category === categoryFilter : true;

        return matchSearch && matchCategory;
    });

    const getScoreColor = (score: number) => {
        if (score >= 500) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (score >= 400) return 'text-blue-600 bg-blue-50 border-blue-100';
        return 'text-orange-600 bg-orange-50 border-orange-100';
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Hasil Ujian Peserta</h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Daftar nilai dan status ujian peserta</p>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[240px] relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <Input
                                placeholder="Cari nama, email, atau paket ujian..."
                                className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-100"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 px-4 rounded-xl border border-slate-100">
                            <Filter className="h-4 w-4 text-slate-400" />
                            <select
                                className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none h-12 min-w-[150px]"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">Semua Kategori</option>
                                <option value="ept">EPT</option>
                                <option value="toeic">TOEIC</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-2xl border border-slate-100">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Peserta</th>
                                    <th className="px-6 py-4">Paket Ujian</th>
                                    <th className="px-6 py-4">Waktu Tes</th>
                                    <th className="px-6 py-4 text-center">Skor Akhir</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
                                            <span className="text-xs font-bold text-slate-400">Memuat data...</span>
                                        </td>
                                    </tr>
                                ) : filteredScores.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center text-slate-400 font-bold italic">
                                            Tidak ada data ujian yang ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredScores.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{item.user?.name || `User ID: ${item.userId} (Relasi Error)`}</div>
                                                        <div className="text-xs font-bold text-slate-400">{item.user?.email || '-'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-2 rounded-lg ${item.exam?.category === 'toeic' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 line-clamp-1 max-w-[200px]">{item.exam?.title || 'Unknown Exam'}</div>
                                                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">{item.exam?.category || '-'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                                                    <Calendar className="h-3 w-3" />
                                                    {item.date} • {item.time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-black ${getScoreColor(item.score)}`}>
                                                    <Award className="h-3 w-3" />
                                                    {item.score}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'finish' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {(item.status === 'finish' || item.status === 'good') && (
                                                    <button
                                                        onClick={() => handlePrintCertificate(item.id)}
                                                        disabled={certLoading}
                                                        className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all mx-auto"
                                                        title="Cetak Sertifikat"
                                                    >
                                                        {certLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {selectedCertificate && (
                    <Certificate
                        data={selectedCertificate}
                        onClose={() => setSelectedCertificate(null)}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
