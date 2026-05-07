import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import katex from "katex";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ChevronRight,
  Loader2,
  AlertCircle,
  ChevronDown,
  Shuffle,
  Eye,
  BookOpen,
  Calculator,
  ListFilter,
  Play,
  X,
  Brain,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  History,
  Target
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import SATAITutor from "@/components/sat-ai-tutor";
import { supabase } from "@/lib/supabase";

/* ════════════════════════════════════════════════════════════════════
   KaTeX & Helpers
   ════════════════════════════════════════════════════════════════════ */
const KATEX_OPTS = { throwOnError: false, errorColor: "#f87171" };

function renderKaTeX(raw: string): string {
  if (!raw) return "";
  try {
    return raw.replace(/\$\$([^$]+?)\$\$/gs, (_, m) => katex.renderToString(m, { ...KATEX_OPTS, displayMode: true }))
              .replace(/\$([^$\n]{1,600}?)\$/g, (_, m) => katex.renderToString(m, KATEX_OPTS));
  } catch { return raw; }
}

function MathText({ text, className }: { text: string; className?: string }) {
  const html = useMemo(() => renderKaTeX(text || ""), [text]);
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

function normalizeAnswer(a: string) {
  return a.trim().toLowerCase().replace(/\s+/g, "");
}

/* ════════════════════════════════════════════════════════════════════
   Types & Fetching
   ════════════════════════════════════════════════════════════════════ */
interface SATQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  category: string;
  section: string;
  isFreeResponse: boolean;
  image_url?: string;
}

type QuestionType = "all" | "mcq" | "open";
type Phase = "bank" | "quiz" | "results";

/* ════════════════════════════════════════════════════════════════════
   Main Component
   ════════════════════════════════════════════════════════════════════ */
