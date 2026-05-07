import { useState, useEffect } from "react";
import {
  BookOpen,
  Headphones,
  PenTool,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  HelpCircle,
  ClipboardList,
  GraduationCap,
  Loader2,
  AlertCircle,
  Brain,
  Sparkles,
  Zap,
  Target,
  ArrowRight
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

type Skill = "reading" | "listening" | "writing" | "speaking";
type TestType = "predictions" | "cambridge";
type Difficulty = "Easy" | "Medium" | "Hard";

interface TestItem {
  id: string;
  name: string;
  topic: string;
  difficulty: Difficulty;
  questions: number;
  time: string;
  slug?: string;
}

const skills: { id: Skill; icon: typeof BookOpen; title: string; description: string; color: string }[] = [
  { id: "reading", icon: BookOpen, title: "READING", description: "Learn skimming, scanning and detail techniques", color: "text-blue-400" },
  { id: "listening", icon: Headphones, title: "LISTENING", description: "Train your ear with section-by-section strategies", color: "text-emerald-400" },
  { id: "writing", icon: PenTool, title: "WRITING", description: "Master Task 1 & Task 2 with templates and examples", color: "text-indigo-400" },
  { id: "speaking", icon: MessageCircle, title: "SPEAKING", description: "Prepare for all 3 parts with sample answers", color: "text-amber-400" },
];

const testTypes: { id: TestType; icon: typeof ClipboardList; title: string; description: string }[] = [
  { id: "predictions", icon: ClipboardList, title: "PREDICTION TESTS", description: "Based on recent exam patterns" },
  { id: "cambridge", icon: GraduationCap, title: "CAMBRIDGE TESTS", description: "Official Cambridge IELTS books 1–19" },
];

const CAMBRIDGE_ACADEMIC_BOOKS = [19, 18, 17, 16, 15, 14, 13, 12, 11, 10] as const;

// ... (Mock data remains same to ensure functionality)
const listeningPredictionTests: TestItem[] = Array.from({ length: 15 }, (_, i) => ({
  id: `L${i+1}`,
  name: `Full Listening Test ${i+1}`,
  topic: "Full Practice",
  difficulty: "Hard",
  questions: 40,
  time: "40 min",
  slug: `full-listening-${i+1}`
}));

const readingPredictionTests: TestItem[] = Array.from({ length: 15 }, (_, i) => ({
  id: `${i+1}`,
  name: `Reading Passage ${i+1}`,
  topic: "Academic Training",
  difficulty: "Medium",
  questions: 13,
  time: "20 min",
  slug: `reading-${i+1}`
}));

const IELTSPrep = () => {
  const nav = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedType, setSelectedType] = useState<TestType | null>(null);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"tests" | "checker">("tests");

  const level = selectedType ? 3 : selectedSkill ? 2 : 1;

  const goBack = () => {
    if (selectedType) { setSelectedType(null); setTests([]); }
    else if (selectedSkill) { setSelectedSkill(null); }
  };

  useEffect(() => {
    if (!selectedSkill || !selectedType) return;
    setLoading(true);
    setTimeout(() => {
      if (selectedSkill === "reading") setTests(readingPredictionTests);
      else if (selectedSkill === "listening") setTests(listeningPredictionTests);
      else setTests([]);
      setLoading(false);
    }, 400);
  }, [selectedSkill, selectedType]);

  const skillLabel = selectedSkill ? skills.find((s) => s.id === selectedSkill)?.title : "";
  const typeLabel = selectedType ? testTypes.find((t) => t.id === selectedType)?.title : "";

  return (
    <Layout>
      <div className="min-h-screen bg-[#000000] text-white selection:bg-white/10 relative overflow-hidden font-sans">
        {/* Depth Background */}
        <div className="bg-vignette" />
        <div className="bg-sphere top-[-10%] right-[-5%] opacity-30" />
        
        <div className="max-w-[1400px] mx-auto px-10 py-24 relative z-10">
          {/* Header */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6 opacity-60">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-indigo-400">Elite Prep Hub 2026</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-shimmer leading-[0.85] mb-8 uppercase">
              IELTS <br /> HUB.
            </h1>
            <p className="text-xl text-[#666] font-medium max-w-2xl leading-relaxed">
              Комплексная подготовка к IELTS. От AI-проверки эссе до официальных тестов Cambridge. Твой путь к 8.5+ начинается здесь.
            </p>
          </div>

          {/* Breadcrumb & Navigation */}
          <div className="mb-12 flex items-center justify-between">
            <Breadcrumb className="opacity-40">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => { setSelectedSkill(null); setSelectedType(null); }} className="cursor-pointer font-black uppercase tracking-widest text-[10px]">IELTS</BreadcrumbLink>
                </BreadcrumbItem>
                {selectedSkill && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink onClick={() => setSelectedType(null)} className="cursor-pointer font-black uppercase tracking-widest text-[10px]">{skillLabel}</BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                {selectedType && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-black uppercase tracking-widest text-[10px] text-white">{typeLabel}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            {level > 1 && (
              <Button variant="ghost" onClick={goBack} className="text-[10px] font-black uppercase tracking-widest text-[#444] hover:text-white">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            )}
          </div>

          {/* Dynamic Content */}
          <div className="relative">
            {level === 1 && (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {skills.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSkill(s.id)}
                    className="glass-3d p-10 text-left group hover:scale-105 transition-all"
                  >
                    <s.icon className={`w-8 h-8 mb-10 ${s.color}`} />
                    <h3 className="text-2xl font-black mb-4 tracking-tight">{s.title}</h3>
                    <p className="text-xs font-bold text-[#444] uppercase tracking-widest leading-relaxed mb-10">{s.description}</p>
                    <div className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${s.color}`}>
                      Start Prep <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {level === 2 && (
              <div className="grid gap-8 sm:grid-cols-2 max-w-4xl">
                {testTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className="glass-3d p-12 text-left group hover:scale-105 transition-all"
                  >
                    <t.icon className="w-10 h-10 mb-10 text-indigo-400" />
                    <h3 className="text-3xl font-black mb-4 tracking-tight uppercase">{t.title}</h3>
                    <p className="text-sm font-bold text-[#444] uppercase tracking-widest mb-10">{t.description}</p>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-white">
                      Explore Tests <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {level === 3 && (
              <div className="space-y-12">
                 {loading ? (
                   <div className="flex flex-col items-center py-32 opacity-20">
                      <Loader2 className="w-12 h-12 animate-spin mb-6" />
                      <span className="text-xs font-black uppercase tracking-[0.5em]">Synchronizing Data</span>
                   </div>
                 ) : (
                   <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {selectedType === 'cambridge' ? (
                        CAMBRIDGE_ACADEMIC_BOOKS.map(book => (
                          <div key={book} className="glass-3d p-8">
                             <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Official Material</div>
                             <h3 className="text-xl font-black mb-8">CAMBRIDGE {book}</h3>
                             <div className="flex flex-col gap-3">
                                {[1, 2, 3, 4].map(test => (
                                  <Button key={test} variant="ghost" className="justify-between text-[10px] font-black uppercase tracking-widest text-[#444] hover:text-white border border-white/5 hover:border-white/10" onClick={() => nav(`/ielts/test/cambridge-${book}-test-${test}-${selectedSkill}`)}>
                                    Test {test} <ArrowRight className="w-3 h-3" />
                                  </Button>
                                ))}
                             </div>
                          </div>
                        ))
                      ) : (
                        tests.map((t, i) => (
                          <div key={t.id} className="glass-3d p-8 hover:border-white/20 transition-all group">
                             <div className="flex justify-between items-start mb-8">
                                <span className="text-[10px] font-black text-[#222] group-hover:text-white uppercase tracking-widest transition-colors">Test {i+1}</span>
                                <div className={`text-[8px] font-black px-2 py-1 rounded-sm uppercase tracking-widest border border-white/10 ${t.difficulty === 'Hard' ? 'text-rose-400' : 'text-emerald-400'}`}>{t.difficulty}</div>
                             </div>
                             <h3 className="text-xl font-black mb-2 tracking-tight group-hover:text-shimmer transition-all uppercase">{t.name}</h3>
                             <p className="text-[10px] font-black text-[#333] uppercase tracking-widest mb-10">{t.topic}</p>
                             <div className="flex items-center gap-6 mb-8 text-[9px] font-black text-[#222] uppercase tracking-widest">
                                <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {t.time}</span>
                                <span className="flex items-center gap-2"><HelpCircle className="w-3 h-3" /> {t.questions} Q</span>
                             </div>
                             <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-xl font-black uppercase text-[10px] tracking-widest h-12" onClick={() => t.slug && nav(`/ielts/test/${t.slug}`)}>Start Session</Button>
                          </div>
                        ))
                      )}
                   </div>
                 )}
              </div>
            )}
          </div>

          {/* Premium Footer Feature */}
          <div className="mt-32 glass-3d p-16 flex flex-col md:flex-row items-center justify-between gap-12 bg-gradient-to-r from-indigo-600/10 to-transparent border-indigo-500/20">
             <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                   <Brain className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                   <h3 className="text-3xl font-black tracking-tighter mb-2">AI WRITING ANALYZER.</h3>
                   <p className="text-sm font-bold text-[#444] uppercase tracking-widest">Get instant feedback and band estimation</p>
                </div>
             </div>
             <Button onClick={() => nav("/ielts/writing-checker")} className="bg-white text-black hover:bg-gray-100 rounded-xl px-12 h-16 font-black uppercase text-xs shadow-[0_15px_30px_rgba(255,255,255,0.1)] transition-all hover:scale-105 active:scale-95">Analyze Essay</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IELTSPrep;
