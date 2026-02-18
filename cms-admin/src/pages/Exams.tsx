import { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import api from '../lib/axios';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Calendar, Clock, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

interface Exam {
    id: number;
    title: string;
    code: string;
    category: string;
    firstDate?: string;
    firstTime?: string;
    secondDate?: string;
    secondTime?: string;
    thirdDate?: string;
    thirdTime?: string;
    fourthDate?: string;
    fourthTime?: string;
    conferenceLink?: string;
    activated: string;
    status: string;
    createdAt: string;
}

export default function Exams() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        category: 'ept',
        status: 'progress',
        activated: 'no',
        firstDate: '',
        firstTime: '',
        secondDate: '',
        secondTime: '',
        thirdDate: '',
        thirdTime: '',
        fourthDate: '',
        fourthTime: '',
        conferenceLink: '',
    });

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await api.get('/exams');
            setExams(res.data);
        } catch (error) {
            console.error('Failed to fetch exams', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/exams', formData);
            setIsModalOpen(false);
            fetchExams();
            setFormData({
                title: '',
                code: '',
                category: 'ept',
                status: 'progress',
                activated: 'no',
                firstDate: '',
                firstTime: '',
                secondDate: '',
                secondTime: '',
                thirdDate: '',
                thirdTime: '',
                fourthDate: '',
                fourthTime: '',
                conferenceLink: '',
            });
        } catch (error) {
            console.error(error);
            alert('Failed to create exam');
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteExam = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this exam?')) return;
        try {
            await api.delete(`/exams/${id}`);
            setExams(exams.filter((e) => e.id !== id));
        } catch (error) {
            alert('Failed to delete exam');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Manajemen Sesi Ujian</h2>
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                        <Plus className="h-4 w-4" />
                        Buat Sesi Baru
                    </Button>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Buat Sesi Ujian Baru"
                >
                    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-blue-600">Informasi Dasar</h4>
                            <Input
                                label="Judul Ujian"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. EPT Regular Batch 1"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Kode Ujian"
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="e.g. EPT-2024-001"
                                />
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Kategori</label>
                                    <select
                                        className="flex h-12 w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-2 text-sm font-bold focus:outline-none focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 transition-all text-slate-900"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="ept">EPT (English Proficiency Test)</option>
                                        <option value="toeic">TOEIC Prediction</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 border-t pt-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-blue-600">Jadwal Sesi 1 (Wajib)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Tanggal"
                                    type="date"
                                    required
                                    value={formData.firstDate}
                                    onChange={(e) => setFormData({ ...formData, firstDate: e.target.value })}
                                />
                                <Input
                                    label="Waktu"
                                    type="time"
                                    required
                                    value={formData.firstTime}
                                    onChange={(e) => setFormData({ ...formData, firstTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 border-t pt-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Jadwal Sesi 2 (Opsional)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Tanggal"
                                    type="date"
                                    value={formData.secondDate}
                                    onChange={(e) => setFormData({ ...formData, secondDate: e.target.value })}
                                />
                                <Input
                                    label="Waktu"
                                    type="time"
                                    value={formData.secondTime}
                                    onChange={(e) => setFormData({ ...formData, secondTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 border-t pt-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Jadwal Sesi 3 (Opsional)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Tanggal"
                                    type="date"
                                    value={formData.thirdDate}
                                    onChange={(e) => setFormData({ ...formData, thirdDate: e.target.value })}
                                />
                                <Input
                                    label="Waktu"
                                    type="time"
                                    value={formData.thirdTime}
                                    onChange={(e) => setFormData({ ...formData, thirdTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 border-t pt-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Jadwal Sesi 4 (Opsional)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Tanggal"
                                    type="date"
                                    value={formData.fourthDate}
                                    onChange={(e) => setFormData({ ...formData, fourthDate: e.target.value })}
                                />
                                <Input
                                    label="Waktu"
                                    type="time"
                                    value={formData.fourthTime}
                                    onChange={(e) => setFormData({ ...formData, fourthTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 border-t pt-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-blue-600">Virtual Room</h4>
                            <Input
                                label="Link Video Conference (Zoom/GMeet)"
                                value={formData.conferenceLink}
                                onChange={(e) => setFormData({ ...formData, conferenceLink: e.target.value })}
                                placeholder="https://zoom.us/j/..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-8 mt-6 border-t">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-black text-white px-8">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Sesi'
                                )}
                            </Button>
                        </div>
                    </form>
                </Modal>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <div className="col-span-full text-center py-24 text-slate-400">
                            <Loader2 className="mx-auto h-12 w-12 animate-spin mb-4" />
                            Memuat data sesi...
                        </div>
                    ) : exams.length === 0 ? (
                        <div className="col-span-full text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100 text-slate-400">
                            Belum ada sesi ujian yang dibuat.
                        </div>
                    ) : (
                        exams.map((exam) => (
                            <div key={exam.id} className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-600/10 transition-all p-8 flex flex-col group translate-y-0 hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col gap-2">
                                        <span className={`w-fit text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${exam.category === 'ept' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            {exam.category}
                                        </span>
                                        <span className="text-xs text-slate-400 font-black tracking-widest uppercase">{exam.code}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors bg-slate-50 rounded-xl">
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteExam(exam.id)}
                                            className="p-2 text-slate-300 hover:text-red-600 transition-colors bg-slate-50 rounded-xl"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">{exam.title}</h3>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                        <span>{exam.firstDate}</span>
                                        <span className="text-slate-300">|</span>
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        <span>{exam.firstTime}</span>
                                    </div>
                                    {(exam.secondDate || exam.thirdDate || exam.fourthDate) && (
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            + {(exam.secondDate ? 1 : 0) + (exam.thirdDate ? 1 : 0) + (exam.fourthDate ? 1 : 0)} Sesi Jadwal Tambahan
                                        </p>
                                    )}
                                </div>

                                <div className="mt-auto space-y-3">
                                    <Link
                                        to={`/exams/${exam.id}/sections`}
                                        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 text-sm font-black text-white hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                                    >
                                        Kelola Soal & Paket
                                    </Link>
                                    <button className="w-full text-xs font-black text-slate-400 hover:text-blue-600 py-2 transition-colors uppercase tracking-[0.2em]">
                                        Monitor Peserta
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
