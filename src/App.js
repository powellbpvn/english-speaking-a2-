import React, { useState } from "react";

const topics = [
  "Shopping",
  "Travel",
  "Food",
  "Daily Routine",
  "School",
  "Family",
  "Friends",
  "Hobbies",
  "Weather",
  "Work",
  "Health",
  "Holidays",
];

function App() {
  const [topic, setTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);

  // Text to Speech
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // giọng Mỹ
    utterance.rate = 0.85; // tốc độ chậm vừa
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  // Khi chọn chủ đề
  const handleSelectTopic = async (selectedTopic) => {
    setTopic(selectedTopic);
    setMessages([]);

    // Gọi GPT để lấy câu mở đầu
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: selectedTopic,
        messages: [],
      }),
    });
    const data = await res.json();

    setMessages([{ role: "assistant", content: data.reply }]);
    speakText(data.reply);
  };

  // Khi học sinh nói (speech-to-text → transcript)
  const handleUserSpeech = async (transcript) => {
    const newMessages = [...messages, { role: "user", content: transcript }];
    setMessages(newMessages);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        messages: newMessages,
      }),
    });

    const data = await res.json();
    const reply = { role: "assistant", content: data.reply };

    setMessages([...newMessages, reply]);
    speakText(data.reply);
  };

  // Xử lý micro
  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Trình duyệt không hỗ trợ Speech Recognition");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleUserSpeech(transcript);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {!topic ? (
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => handleSelectTopic(t)}
              className="bg-blue-500 text-white p-4 rounded-2xl shadow hover:bg-blue-600"
            >
              {t}
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow p-4 h-96 overflow-y-auto mb-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 ${
                  m.role === "assistant" ? "text-blue-600" : "text-gray-800"
                }`}
              >
                <b>{m.role === "assistant" ? "GPT:" : "You:"}</b> {m.content}
              </div>
            ))}
          </div>
          <button
            onClick={handleMicClick}
            className={`w-full p-4 rounded-2xl shadow text-white ${
              listening ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {listening ? "Listening..." : "🎤 Speak"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
