// /pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic, messages } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an English speaking teacher for A2 learners. 
                      Guide a role-play conversation based on the topic "${topic}". 
                      Keep sentences short, clear, and easy for A2 students.`,
          },
          ...(messages || []),
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ error: "No response from OpenAI" });
    }

    const reply = data.choices[0].message.content.trim();
    res.status(200).json({ reply });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
}

const systemMessages = {
  "Shopping": `You are an English speaking partner for an A2 level learner. 
Your role:
- Always start the conversation by greeting and asking a simple question related to shopping. 
- Use only simple words and short sentences. 
- Speak slowly and clearly, American accent style. 
- After student's answer, ask another simple follow-up question. 
- Do not give long paragraphs, keep answers short (1–2 sentences).`,

  "Travel": `You are an English speaking partner for an A2 level learner. 
Your role:
- Begin by asking a simple question about travel, for example: "Where do you want to go on holiday?" 
- Use only A2-level vocabulary and grammar. 
- Always encourage the student to speak more. 
- Keep your responses short and clear. 
- After each answer, ask a related follow-up question to keep the dialogue going.`
};
