// IELTS Scoring Engine
// Uses Google Gemini API for comprehensive essay evaluation

import { evaluateEssayWithGemini, GeminiResponse, GeminiFeedback } from './gemini-api';

export interface ScoringResult {
  taskResponse: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  overallBand: number;
  feedback: GeminiFeedback[];
  detailedFeedback: {
    tr: string;
    cc: string;
    lr: string;
    gra: string;
  };
  subScores?: {
    tr: Record<string, number>;
    cc: Record<string, number>;
    lr: Record<string, number>;
    gra: Record<string, number>;
  };
  rewrittenEssay: string;
  wordCount?: number;
  penaltyApplied?: string;
}

export class IELTSScoringEngine {
  private taskType: "task1" | "task2";
  private prompt: string;
  private essay: string;
  private imageBase64?: string;

  constructor(taskType: "task1" | "task2", prompt: string, essay: string, imageBase64?: string) {
    this.taskType = taskType;
    this.prompt = prompt;
    this.essay = essay;
    this.imageBase64 = imageBase64;
  }

  async score(): Promise<ScoringResult> {
    const geminiResponse = await evaluateEssayWithGemini(
      this.taskType, 
      this.prompt, 
      this.essay, 
      this.imageBase64
    );

    return {
      taskResponse: geminiResponse.scores.TR,
      coherenceCohesion: geminiResponse.scores.CC,
      lexicalResource: geminiResponse.scores.LR,
      grammaticalRange: geminiResponse.scores.GRA,
      overallBand: geminiResponse.scores.overall,
      feedback: geminiResponse.feedback.sentences,
      detailedFeedback: {
        tr: geminiResponse.feedback.tr,
        cc: geminiResponse.feedback.cc,
        lr: geminiResponse.feedback.lr,
        gra: geminiResponse.feedback.gra,
      },
      subScores: geminiResponse.scores.subScores,
      rewrittenEssay: geminiResponse.rewrittenEssay,
      wordCount: geminiResponse.wordCount,
      penaltyApplied: geminiResponse.penaltyApplied,
    };
  }
}

export default IELTSScoringEngine;
