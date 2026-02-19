import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import api from '../lib/axios';
import { Plus, Trash2, ArrowLeft, Upload, FileJson, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

interface Section {
    id: number;
    section: string;
    title: string;
    description: string;
    duration: number;
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
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const [bulkData, setBulkData] = useState('');
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
            </div>
        </AdminLayout>
    );
}
