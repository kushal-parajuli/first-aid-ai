import { useState, useRef, useEffect } from "react";

const API_URL = "http://localhost:3000/api/first-aid";

const emergencyStyles = {
  Red: "bg-red-100 text-red-700 border-red-300",
  Yellow: "bg-amber-100 text-amber-700 border-amber-300",
  Green: "bg-emerald-100 text-emerald-700 border-emerald-300",
  Unknown: "bg-stone-100 text-stone-600 border-stone-300",
};

function generateSessionId() {
  return "session-" + Math.random().toString(36).slice(2, 11);
}

function EmergencyBadge({ level }) {
  if (!level) return null;
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        emergencyStyles[level] || emergencyStyles.Unknown
      }`}
    >
      {level} priority
    </span>
  );
}

function PulseMark() {
  return (
    <svg viewBox="0 0 120 24" className="h-5 w-auto text-teal-500">
      <polyline
        points="0,12 30,12 38,2 46,22 54,12 120,12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(generateSessionId);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, sessionId }),
      });
      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.answer, level: data.emergencyLevel },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.message || "Something went wrong.", error: true },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Couldn't reach the server. Is the backend running?", error: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-800 bg-stone-900 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <PulseMark />
          <div>
            <h1 className="text-lg font-semibold text-stone-50 tracking-tight">
              First Aid Assistant
            </h1>
            <p className="text-sm text-stone-400">Step-by-step guidance for emergencies</p>
          </div>
        </div>
        <div className="mt-3 bg-amber-950/40 border border-amber-700/60 rounded-lg px-3 py-2">
          <p className="text-sm font-medium text-amber-300">
            ⚠ Educational guidance only — not a substitute for professional medical care. In a life-threatening emergency, call your local emergency services immediately.
          </p>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="text-center text-stone-500 text-sm mt-16">
              Describe what happened — burns, cuts, choking, and more.
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-teal-700 text-white rounded-br-sm"
                    : msg.error
                    ? "bg-red-950/50 text-red-300 border border-red-800 rounded-bl-sm"
                    : "bg-stone-900 text-stone-100 border border-stone-800 rounded-bl-sm"
                }`}
              >
                {msg.role === "assistant" && msg.level && (
                  <div className="mb-2">
                    <EmergencyBadge level={msg.level} />
                  </div>
                )}
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-stone-900 border border-stone-800 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-stone-500">
                Thinking…
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="border-t border-stone-800 bg-stone-900 px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the situation…"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-stone-700 bg-stone-950 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-teal-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}