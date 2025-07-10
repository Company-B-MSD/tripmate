import { useState, useRef, useEffect } from "react";
const BOT_AVATAR = "🌴";

const SriLankaChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "system", // 'system' is for the initial greeting
      content:
        "Hi! I'm your Sri Lanka Travel Assistant 🇱🇰. Ask me anything about destinations, tips, or planning your trip!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen((v) => !v);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Get the last 7 messages (user and assistant) to build context
      const contextMessages = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-7);

      // Build Gemini-style chat history for the API
      const chatHistory = [
        ...contextMessages.map((m) => ({
          role: m.role === "user" ? "user" : "model", // Map 'assistant' to 'model'
          parts: [{ text: m.content }],
        })),
        { role: "user", parts: [{ text: input }] },
      ];

      const body = {
        contents: chatHistory,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      };

      // IMPORTANT: API Key should be in a .env file, not hardcoded
      const apiKey = "AIzaSyDBzJBoLEs9CWcyFdFCm9EPl1uX8jdaBk0";
      if (!apiKey) {
        throw new Error("VITE_GEMINI_API_KEY is not set in .env file.");
      }

      const geminiUrl =
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const resp = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        console.error("Gemini API Error:", errorData);
        throw new Error(errorData.error?.message || "API request failed");
      }

      const data = await resp.json();
      // Correctly parse the text from the API response
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't get a travel tip right now. Please try again.";

      // Use 'assistant' role for bot replies to distinguish from the initial system message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant", // Use 'assistant' for error messages too
          content:
            "Sorry, I couldn't reply due to an error. Please check the console or try again.",
        },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 1000,
      fontFamily: "inherit",
    }}>
      <button
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        style={{
          height: 56,
          width: 56,
          borderRadius: "50%",
          background: isOpen ? "#f87171" : "#2563eb",
          color: "#fff",
          fontSize: 24,
          border: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,.15)",
          cursor: "pointer",
        }}
      >
        {isOpen ? "✖️" : "💬"}
      </button>

      {isOpen && (
        <div style={{
          position: "absolute",
          bottom: 70,
          right: 0,
          width: 340,
          maxWidth: "90vw",
          height: 410,
          background:
            "linear-gradient(135deg,#1e293b 0%,#2563eb 100%)",
          borderRadius: 18,
          boxShadow: "0 6px 24px rgba(0,0,0,.18)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #2563eb",
        }}>
          <div style={{
            background: "rgba(37,99,235,0.93)",
            color: "#fff",
            padding: "13px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: 0.2,
          }}>
            <span>
              <span role="img" aria-label="bot" style={{ marginRight: 8 }}>
                {BOT_AVATAR}
              </span>
              Sri Lanka Travel Bot
            </span>
            <button
              onClick={toggleChat}
              aria-label="Close"
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ✖️
            </button>
          </div>
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: 15,
            background: "#e0e7ef",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 10,
                }}
              >
                {/* Show avatar for system and assistant messages */}
                {(msg.role === "system" || msg.role === "assistant") && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      marginRight: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 20,
                        background:
                          "linear-gradient(135deg,#2563eb 40%,#fbbf24 80%)",
                        borderRadius: "50%",
                        padding: "2px 7px",
                        marginRight: 2,
                      }}
                    >
                      {BOT_AVATAR}
                    </span>
                  </span>
                )}
                <span
                  style={{
                    background:
                      msg.role === "user"
                        ? "#2563eb"
                        : "linear-gradient(90deg,#f1f5f9,#fbbf24 130%)",
                    color:
                      msg.role === "user"
                        ? "#fff"
                        : "#111",
                    padding: "10px 16px",
                    borderRadius: 16,
                    maxWidth: "78%",
                    fontSize: 15.5,
                    wordBreak: "break-word",
                    lineHeight: 1.6,
                    textAlign:
                      msg.role === "user" ? "right" : "left",
                    boxShadow:
                      (msg.role === "system" || msg.role === "assistant")
                        ? "0 2px 12px rgba(251,191,36,.08)"
                        : "none",
                  }}
                >
                  {msg.content}
                </span>
              </div>
            ))}
            {isLoading && (
              <div style={{
                display: "flex",
                justifyContent: "flex-start",
              }}>
                <span style={{
                  background: "linear-gradient(90deg,#f1f5f9,#fbbf24 130%)",
                  color: "#222",
                  padding: "10px 16px",
                  borderRadius: 16,
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                }}>
                  <span role="img" aria-label="thinking" style={{ marginRight: 7 }}>
                    🤔
                  </span>
                  Typing...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSendMessage}
            style={{
              display: "flex",
              borderTop: "1px solid #dbeafe",
              padding: 9,
              gap: 8,
              background: "#2563eb",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Sri Lanka travel..."
              disabled={isLoading}
              style={{
                flex: 1,
                border: "none",
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: 15.5,
                outline: "none",
                background: "#fff",
                color: "#000",
              }}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                background: "#fbbf24",
                color: "#222",
                border: "none",
                borderRadius: 8,
                padding: "0 17px",
                fontSize: 16,
                fontWeight: 500,
                cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                boxShadow:
                  "0 2px 8px rgba(251,191,36,.13)",
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SriLankaChatBot;