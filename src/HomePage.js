import { useNavigate } from "react-router-dom";

const topics = [
  "Shopping", "Travel", "Job Interview", "Restaurant",
  "Daily Routine", "Family & Friends", "Weather",
  "Health", "School", "Hobbies", "Transportation", "Technology"
];

export default function HomePage() {
  const navigate = useNavigate();

  const handleMicRequest = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => navigate("/speak"))
      .catch(() => alert("Please allow microphone access to continue"));
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Choose a topic to practice</h1>
      <button
        onClick={handleMicRequest}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Enable Microphone & Continue
      </button>
      <ul className="mt-4 space-y-2">
        {topics.map((t) => (
          <li key={t}
              onClick={() => navigate("/speak", { state: { topic: t } })}
              className="cursor-pointer p-2 bg-gray-200 rounded">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
