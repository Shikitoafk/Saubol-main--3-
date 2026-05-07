// API utility for IELTS essay evaluation
// Calls the Vercel serverless function to securely evaluate essays

export interface GeminiScores {
  TR: number;
  CC: number;
  LR: number;
  GRA: number;
  overall: number;
}

export interface GeminiFeedback {
  errorText: string;
  correction: string;
  explanation: string;
}

export interface GeminiResponse {
  scores: GeminiScores;
  feedback: GeminiFeedback[];
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
    
    // Map the new strict structure back to the frontend format
    return {
      scores: {
        TR: raw.trScore,
        CC: raw.ccScore,
        LR: raw.lrScore,
        GRA: raw.graScore,
        overall: raw.overallScore
      },
      feedback: (raw.sentenceCorrections || []).map((c: any) => ({
        errorText: c.original,
        correction: c.correction,
        explanation: c.reason
      })),
      rewrittenEssay: raw.rewrittenEssay || "Rewritten essay is being generated...",
      wordCount: raw.wordCount,
      penaltyApplied: raw.penaltyApplied
    };
  } catch (error) {
    console.error('Essay evaluation error:', error);
    throw error;
  }
}