export default function SATPractice() {
  const nav = useNavigate();
  const [meta, setMeta] = useState<any>(null);
  const [questions, setQuestions] = useState<SATQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("bank");
  const [loading, setLoading] = useState(true);
  const [answerState, setAnswerState] = useState<any>(null);
  const [sessionAnswers, setSessionAnswers] = useState<Record<string, any>>({});
  const [elapsed, setElapsed] = useState(0);
  const [frInput, setFrInput] = useState("");
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const init = async () => {
      const { data: mcq } = await supabase.from("SAT_MCQ").select("*");
      const { data: open } = await supabase.from("SAT_Open").select("*");
      
      const allQs: SATQuestion[] = [
        ...(mcq || []).map(r => ({
          id: `mcq-${r.id}`,
          question: r.question,
          optionA: r.option_a,
          optionB: r.option_b,
          optionC: r.option_c,
          optionD: r.option_d,
          correctAnswer: r.correct_answer,
          explanation: r.explanation,
          difficulty: r.difficulty,
          category: r.category,
          section: r.section,
          isFreeResponse: false,
          image_url: r.image_url
        })),
        ...(open || []).map(r => ({
          id: `open-${r.id}`,
          question: r.question,
          optionA: "", optionB: "", optionC: "", optionD: "",
          correctAnswer: r.correct_answer,
          explanation: r.explanation,
          difficulty: r.difficulty,
          category: r.category,
          section: r.section,
          isFreeResponse: true,
          image_url: r.image_url
        }))
      ];
      setQuestions(allQs);
      setLoading(false);
    };
    init();
  }, []);

  const startQuiz = (qs: SATQuestion[]) => {
    setQuestions(qs.sort(() => Math.random() - 0.5));
    setPhase("quiz");
    setCurrentIdx(0);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  };

  const exitQuiz = () => {
    clearInterval(timerRef.current);
    setPhase("bank");
  };

  const handleMCAnswer = async (label: string) => {
    if (answerState) return;
    const q = questions[currentIdx];
    const correct = label === q.correctAnswer;
    setAnswerState({ selected: label, correct });
    setSessionAnswers(p => ({ ...p, [q.id]: { correct } }));
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('user_progress').insert({
        user_id: session.user.id,
        question_id: q.id,
        section: q.section,
        category: q.category,
        difficulty: q.difficulty,
        correct
      });
    }
  };

  const handleFRAnswer = async () => {
    if (answerState || !frInput.trim()) return;
    const q = questions[currentIdx];
    const correct = normalizeAnswer(frInput) === normalizeAnswer(q.correctAnswer);
    setAnswerState({ selected: frInput, correct });
    setSessionAnswers(p => ({ ...p, [q.id]: { correct } }));
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('user_progress').insert({
        user_id: session.user.id,
        question_id: q.id,
        section: q.section,
        category: q.category,
        difficulty: q.difficulty,
        correct
      });
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setAnswerState(null);
      setFrInput("");
    } else {
      clearInterval(timerRef.current);
      setPhase("results");
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-white" /></div>;

  /* ── Bank ───────────────────────────────────────────────────────── */
  if (phase === "bank") {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white p-10">
           <div className="max-w-[1400px] mx-auto">
              <h1 className="text-6xl font-black text-shimmer mb-12">SAT BANK.</h1>
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="glass-3d p-12 group cursor-pointer" onClick={() => startQuiz(questions.filter(q => q.section === "Math"))}>
                    <Calculator className="w-10 h-10 mb-8 text-blue-400" />
                    <h3 className="text-3xl font-black mb-4">MATH</h3>
                    <p className="text-[#666]">Adaptive practice questions for SAT Math.</p>
                 </div>
                 <div className="glass-3d p-12 group cursor-pointer" onClick={() => startQuiz(questions.filter(q => q.section === "Reading & Writing"))}>
                    <BookOpen className="w-10 h-10 mb-8 text-purple-400" />
                    <h3 className="text-3xl font-black mb-4">READING & WRITING</h3>
                    <p className="text-[#666]">Master the verbal section with comprehensive texts.</p>
                 </div>
              </div>
           </div>
        </div>
      </Layout>
    );
  }

  /* ── Quiz ───────────────────────────────────────────────────────── */
  if (phase === "quiz") {
    const q = questions[currentIdx];
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
          <div className="bg-vignette" />
          <div className="max-w-[1400px] mx-auto px-10 py-10 relative z-10 flex flex-col h-screen">
             <div className="flex items-center justify-between mb-10 shrink-0">
                <Button variant="ghost" onClick={exitQuiz} className="text-[10px] font-black uppercase tracking-widest text-[#444] hover:text-white"><ChevronLeft className="w-4 h-4 mr-2" /> Exit</Button>
                <div className="text-center">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{q.section}</p>
                   <p className="text-xl font-black">{currentIdx + 1} / {questions.length}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Time</p>
                   <p className="text-2xl font-black tabular-nums">{formatTime(elapsed)}</p>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="grid lg:grid-cols-2 gap-12 min-h-full">
                   <div className="glass-3d p-12 flex flex-col">
                      <div className="text-2xl font-medium leading-relaxed mb-12"><MathText text={q.question} /></div>
                      {q.image_url && <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center"><img src={q.image_url} className="max-h-[300px] invert hue-rotate-180" /></div>}
                   </div>
                   <div className="flex flex-col gap-6">
                      {!q.isFreeResponse ? (
                        ["A", "B", "C", "D"].map((label) => (
                          <button key={label} onClick={() => handleMCAnswer(label)} className={`glass-3d p-8 text-left transition-all ${answerState ? (label === q.correctAnswer ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : (answerState.selected === label ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'opacity-20')) : 'bg-white/5 hover:bg-white/10'}`}>
                            <div className="flex items-center gap-6">
                               <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 font-black">{label}</div>
                               <div className="text-lg font-medium"><MathText text={(q as any)[`option${label}`]} /></div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="glass-3d p-10">
                           <input type="text" className="w-full bg-transparent border-b-2 border-white/10 pb-4 text-4xl font-black focus:outline-none focus:border-white" placeholder="0" value={frInput} onChange={e => setFrInput(e.target.value)} disabled={!!answerState} />
                           {!answerState ? <Button onClick={handleFRAnswer} className="mt-12 bg-white text-black hover:bg-gray-200 w-full h-16 font-black uppercase text-xs rounded-xl">Submit</Button> : <div className={`mt-12 p-6 rounded-xl border font-black text-center ${answerState.correct ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'}`}>{answerState.correct ? 'CORRECT' : `EXPECTED: ${q.correctAnswer}`}</div>}
                        </div>
                      )}
                      {answerState && (
                        <div className="glass-3d p-10">
                           <div className="flex items-center gap-3 mb-6"><Sparkles className="w-4 h-4 text-indigo-400" /><h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Explanation</h4></div>
                           <MathText text={q.explanation} className="text-[#888] font-medium" />
                           <Button onClick={nextQuestion} className="mt-10 bg-indigo-600 hover:bg-indigo-700 text-white w-full h-16 font-black uppercase text-xs rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.3)]">Next <ChevronRight className="ml-2 w-4 h-4" /></Button>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </Layout>
    );
  }

  /* ── Results ────────────────────────────────────────────────────── */
  if (phase === "results") {
    const total = questions.length;
    const correct = Object.values(sessionAnswers).filter(a => a.correct).length;
    const pct = Math.round((correct / total) * 100);

    return (
      <Layout>
        <div className="min-h-screen bg-black text-white p-10">
           <div className="max-w-[1000px] mx-auto text-center py-20">
              <h1 className="text-8xl font-black text-shimmer mb-8">COMPLETE.</h1>
              <div className="glass-3d p-16 mb-12">
                 <div className="text-9xl font-black text-shimmer mb-4">{pct}%</div>
                 <p className="text-[#888] font-black tracking-widest uppercase mb-12">{correct} / {total} Correct</p>
                 <Button onClick={exitQuiz} className="bg-white text-black hover:bg-gray-200 rounded-xl px-12 h-16 font-black uppercase text-xs">Back to Bank</Button>
              </div>
           </div>
        </div>
      </Layout>
    );
  }

  return null;
}
