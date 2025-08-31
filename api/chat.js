export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, topic } = req.body;

  const systemMessages = {
    "Shopping": "You are an English speaking partner. Topic: Shopping. ...",
    "Travel": "You are an English speaking partner. Topic: Travel. ...",
    // ... các prompt khác như đã trao đổi (A2 level)
  };

  const systemPrompt = systemMessages[topic] || "You are an English speaking partner. Use A2 English.";

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: systemPrompt }, ...(messages || []) ],
      })
    });
    const data = await openaiRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
