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
import { Brain, Loader2, CheckCircle2, AlertCircle, ChevronLeft, BookOpen, FileText, MessageSquare, Code, Download, Image as ImageIcon, X } from "lucide-react";
import IELTSScoringEngine, { ScoringResult } from "@/lib/ielts-scoring-engine";
import { supabase } from "@/lib/supabase";

type TaskType = "task1" | "task2";

const IELTSSWritingChecker = () => {
  const nav = useNavigate();
  const [taskType, setTaskType] = useState<TaskType>("task1");
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
      // Initialize scoring engine with Gemini API
      const engine = new IELTSScoringEngine(taskType, prompt, essay, taskImage || undefined);
      
      // Use Gemini API for comprehensive evaluation
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
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error: saveError } = await supabase.from("ielts_progress").insert({
            user_id: user.id,
            test_name: `Writing Checker (${taskType === "task1" ? "Task 1" : "Task 2"})`,
            skill: "writing",
            score: Math.round(scoringResult.overallBand * 10), // Save 6.5 as 65 to handle integer column
            total: 90, // Out of 9.0 (saved as 90)
          });
          
          if (saveError) {
            console.error('Error saving progress to Supabase:', saveError);
          } else {
            console.log('Progress saved successfully');
          }
        }
      } catch (saveErr) {
        console.error('Failed to save progress:', saveErr);
      }
    } catch (error) {
      console.error('Scoring error:', error);
      alert('Error analyzing essay. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Image is too large. Please use a file smaller than 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTaskImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    
    try {
      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("Saubol IELTS Assessment Report", 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 28);
      
      // Main Score
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text(`Overall Band Score: ${result.bandScore}`, 20, 45);
      doc.setFontSize(10);
      doc.text(`Word Count: ${result.wordCount || 'N/A'}`, 20, 52);
      
      // Scores Table
      (doc as any).autoTable({
        startY: 60,
        head: [['Criterion', 'Score']],
        body: [
          ['Task Response', result.taskResponse],
          ['Coherence & Cohesion', result.coherenceCohesion],
          ['Lexical Resource', result.lexicalResource],
          ['Grammatical Range', result.grammaticalRange],
        ],
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] } // blue-500
      });
      
      let currentY = (doc as any).lastAutoTable.finalY + 15;
      
      // Feedback Sections
      const criteria = [
        { label: "Task Response", feedback: result.detailedFeedback.tr },
        { label: "Coherence & Cohesion", feedback: result.detailedFeedback.cc },
        { label: "Lexical Resource", feedback: result.detailedFeedback.lr },
        { label: "Grammatical Range", feedback: result.detailedFeedback.gra }
      ];
      
      criteria.forEach(item => {
        if (currentY > 250) { doc.addPage(); currentY = 20; }
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(item.label, 20, currentY);
        currentY += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(item.feedback, 170);
        doc.text(splitText, 20, currentY);
        currentY += (splitText.length * 5) + 10;
      });

      // Original Essay
      if (currentY > 230) { doc.addPage(); currentY = 20; }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Original Essay", 20, currentY);
      currentY += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const splitEssay = doc.splitTextToSize(essay, 170);
      doc.text(splitEssay, 20, currentY);
      
      doc.save(`IELTS_Report_Saubol_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Could not generate PDF. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => nav("/ielts")} className="cursor-pointer">
                IELTS
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Writing Checker</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">IELTS Writing Checker</h1>
          <p className="text-muted-foreground">
            Get AI-powered feedback on your IELTS writing with band score estimation, grammar correction, and rewriting suggestions.
          </p>
        </div>

        {/* Task Type Toggle */}
        <div className="mb-6">
          <div className="inline-flex rounded-lg border p-1 bg-muted">
            <button
              onClick={() => setTaskType("task1")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                taskType === "task1"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Task 1 (Report/Letter)
            </button>
            <button
              onClick={() => setTaskType("task2")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                taskType === "task2"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Task 2 (Essay)
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Question/Prompt</label>
            <textarea
              placeholder={taskType === "task1" 
                ? "Paste the Task 1 prompt here (e.g., describe a chart, diagram, or write a letter)..."
                : "Paste the Task 2 essay prompt here..."
              }
              className="w-full h-32 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            {taskType === "task1" && (
              <div className="mt-2">
                {!taskImage ? (
                  <label className="flex items-center gap-2 px-3 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors text-xs font-medium text-muted-foreground">
                    <ImageIcon className="h-3 w-3" />
                    Upload Task Photo (Graph/Chart)
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                ) : (
                  <div className="relative inline-block">
                    <img src={taskImage} alt="Task" className="h-20 w-32 object-cover rounded border" />
                    <button 
                      onClick={() => setTaskImage(null)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Essay Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Essay</label>
            <textarea
              placeholder="Paste your IELTS writing here..."
              className="w-full h-32 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
            />
          </div>
        </div>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !essay.trim()}
          className="mb-8"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Analyze Essay
            </>
          )}
        </Button>

        {/* Results Dashboard */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Band Score Card */}
            <div className="bg-card rounded-lg border p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Estimated Band Score
                </h3>
                {result.wordCount && (
                  <div className="text-sm px-3 py-1 bg-muted rounded-full font-medium">
                    {result.wordCount} words
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-primary">{result.bandScore}</div>
                  <div className="text-muted-foreground">out of 9.0</div>
                </div>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  Download PDF Report
                </button>
              </div>
              {result.penaltyApplied && result.penaltyApplied !== "None" && (
                <div className="mt-3 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-100 flex items-center gap-2">
                  <AlertCircle className="h-3 w-3" />
                  Penalty Applied: {result.penaltyApplied}
                </div>
              )}
            </div>

            {/* 4 Criteria Scores with Detailed Feedback */}
            <div className="grid gap-6">
              {[
                { 
                  id: 'tr',
                  label: "Task Response", 
                  score: result.taskResponse, 
                  icon: <FileText className="h-4 w-4 text-blue-500" />,
                  feedback: result.detailedFeedback.tr,
                  subs: result.subScores?.tr
                },
                { 
                  id: 'cc',
                  label: "Coherence & Cohesion", 
                  score: result.coherenceCohesion, 
                  icon: <MessageSquare className="h-4 w-4 text-green-500" />,
                  feedback: result.detailedFeedback.cc,
                  subs: result.subScores?.cc
                },
                { 
                  id: 'lr',
                  label: "Lexical Resource", 
                  score: result.lexicalResource, 
                  icon: <BookOpen className="h-4 w-4 text-purple-500" />,
                  feedback: result.detailedFeedback.lr,
                  subs: result.subScores?.lr
                },
                { 
                  id: 'gra',
                  label: "Grammatical Range", 
                  score: result.grammaticalRange, 
                  icon: <Code className="h-4 w-4 text-amber-500" />,
                  feedback: result.detailedFeedback.gra,
                  subs: result.subScores?.gra
                }
              ].map((item) => (
                <div key={item.id} className="bg-card rounded-lg border overflow-hidden">
                  <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    <div className="text-xl font-bold text-primary">{item.score}</div>
                  </div>
                  <div className="p-4 grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Examiner Feedback</h4>
                      <p className="text-sm leading-relaxed">{item.feedback}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Sub-criteria</h4>
                      <div className="space-y-2">
                        {item.subs && Object.entries(item.subs).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <span className="font-bold">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Grammar & Vocabulary Feedback */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Grammar & Vocabulary Feedback
              </h3>
              <div className="space-y-3">
                {result.grammarErrors && result.grammarErrors.length > 0 ? (
                  result.grammarErrors.map((error: any, index: number) => (
                    <div key={index} className="flex flex-col gap-2 p-4 bg-muted rounded-md">
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 font-medium line-through bg-white px-2 py-1 rounded">{error.errorText}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-green-600 font-medium bg-white px-2 py-1 rounded">{error.correction}</span>
                      </div>
                      {error.explanation && (
                        <div className="text-xs text-muted-foreground mt-1">{error.explanation}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No major issues detected. Great job!</p>
                )}
              </div>
              {result.grammarErrors && result.grammarErrors.length > 0 && (
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  {result.grammarErrors.length} issue(s) found by AI
                </div>
              )}
            </div>

            {/* AI Rewritten Version */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                AI Rewritten Version (Band 8.0/9.0)
              </h3>
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm leading-relaxed">{result.rewrittenEssay}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-xs text-muted-foreground text-center">
          Powered by Google Gemini AI — comprehensive IELTS evaluation
        </div>
      </div>
    </Layout>
  );
};

export default IELTSSWritingChecker;
