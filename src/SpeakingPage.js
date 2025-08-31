import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function SpeakingPage() {
  const location = useLocation();
  const topic = location.state?.topic || "General";
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");

  // Speech Recognition
  let recognition;
  if ("webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = async (e) => {
      const text = e.results[0][0].transcript;
      handleSend(text);
    };
  }

  const startListening = () => {
    if (recognition) {
      setListening(true);
      recognition.start();
    } else {
      alert("Speech recognition not supported. Please use text input.");
    }
  };

  // Send to backend
  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { role: "student", text }]);
    setInput("");

    const reply = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, text }),
    }).then(r => r.json());

    setMessages((prev) => [...prev, { role: "assistant", text: reply.answer }]);
    speak(reply.answer);
  };

  // Text-to-Speech
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";  // giọng Mỹ
    utter.rate = 0.9;      // chậm vừa
    speechSynthesis.speak(utter);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold">Topic: {topic}</h1>

      <div className="mt-4 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "student" ? "text-blue-600" : "text-green-600"}>
            <b>{m.role}:</b> {m.text}
          </div>
        ))}
      </div>

      <button
        onClick={startListening}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        {listening ? "Listening..." : "Start Speaking"}
      </button>

      <div className="mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type if mic not working..."
          className="border px-2 py-1 w-full rounded"
        />
        <button
          onClick={() => handleSend(input)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
