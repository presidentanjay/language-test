import { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import api from '../lib/axios';
import { Button } from '../components/ui/Button';
import { Loader2 } from 'lucide-react';

interface ScoreMapping {
    id?: number;
    category: 'ept' | 'toeic';
    sectionType: string;
    rawScore: number;
    scaledScore: number;
}

export default function ScoreManagement() {
    const [activeTab, setActiveTab] = useState('listening');
    const [mappings, setMappings] = useState<ScoreMapping[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchMappings();
    }, []);

    const fetchMappings = async () => {
        try {
            const res = await api.get('/score-mappings/ept'); // Currently only EPT
            setMappings(res.data);
        } catch (error) {
            console.error('Failed to fetch mappings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (rawScore: number, scaledScore: string) => {
        const val = parseInt(scaledScore) || 0;

        setMappings(prev => {
            const existingIndex = prev.findIndex(m => m.sectionType === activeTab && m.rawScore === rawScore);

            if (existingIndex >= 0) {
                const newMappings = [...prev];
                newMappings[existingIndex] = { ...newMappings[existingIndex], scaledScore: val };
                return newMappings;
            } else {
                return [...prev, { category: 'ept', sectionType: activeTab, rawScore, scaledScore: val }];
            }
        });
    };

    const getScore = (raw: number) => {
        const m = mappings.find(m => m.sectionType === activeTab && m.rawScore === raw);
        return m ? m.scaledScore : 0;
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            await api.post('/score-mappings', { mappings });
            alert('Score mappings saved!');
        } catch (error) {
            console.error(error);
            alert('Failed to save mappings');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getMaxQuestions = () => {
        switch (activeTab) {
            case 'listening': return 50;
            case 'structure': return 40;
            case 'reading': return 50;
            default: return 50;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Score Management (TOEFL/EPT)</h2>
                    <p className="text-sm text-gray-500">Manage score conversion table.</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 rounded-xl bg-slate-100 p-1 w-fit">
                    {['listening', 'structure', 'reading'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-32 rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 transition-all ${activeTab === tab
                                    ? 'bg-white text-slate-900 shadow'
                                    : 'text-slate-700 hover:bg-white/[0.12] hover:text-slate-900'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="font-bold text-lg capitalize flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                                        {activeTab} Table
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Raw Score to Scaled Score conversion</p>
                                </div>
                                <Button onClick={handleSave} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {Array.from({ length: getMaxQuestions() + 1 }, (_, i) => i).map((raw) => (
                                    <div key={raw} className="flex items-stretch border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent transition-all">
                                        <div className="w-12 flex items-center justify-center bg-slate-50 border-r border-gray-200 text-xs font-mono text-slate-500 font-bold select-none">
                                            {raw}
                                        </div>
                                        <input
                                            type="number"
                                            className="w-full p-2 outline-none text-sm font-medium text-center"
                                            value={getScore(raw)}
                                            onChange={(e) => handleScoreChange(raw, e.target.value)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
