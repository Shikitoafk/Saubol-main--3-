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

    const systemPrompt = `You are an expert IELTS examiner with 15+ years of experience. Evaluate the following essay strictly according to official IELTS band descriptors.

SCORING CRITERIA:
- Task Response (TR): Does the essay fully address all parts of the task? Is the position clear and well-developed?
- Coherence & Cohesion (CC): Is the essay logically organized? Are cohesive devices used effectively?
- Lexical Resource (LR): Is vocabulary varied, precise and sophisticated? Are there errors?
- Grammatical Range & Accuracy (GRA): Is there a wide range of structures used accurately?

BAND DESCRIPTORS (be precise):
- Band 9: Expert user, fully operational
- Band 8: Very good, occasional inaccuracies
- Band 7: Good user, some inaccuracies
- Band 6: Competent, noticeable errors
- Band 5: Modest, frequent errors

IMPORTANT: Do not underestimate. If the essay demonstrates band 8 qualities, score it band 8. Be fair and accurate.

Return ONLY valid JSON, no markdown:
{
  "scores": { "TR": 0.0, "CC": 0.0, "LR": 0.0, "GRA": 0.0, "overall": 0.0 },
  "feedback": [{ "errorText": "...", "correction": "...", "explanation": "..." }],
  "rewrittenEssay": "..."
}

Task: ${taskType}
Prompt: ${prompt || 'N/A'}
Essay: ${essay}`;

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
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

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonString);

    // Manual calculation of overall score to ensure accuracy
    if (result.scores) {
      const { TR, CC, LR, GRA } = result.scores;
      const calculated = (Number(TR) + Number(CC) + Number(LR) + Number(GRA)) / 4;
      // Round to the nearest 0.5 (IELTS rule)
      result.scores.overall = Math.round(calculated * 2) / 2;
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error("API Crash:", error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
