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

    const systemPrompt = `You are a strict IELTS examiner. Evaluate this essay. Return ONLY JSON:
{
  "scores": { "TR": 6.0, "CC": 6.5, "LR": 6.0, "GRA": 5.5, "overall": 6.0 },
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
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;

    return res.status(200).json(JSON.parse(jsonString));

  } catch (error) {
    console.error("API Crash:", error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
