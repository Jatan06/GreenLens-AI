import React, { useState } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  MessageSquare, 
  User, 
  Lightbulb, 
  RotateCcw
} from "lucide-react";
import { MOCK_BOT_QA } from "../data/wasteData";

export default function WasteBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I am WasteBot, your recycling and sustainability assistant. Ask me how to dispose of tricky items or check local sorting rules.",
      time: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    "How to dispose of Lithium batteries?",
    "Can greasy pizza boxes be recycled?",
    "What items belong in the Blue Bin?",
    "How do I recycle green wine glass bottles?"
  ];

  const handleSend = (textToSend = inputText) => {
    const query = textToSend.trim();
    if (!query) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Generate intelligent Bot response
    setTimeout(() => {
      let botAnswer = "Great question! Generally, dry un-contaminated recyclable plastics and metals belong in the Blue Bin, paper in Yellow, organic food waste in Green compost, and electronics at designated Red E-Waste stations.";

      const lower = query.toLowerCase();
      const match = MOCK_BOT_QA.find((item) =>
        item.keywords.some((kw) => lower.includes(kw))
      );

      if (match) {
        botAnswer = match.answer;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: botAnswer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="animate-fade-in" style={{ padding: "0 16px 32px 16px" }}>
      {/* Top Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(16, 185, 129, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Bot size={20} color="#10b981" />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>
            WasteBot assistant
          </h2>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Instant recycling guidance, disposal rules, and material sorting tips.
        </p>
      </div>

      <div className="glass-card" style={{
        padding: "24px",
        maxWidth: "840px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        height: "580px"
      }}>
        {/* Quick Suggestion Chips */}
        <div style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "12px",
          marginBottom: "16px",
          borderBottom: "1px solid var(--border-color)"
        }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
            <Lightbulb size={14} color="#f59e0b" /> Ask:
          </span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              style={{
                padding: "6px 12px",
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-main)",
                color: "var(--text-secondary)",
                fontSize: "0.78rem",
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease"
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          paddingRight: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignSelf: isBot ? "flex-start" : "flex-end",
                  maxWidth: "80%"
                }}
              >
                {isBot && (
                  <div style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Bot size={18} color="#ffffff" />
                  </div>
                )}

                <div>
                  <div style={{
                    padding: "12px 18px",
                    borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                    background: isBot ? "var(--bg-main)" : "var(--accent)",
                    color: isBot ? "var(--text-primary)" : "#ffffff",
                    border: isBot ? "1px solid var(--border-color)" : "none",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                  }}>
                    {msg.text}
                  </div>
                  <div style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    marginTop: "4px",
                    textAlign: isBot ? "left" : "right"
                  }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "#10b981", fontSize: "0.85rem", fontWeight: 600 }}>
              <Bot size={18} /> WasteBot is searching guidelines...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid var(--border-color)"
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your waste sorting question (e.g. Can I recycle aluminum foil?)..."
            style={{
              flex: 1,
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-main)",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              outline: "none"
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: "12px 20px" }}
          >
            <Send size={18} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
