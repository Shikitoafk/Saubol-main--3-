export default async function handler(req, res) {
  const keys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY2].filter(Boolean);
  const results = {};

  for (let i = 0; i < keys.length; i++) {
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${keys[i]}`);
      const data = await resp.json();
      results[`Key_${i + 1}`] = data.models ? data.models.map(m => m.name.replace('models/', '')) : data;
    } catch (e) {
      results[`Key_${i + 1}`] = { error: e.message };
    }
  }

  res.status(200).json(results);
}
