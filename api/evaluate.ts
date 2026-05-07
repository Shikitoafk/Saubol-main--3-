// Vercel Serverless Function for IELTS Essay Evaluation
// Using vanilla JS style to avoid type-related invocation failures

export default async function handler(req, res) {
  console.log("Evaluate API called. Method:", req.method);
  
  try {
    // 1. Check Method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Check Body
    const { taskType, prompt, essay } = req.body || {};
    if (!essay || !taskType) {
      console.error("Missing fields:", { taskType, hasEssay: !!essay });
      return res.status(400).json({ error: 'Missing required fields: essay and taskType' });
    }

    // 3. Check API Key
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing in env!");
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
    }

    console.log("Calling Gemini API for task:", taskType);

    const systemPrompt = `You are a strict, professional IELTS examiner. Evaluate the following essay based on the official TR, CC, LR, and GRA rubrics. Return ONLY a valid JSON object with this exact structure:
{
  "scores": { "TR": 6.0, "CC": 6.5, "LR": 6.0, "GRA": 5.5, "overall": 6.0 },
  "feedback": [
    { "errorText": "volcanic calling", "correction": "strong calling", "explanation": "Unnatural collocation." }
  ],
  "rewrittenEssay": "The fully rewritten Band 9.0 version of the essay goes here..."
}

Task Type: ${taskType.toUpperCase()}
Prompt: ${prompt || 'N/A'}
Essay: ${essay}`;

    // 4. Call Gemini
    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Gemini API returned error:", apiResponse.status, errorText);
      return res.status(apiResponse.status).json({ 
        error: `Gemini API error: ${apiResponse.statusText}`,
        details: errorText
      });
    }

    const data = await apiResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("No text in Gemini response:", data);
      return res.status(500).json({ error: 'No response text from Gemini API' });
    }

    // 5. Parse JSON from AI
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;

    try {
      const parsedResponse = JSON.parse(jsonString);
      return res.status(200).json(parsedResponse);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw text:", text);
      return res.status(500).json({ 
        error: 'Failed to parse AI response as JSON',
        rawText: text
      });
    }

  } catch (error) {
    console.error("Critical API Error:", error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
}
