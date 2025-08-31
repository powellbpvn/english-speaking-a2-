// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing OpenAI API Key" });
    }

    const { topic, messages } = req.body;

    // Prompt khởi tạo hội thoại
    const systemPrompt = `You are an English teacher for A2 learners.
Lead a conversation with the student about the topic: ${topic}.
Ask one simple question first, wait for the student's reply, and continue step by step.
Keep questions short and easy.`;

    // Gửi request tới OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || []),
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res
        .status(response.status)
        .json({ error: data.error?.message || "OpenAI API Error" });
    }

    const reply = data.choices?.[0]?.message?.content || "No reply from model.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
