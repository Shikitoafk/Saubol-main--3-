// API utility for IELTS essay evaluation
// Calls the Vercel serverless function to securely evaluate essays

export interface GeminiScores {
  TR: number;
  CC: number;
  LR: number;
  GRA: number;
  overall: number;
  subScores?: {
    tr: Record<string, number>;
    cc: Record<string, number>;
    lr: Record<string, number>;
    gra: Record<string, number>;
  };
}

export interface GeminiFeedback {
  errorText: string;
  correction: string;
  explanation: string;
}

export interface GeminiResponse {
  scores: GeminiScores;
  feedback: {
    tr: string;
    cc: string;
    lr: string;
    gra: string;
    sentences: GeminiFeedback[];
  };
  rewrittenEssay: string;
  wordCount?: number;
  penaltyApplied?: string;
}

export async function evaluateEssayWithGemini(
  taskType: "task1" | "task2",
  prompt: string,
  essay: string
): Promise<GeminiResponse> {
  try {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskType,
        prompt,
        essay,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.statusText}`);
    }

    const raw = await response.json();
    
    // Safety check: Ensure raw has the expected structure
    if (!raw || !raw.tr || !raw.cc || !raw.lr || !raw.gra) {
      console.error('Invalid API response structure:', raw);
      throw new Error(raw.error || 'The AI response was incomplete. This usually happens during high server load. Please try again.');
    }
    
    return {
      scores: {
        TR: raw.tr.score,
        CC: raw.cc.score,
        LR: raw.lr.score,
        GRA: raw.gra.score,
        overall: raw.overallScore,
        subScores: {
          tr: raw.tr.subScores,
          cc: raw.cc.subScores,
          lr: raw.lr.subScores,
          gra: raw.gra.subScores
        }
      },
      feedback: {
        tr: raw.tr.feedback,
        cc: raw.cc.feedback,
        lr: raw.lr.feedback,
        gra: raw.gra.feedback,
        sentences: (raw.sentenceCorrections || []).map((c: any) => ({
          errorText: c.original,
          correction: c.correction,
          explanation: c.reason
        }))
      },
      rewrittenEssay: raw.rewrittenEssay || "Rewritten essay is being generated...",
      wordCount: raw.wordCount,
      penaltyApplied: raw.penaltyApplied
    };
  } catch (error) {
    console.error('Essay evaluation error:', error);
    throw error;
  }
}
