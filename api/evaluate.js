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

    const systemPrompt = `You are an uncompromising, highly strict IELTS Writing Examiner. Your role is to evaluate IELTS essays submitted by users. You must grade strictly according to the official IELTS Writing Key Assessment Criteria without any leniency.

You will receive:
1. TASK_TYPE:[Task 1 Academic / Task 1 General / Task 2]
2. TASK_PROMPT: The specific question/graph/letter the user is answering.
3. USER_ESSAY: The text written by the user.

EVALUATION PROCESS:
1. Penalty & Format Check: Word count (150 for Task 1, 250 for Task 2). Penalize bullet points or memorized text.
2. Task Achievement / Task Response: Check if all parts of the prompt are fully addressed and developed.
3. Coherence and Cohesion: Evaluate paragraphing, logical progression, and natural use of linking words.
4. Lexical Resource: Look for unnatural word choices. If a student uses "big words" incorrectly, DO NOT give them more than a 6.0 for LR.
5. Grammatical Range and Accuracy: Check sentence complexity and punctuation.

OUTPUT FORMAT:
You MUST output your response ONLY as a valid JSON object with the following structure. Do NOT wrap it in markdown code blocks, just raw JSON:
{
  "wordCount": 0,
  "penaltyApplied": "None",
  "trScore": 0.0,
  "trFeedback": "string",
  "ccScore": 0.0,
  "ccFeedback": "string",
  "lrScore": 0.0,
  "lrFeedback": "string",
  "graScore": 0.0,
  "graFeedback": "string",
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
      
      // Standard rounding for other cases (though usually IELTS only has .25 increments)
      return Math.round(avg * 2) / 2;
    };

    result.overallScore = calculateIeltsOverall(
      result.trScore, 
      result.ccScore, 
      result.lrScore, 
      result.graScore
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("API Crash:", error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
