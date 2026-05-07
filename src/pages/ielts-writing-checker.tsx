import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { 
  Brain, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Code, 
  Download, 
  Image as ImageIcon, 
  X,
  Sparkles,
  Zap
} from "lucide-react";
import IELTSScoringEngine, { ScoringResult } from "@/lib/ielts-scoring-engine";
import { supabase } from "@/lib/supabase";

type TaskType = "task1" | "task2";

const IELTSSWritingChecker = () => {
  const nav = useNavigate();
  const [taskType, setTaskType] = useState<TaskType>("task2");
  const [prompt, setPrompt] = useState("");
  const [essay, setEssay] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [taskImage, setTaskImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!essay.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const engine = new IELTSScoringEngine(taskType, prompt, essay, taskImage || undefined);
      const scoringResult = await engine.score();

      setResult({
        bandScore: scoringResult.overallBand,
        taskResponse: scoringResult.taskResponse,
        coherenceCohesion: scoringResult.coherenceCohesion,
        lexicalResource: scoringResult.lexicalResource,
        grammaticalRange: scoringResult.grammaticalRange,
        detailedFeedback: scoringResult.detailedFeedback,
        subScores: scoringResult.subScores,
        grammarErrors: scoringResult.feedback,
        rewrittenEssay: scoringResult.rewrittenEssay,
        wordCount: scoringResult.wordCount,
        penaltyApplied: scoringResult.penaltyApplied
      });

      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("ielts_progress").insert({
          user_id: user.id,
          test_name: `Writing (${taskType === "task1" ? "Task 1" : "Task 2"})`,
          skill: "writing",
          score: Math.round(scoringResult.overallBand * 10),
          total: 90,
        });
      }
    } catch (error) {
      console.error('Scoring error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTaskImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#000000] text-white selection:bg-white/10 relative overflow-hidden font-sans">
        {/* Depth Background */}
        <div className="bg-vignette" />
        <div className="bg-sphere top-[-10%] right-[-5%] opacity-30" style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)' }} />
        
        <div className="max-w-[1400px] mx-auto px-10 py-20 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-12 opacity-40">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => nav("/ielts")} className="cursor-pointer font-black uppercase tracking-widest text-[10px]">IELTS</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-black uppercase tracking-widest text-[10px] text-white">Writing Checker</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Header */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6 opacity-60">
              <Brain className="w-5 h-5 text-indigo-400" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-indigo-400">AI Scoring Engine v2.5</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-shimmer leading-[0.85] mb-8">
              WRITING <br /> CHECKER.
            </h1>
            <p className="text-xl text-[#666] font-medium max-w-2xl leading-relaxed">
              Мгновенный разбор твоего эссе с помощью Gemini AI. Оценка по критериям IELTS, исправление ошибок и Band 9.0 версия твоего текста.
            </p>
          </div>

          {/* Task Type Toggle - 3D Style */}
          <div className="mb-12 flex gap-4">
            {[
              { id: 'task1', label: 'Task 1 (Report)' },
              { id: 'task2', label: 'Task 2 (Essay)' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setTaskType(type.id as TaskType)}
                className={`px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border ${
                  taskType === type.id 
                  ? "bg-white text-black border-white shadow-[0_10px_20px_rgba(255,255,255,0.1)]" 
                  : "bg-white/5 text-[#444] border-white/5 hover:border-white/20"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Input Grid */}
          <div className="grid gap-10 lg:grid-cols-2 mb-16">
            {/* Prompt Panel */}
            <div className="glass-3d p-10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-widest text-[#444]">Question / Prompt</label>
                {taskType === 'task1' && (
                  <label className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest">
                    <ImageIcon className="w-3 h-3" />
                    {taskImage ? 'Replace Image' : 'Upload Image'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              <textarea
                placeholder="Paste the writing prompt here..."
                className="w-full h-48 bg-transparent border-none resize-none focus:outline-none font-medium text-lg text-white/80 placeholder:text-[#222]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              {taskImage && (
                <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-white/10 group">
                  <img src={taskImage} className="w-full h-full object-cover" />
                  <button onClick={() => setTaskImage(null)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Essay Panel */}
            <div className="glass-3d p-10 flex flex-col gap-6 border-indigo-500/20 shadow-[0_20px_40px_rgba(99,102,241,0.05)]">
              <label className="text-xs font-black uppercase tracking-widest text-[#444]">Your Writing</label>
              <textarea
                placeholder="Start typing or paste your essay here..."
                className="w-full h-48 bg-transparent border-none resize-none focus:outline-none font-medium text-lg text-white/80 placeholder:text-[#222]"
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
              />
              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <span className="text-[10px] font-black text-[#333] uppercase tracking-widest">{essay.trim().split(/\s+/).filter(x => x).length} Words</span>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !essay.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 font-black tracking-widest uppercase text-xs h-12 shadow-[0_10px_20px_rgba(79,70,229,0.3)]"
                >
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze Essay"}
                </Button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          {result && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              {/* Main Score Banner */}
              <div className="glass-3d p-16 flex flex-col md:flex-row items-center justify-between gap-12 bg-white/5 border-white/20">
                 <div className="flex items-center gap-10">
                    <div className="text-9xl font-black text-shimmer leading-none">{result.bandScore}</div>
                    <div>
                      <h3 className="text-4xl font-black tracking-tight mb-2">OVERALL BAND</h3>
                      <p className="text-xs font-black text-[#444] uppercase tracking-[0.3em]">Official Scoring Estimation</p>
                    </div>
                 </div>
                 <Button className="bg-white text-black hover:bg-gray-200 rounded-xl px-10 h-16 font-black tracking-widest uppercase text-xs">
                    <Download className="w-4 h-4 mr-2" /> Download Report
                 </Button>
              </div>

              {/* Criteria Grid */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Task Response", score: result.taskResponse, icon: FileText, color: "text-blue-400" },
                  { label: "Coherence", score: result.coherenceCohesion, icon: MessageSquare, color: "text-emerald-400" },
                  { label: "Vocabulary", score: result.lexicalResource, icon: BookOpen, color: "text-purple-400" },
                  { label: "Grammar", score: result.grammaticalRange, icon: Code, color: "text-amber-400" }
                ].map((item, i) => (
                  <div key={i} className="glass-3d p-10 hover:scale-105 transition-all">
                    <item.icon className={`w-6 h-6 mb-8 ${item.color}`} />
                    <div className="text-4xl font-black mb-1">{item.score}</div>
                    <span className="text-[10px] font-black text-[#333] uppercase tracking-widest">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Feedback Panels */}
              <div className="grid gap-10 lg:grid-cols-2">
                 <div className="glass-3d p-12">
                    <h4 className="text-2xl font-black mb-10 flex items-center gap-4">
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                      EXAMINER FEEDBACK
                    </h4>
                    <div className="space-y-8">
                       {Object.entries(result.detailedFeedback).map(([key, val]: any, i) => (
                         <div key={i} className="flex gap-6 items-start">
                            <span className="text-xs font-black text-[#222] uppercase pt-1">{key}</span>
                            <p className="text-[#888] leading-relaxed font-medium">{val}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="glass-3d p-12 border-indigo-500/10">
                    <h4 className="text-2xl font-black mb-10 flex items-center gap-4">
                      <Zap className="w-6 h-6 text-indigo-400" />
                      REWRITTEN VERSION
                    </h4>
                    <p className="text-[#888] leading-relaxed font-medium italic text-lg mb-8">
                      {result.rewrittenEssay}
                    </p>
                    <div className="p-6 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#444]">Band 9.0 Optimized</span>
                       <Button variant="ghost" className="text-[10px] font-black uppercase text-white">Copy Text</Button>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default IELTSSWritingChecker;
