import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { topic, text } = req.body;

  const prompt = `You are a friendly English tutor. Speak slowly and simply at A2 level. Ask easy follow-up questions about ${topic}.
Student: ${text}
Tutor:`;

  try {
    const reply = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an English tutor for A2 learners. Keep sentences short and clear." },
          { role: "user", content: prompt }
        ],
        max_tokens: 100,
      }),
    }).then(r => r.json());

    res.json({ answer: reply.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "API request failed" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
