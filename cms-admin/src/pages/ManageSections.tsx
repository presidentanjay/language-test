import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import api from '../lib/axios';
import { Plus, Trash2, ArrowLeft, Upload, FileJson, Loader2, CheckCircle2, BookOpen, Headphones, Music, Play, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

interface SectionAudio {
    id: number;
    audioUrl: string;
    fromQuestion: number;
    toQuestion: number;
}

interface Section {
    id: number;
    section: string;
    title: string;
    description: string;
    duration: number;
    questions_count?: number;
    audio?: string | null;
    sectionAudios?: SectionAudio[];
}

interface BankPackage {
    id: number;
    name: string;
    category: string;
    questions_count?: number;
}

interface Exam {
    id: number;
    title: string;
}

export default function ManageSections() {
    const { examId } = useParams();
    const [exam, setExam] = useState<Exam | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const [bankPackages, setBankPackages] = useState<BankPackage[]>([]);
    const [bulkData, setBulkData] = useState('');
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioSegments, setAudioSegments] = useState<SectionAudio[]>([]);
    const [audioRange, setAudioRange] = useState({ from: 1, to: 10 });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        exam_id: examId,
        section: '',
        title: '',
        description: '',
        duration: 30,
    });

    useEffect(() => {
        fetchExamAndSections();
    }, [examId]);

    const fetchExamAndSections = async () => {
        try {
            const [examRes, sectionsRes] = await Promise.all([
                api.get(`/exams/${examId}`),
                api.get(`/sections?exam_id=${examId}`)
            ]);
            setExam(examRes.data);
            setSections(sectionsRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBankPackages = async () => {
        try {
            const res = await api.get('/bank-packages');
            setBankPackages(res.data);
        } catch (error) {
            console.error('Failed to fetch bank packages', error);
        }
    };

    const fetchAudioSegments = async (sectionId: number) => {
        try {
            const res = await api.get(`/sections/${sectionId}/audios`);
            setAudioSegments(res.data);
        } catch (error) {
            console.error('Failed to fetch audio segments', error);
        }
    };

    const handleCreateSection = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/sections', formData);
            setIsModalOpen(false);
            fetchExamAndSections();
            setFormData({
                exam_id: examId,
                section: '',
                title: '',
                description: '',
                duration: 30,
            });
        } catch (error) {
            alert('Failed to create section');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSection = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this section?')) return;
        try {
            await api.delete(`/sections/${id}`);
            setSections(sections.filter(s => s.id !== id));
        } catch (error) {
            alert('Failed to delete section');
        }
    };

    const handleBulkUpload = async () => {
        if (!selectedSection || !bulkData) return;
        setIsSubmitting(true);
        try {
            const questions = JSON.parse(bulkData);
            await api.post(`/sections/${selectedSection.id}/bulk-questions`, { questions });
            alert('Bulk upload successful!');
            setIsBulkModalOpen(false);
            setBulkData('');
        } catch (error: any) {
            alert(`Error during upload: ${error.message || 'Check JSON format'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImportFromBank = async (bankPackageId: number) => {
        if (!selectedSection) return;
        setIsSubmitting(true);
        try {
            await api.post(`/sections/${selectedSection.id}/import-bank`, { 
                bank_package_id: bankPackageId 
            });
            alert('Questions imported successfully!');
            setIsImportModalOpen(false);
            fetchExamAndSections();
        } catch (error: any) {
            alert(`Error during import: ${error.message || 'Server error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAudioUpload = async () => {
        if (!selectedSection || !audioFile) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('audio', audioFile);
            formData.append('from_question', audioRange.from.toString());
            formData.append('to_question', audioRange.to.toString());

            await api.post(`/sections/${selectedSection.id}/audios`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Audio segment uploaded successfully!');
            setAudioFile(null);
            fetchAudioSegments(selectedSection.id);
        } catch (error: any) {
            alert(`Error during audio upload: ${error.message || 'Server error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAudioSegment = async (id: number) => {
        if (!window.confirm('Hapus audio segment ini?')) return;
        try {
            await api.delete(`/section-audios/${id}`);
            if (selectedSection) fetchAudioSegments(selectedSection.id);
        } catch (error) {
            alert('Failed to delete audio segment');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link to="/exams" className="text-gray-400 hover:text-gray-600">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{exam?.title || 'Loading...'}</h2>
                        <p className="text-sm text-gray-500">Manage packages and questions for this exam.</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Package
                    </Button>
                </div>

                {/* Section List */}
                <div className="grid gap-6">
                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading sections...</div>
                    ) : sections.length === 0 ? (
                        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-500">
                            No packages found. Create one to start adding questions!
                        </div>
                    ) : (
                        sections.map((section) => (
                            <div key={section.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900">{section.title}</h4>
                                            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded uppercase">{section.section}</span>
                                                <span>{section.duration} mins</span>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-600">{section.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/sections/${section.id}/questions`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                                            >
                                                Manage Questions
                                            </Link>
                                            <Button
                                                variant="secondary"
                                                className="flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100"
                                                onClick={() => {
                                                    setSelectedSection(section);
                                                    setIsBulkModalOpen(true);
                                                }}
                                            >
                                                <Upload className="h-4 w-4" />
                                                Bulk
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                className="flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                onClick={() => {
                                                    setSelectedSection(section);
                                                    fetchBankPackages();
                                                    setIsImportModalOpen(true);
                                                }}
                                            >
                                                <BookOpen className="h-4 w-4" />
                                                Import Bank
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                className={`flex items-center gap-2 rounded-xl border-2 transition-all border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100`}
                                                onClick={() => {
                                                    setSelectedSection(section);
                                                    fetchAudioSegments(section.id);
                                                    setIsAudioModalOpen(true);
                                                }}
                                            >
                                                <Headphones className="h-4 w-4" />
                                                Manage Audios
                                            </Button>
                                            <button
                                                onClick={() => handleDeleteSection(section.id)}
                                                className="p-2 text-slate-300 hover:text-red-600 transition-colors bg-slate-50 rounded-xl"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Create Section Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Create New Package"
                >
                    <form onSubmit={handleCreateSection} className="space-y-4">
                        <Input
                            label="Package Name (e.g. Package A)"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Identifier (Code)"
                                required
                                placeholder="PKG-A"
                                value={formData.section}
                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                            />
                            <Input
                                label="Duration (minutes)"
                                type="number"
                                required
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                            />
                        </div>
                        <Input
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Package'}
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* Bulk Upload Modal */}
                <Modal
                    isOpen={isBulkModalOpen}
                    onClose={() => setIsBulkModalOpen(false)}
                    title={`Bulk Upload Questions - ${selectedSection?.title}`}
                >
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex gap-3">
                                <FileJson className="h-5 w-5 text-blue-600 shrink-0" />
                                <div className="text-xs text-blue-800 space-y-1">
                                    <p className="font-bold">JSON Format Required:</p>
                                    <pre className="bg-blue-100/50 p-2 rounded mt-1 overflow-x-auto">
                                        {`[\n  {\n    "question": "The capital of Indonesia is...",\n    "answers": [\n      {"answer": "Jakarta", "is_correct": "yes"},\n      {"answer": "Bandung", "is_correct": "no"}\n    ]\n  }\n]`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                        <textarea
                            className="w-full h-64 p-4 font-mono text-xs rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-950 focus:outline-none"
                            placeholder="Paste your JSON here..."
                            value={bulkData}
                            onChange={(e) => setBulkData(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setIsBulkModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleBulkUpload}
                                disabled={isSubmitting || !bulkData}
                                className="flex items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                {isSubmitting ? 'Uploading...' : 'Start Upload'}
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Import from Bank Modal */}
                <Modal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    title={`Import from Bank - ${selectedSection?.title}`}
                >
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500">
                            Pilih paket dari Bank Soal untuk disalin ke section ini.
                        </p>
                        <div className="max-h-96 overflow-y-auto space-y-2 border border-slate-100 rounded-xl p-2 bg-slate-50">
                            {bankPackages.length === 0 ? (
                                <p className="text-center py-8 text-slate-400 italic">Tidak ada paket di Bank Soal.</p>
                            ) : (
                                bankPackages.map((pkg) => (
                                    <button
                                        key={pkg.id}
                                        onClick={() => handleImportFromBank(pkg.id)}
                                        disabled={isSubmitting}
                                        className="w-full text-left p-4 rounded-xl border border-white bg-white hover:border-blue-600/30 hover:shadow-md transition-all group flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="font-bold text-slate-900 group-hover:text-blue-600">{pkg.name}</p>
                                            <p className="text-xs text-slate-400 uppercase font-black tracking-widest">{pkg.category}</p>
                                        </div>
                                        {isSubmitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                                        ) : (
                                            <Plus className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button variant="secondary" onClick={() => setIsImportModalOpen(false)}>
                                Tutup
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Audio Upload Modal */}
                <Modal
                    isOpen={isAudioModalOpen}
                    onClose={() => {
                        setIsAudioModalOpen(false);
                        setAudioFile(null);
                    }}
                    title={`Section Audios - ${selectedSection?.title}`}
                >
                    <div className="space-y-6">
                        {/* List of existing audio segments */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Existing Segments</label>
                            {audioSegments.length === 0 ? (
                                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                                    No audios uploaded yet.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {audioSegments.map((seg) => (
                                        <div key={seg.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col gap-3 shadow-sm">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                                        Q{seg.fromQuestion} - Q{seg.toQuestion}
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={() => handleDeleteAudioSegment(seg.id)}
                                                    className="p-1.5 text-slate-300 hover:text-red-600 transition-all bg-slate-50 rounded-lg"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <audio controls className="w-full h-8" src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333'}${seg.audioUrl}`}>
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-100 pt-6 space-y-6">
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-blue-600 block">
                                    Upload New Segment
                                </label>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <Input 
                                        label="From Question #"
                                        type="number"
                                        value={audioRange.from}
                                        onChange={(e) => setAudioRange({...audioRange, from: parseInt(e.target.value)})}
                                    />
                                    <Input 
                                        label="To Question #"
                                        type="number"
                                        value={audioRange.to}
                                        onChange={(e) => setAudioRange({...audioRange, to: parseInt(e.target.value)})}
                                    />
                                </div>

                                {!audioFile ? (
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                        />
                                        <div className="border-2 border-dashed border-slate-200 rounded-[30px] p-8 flex flex-col items-center justify-center gap-3 group-hover:border-blue-500/50 group-hover:bg-blue-50/30 transition-all">
                                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all">
                                                <Music className="h-6 w-6" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-slate-900">Click to upload MP3</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-blue-50 border-2 border-blue-600/10 rounded-[30px] p-6 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                                            <Music className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{audioFile.name}</p>
                                            <p className="text-xs text-blue-600/60 font-bold uppercase tracking-wider">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button 
                                            onClick={() => setAudioFile(null)}
                                            className="p-2 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-xl transition-all"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button 
                                    variant="secondary" 
                                    onClick={() => {
                                        setIsAudioModalOpen(false);
                                        setAudioFile(null);
                                    }}
                                >
                                    Tutup
                                </Button>
                                <Button
                                    onClick={handleAudioUpload}
                                    disabled={isSubmitting || !audioFile}
                                    className="bg-slate-900 hover:bg-black text-white px-8"
                                >
                                    {isSubmitting ? 'Uploading...' : 'Save Segment'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </AdminLayout>
    );
}
