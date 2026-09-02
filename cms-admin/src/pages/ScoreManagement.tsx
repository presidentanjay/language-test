import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../lib/axios";
import { Button } from "../components/ui/Button";
import { Loader2 } from "lucide-react";

interface ScoreMapping {
  id?: number;
  category: "ept";
  sectionType: string;
  rawScore: number;
  scaledScore: number;
}

export default function ScoreManagement() {
  const [activeTab, setActiveTab] = useState("listening");
  const [mappings, setMappings] = useState<ScoreMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMappings();
  }, []);

  const fetchMappings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/score-mappings/ept");
      setMappings(res.data);
    } catch (error) {
      console.error("Failed to fetch mappings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (rawScore: number, scaledScore: string) => {
    const val = parseInt(scaledScore) || 0;

    setMappings((prev) => {
      const existingIndex = prev.findIndex(
        (m) => m.sectionType === activeTab && m.rawScore === rawScore,
      );

      if (existingIndex >= 0) {
        const newMappings = [...prev];
        newMappings[existingIndex] = {
          ...newMappings[existingIndex],
          scaledScore: val,
        };
        return newMappings;
      } else {
        return [
          ...prev,
          {
            category: "ept",
            sectionType: activeTab,
            rawScore,
            scaledScore: val,
          },
        ];
      }
    });
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await api.post("/score-mappings", { mappings });
      alert("Berhasil menyimpan pemetaan skor");
    } catch (error) {
      console.error("Failed to save mappings", error);
      alert("Gagal menyimpan pemetaan skor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentMappings = mappings.filter((m) => m.sectionType === activeTab);

  const getMaxQuestions = () => {
    switch (activeTab) {
      case "listening":
        return 50;
      case "structure":
        return 40;
      case "reading":
        return 50;
      default:
        return 50;
    }
  };

  const getScore = (raw: number) => {
    const m = currentMappings.find((m) => m.rawScore === raw);
    return m ? m.scaledScore : 0;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Manajemen Pemetaan Skor
            </h2>
            <p className="text-sm font-bold text-slate-500 mt-1">
              Atur konversi nilai mentah ke nilai skala (Scaled Score) untuk tes
              EPT (TOEFL)
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSubmitting || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Simpan Perubahan
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Section Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-100 whitespace-nowrap">
            <button
              onClick={() => setActiveTab("listening")}
              className={`flex-1 py-4 text-sm font-black transition-all border-b-2 ${
                activeTab === "listening"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:bg-slate-50"
              }`}
            >
              Listening
            </button>
            <button
              onClick={() => setActiveTab("structure")}
              className={`flex-1 py-4 text-sm font-black transition-all border-b-2 ${
                activeTab === "structure"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:bg-slate-50"
              }`}
            >
              Structure & Written Exp.
            </button>
            <button
              onClick={() => setActiveTab("reading")}
              className={`flex-1 py-4 text-sm font-black transition-all border-b-2 ${
                activeTab === "reading"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:bg-slate-50"
              }`}
            >
              Reading
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: getMaxQuestions() + 1 }, (_, i) => i).map(
                  (raw) => (
                    <div
                      key={raw}
                      className="flex items-stretch border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all"
                    >
                      <div className="w-12 flex items-center justify-center bg-slate-50 border-r border-gray-200 text-xs font-mono text-slate-500 font-bold select-none">
                        {raw}
                      </div>
                      <input
                        type="number"
                        className="w-full p-2 outline-none text-sm font-medium text-center"
                        value={getScore(raw) || ""}
                        onChange={(e) => handleScoreChange(raw, e.target.value)}
                        onFocus={(e) => e.target.select()}
                        placeholder="0"
                      />
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
