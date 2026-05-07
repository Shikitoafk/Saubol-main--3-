// Vercel Serverless Function (Pure ESM JavaScript)
export default async function handler(req, res) {
  console.log("Evaluate API (JS) called. Method:", req.method);
  
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { taskType, prompt, essay } = req.body || {};
    if (!essay || !taskType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY missing");
      return res.status(500).json({ error: 'Server API key configuration error' });
    }

    const systemPrompt = `You are an expert, objective, and highly accurate IELTS Writing Examiner. Evaluate the user's essay based on the official IELTS Public Band Descriptors.

Your evaluation must be realistic. DO NOT be overly harsh. 
- For GRA Band 8: The majority of sentences must be error-free. 2-3 minor slips or occasional errors are perfectly acceptable for an 8.0. Do not drop the score to 6.0 just because of a few minor agreement or spelling mistakes if the overall structure is complex and accurate.
- For GRA Band 7: Good control of grammar, but may make a few errors. 
- For LR Band 8: Uses a wide vocabulary fluently with occasional inaccuracies in word choice. 

You will receive:
1. TASK_TYPE
2. TASK_PROMPT
3. USER_ESSAY

EVALUATION PROCESS:
Step 1: Analyze Task Achievement (Task 1) / Task Response (Task 2).
Step 2: Analyze Coherence and Cohesion.
Step 3: Analyze Lexical Resource.
Step 4: Analyze Grammatical Range and Accuracy.
Step 5: Identify the top 3 grammatical or lexical errors and correct them.

For each of the 4 main criteria, provide a comprehensive paragraph explaining the score, and evaluate specific sub-criteria on a scale of 1 to 9 (whole numbers only for sub-criteria).

OUTPUT FORMAT:
Ensure the LLM returns ONLY a valid JSON object matching this exact structure. Do not use markdown code blocks.
{
  "wordCount": 0,
  "penaltyApplied": "None",
  "tr": {
    "score": 0.0,
    "feedback": "Paragraph explaining the TR/TA score...",
    "subScores": {
      "relevanceToPrompt": 0,
      "clarityOfPosition": 0,
      "depthOfIdeas": 0,
      "appropriatenessOfFormat": 0,
      "relevantExamples": 0
    }
  },
  "cc": {
    "score": 0.0,
    "feedback": "Paragraph explaining the CC score...",
    "subScores": {
      "logicalOrganization": 0,
      "introAndConclusion": 0,
      "cohesiveDevices": 0,
      "paragraphing": 0
    }
  },
  "lr": {
    "score": 0.0,
    "feedback": "Paragraph explaining the LR score...",
    "subScores": {
      "vocabularyRange": 0,
      "lexicalAccuracy": 0,
      "spellingAndWordFormation": 0
    }
  },
  "gra": {
    "score": 0.0,
    "feedback": "Paragraph explaining the GRA score...",
    "subScores": {
      "sentenceStructureVariety": 0,
      "grammarAccuracy": 0,
      "punctuationUsage": 0
    }
  },
  "sentenceCorrections":[
    {
      "original": "string",
      "correction": "string",
      "reason": "string"
    }
  ]
}`;

    const userMessage = `TASK_TYPE: ${taskType}\nTASK_PROMPT: ${prompt || 'N/A'}\nUSER_ESSAY: ${essay}`;

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'user', parts: [{ text: userMessage }] }
          ],
          generationConfig: { 
            temperature: 0.1, 
            maxOutputTokens: 8192,
            response_mime_type: "application/json"
          }
        })
      }
    );

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      console.error("Gemini API Error details:", apiResponse.status, errorData);
      return res.status(apiResponse.status).json({ 
        error: 'Gemini API error', 
        status: apiResponse.status,
        details: errorData 
      });
    }

    const data = await apiResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) return res.status(500).json({ error: 'Empty AI response' });

    const result = JSON.parse(text);

    // TASK 4: Backend Math for Overall Score
    const calculateIeltsOverall = (tr, cc, lr, gra) => {
      const avg = (Number(tr) + Number(cc) + Number(lr) + Number(gra)) / 4;
      const decimal = avg % 1;
      const integer = Math.floor(avg);

      if (decimal === 0.25) return integer + 0.5;
      if (decimal === 0.75) return integer + 1.0;
      if ([0.125, 0.375, 0.625, 0.875].includes(decimal)) {
        return Math.floor(avg * 2) / 2; // Round DOWN to nearest 0.5
      }
      
      return Math.round(avg * 2) / 2;
    };

    result.overallScore = calculateIeltsOverall(
      result.tr.score, 
      result.cc.score, 
      result.lr.score, 
      result.gra.score
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("API Crash:", error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
