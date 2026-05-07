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
    console.log('API Raw Response:', raw);
    
    // Hard safety check with detailed logging
    if (!raw || typeof raw !== 'object') {
      throw new Error('AI returned an invalid response format.');
    }

    // Check for main criteria objects
    const required = ['tr', 'cc', 'lr', 'gra'];
    for (const key of required) {
      if (!raw[key] || typeof raw[key] !== 'object') {
        console.error(`Missing or invalid criteria object: ${key}`, raw);
        throw new Error(`The AI evaluation was incomplete (missing ${key.toUpperCase()}). Please try again.`);
      }
    }
    
    return {
      scores: {
        TR: raw.tr.score || 0,
        CC: raw.cc.score || 0,
        LR: raw.lr.score || 0,
        GRA: raw.gra.score || 0,
        overall: raw.overallScore || 0,
        subScores: {
          tr: raw.tr.subScores || {},
          cc: raw.cc.subScores || {},
          lr: raw.lr.subScores || {},
          gra: raw.gra.subScores || {}
        }
      },
      feedback: {
        tr: raw.tr.feedback || "No feedback provided.",
        cc: raw.cc.feedback || "No feedback provided.",
        lr: raw.lr.feedback || "No feedback provided.",
        gra: raw.gra.feedback || "No feedback provided.",
        sentences: (raw.sentenceCorrections || []).map((c: any) => ({
          errorText: c.original || "",
          correction: c.correction || "",
          explanation: c.reason || ""
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
