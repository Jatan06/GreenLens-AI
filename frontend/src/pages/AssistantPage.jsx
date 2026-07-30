import React, { useState } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  MessageSquare, 
  User, 
  Lightbulb, 
  RotateCcw,
  Mic
} from "lucide-react";
import { askWasteAssistant } from "../api/client";

export default function AssistantPage() {
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

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((prev) => [...prev, { id: Date.now(), sender: "bot", text: "Voice input is not supported by this browser. Please type your question.", time: "Just now" }]);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (event) => setInputText(event.results[0][0].transcript);
    recognition.start();
  };

  const samplePrompts = [
    "How to dispose of Lithium batteries?",
    "Can greasy pizza boxes be recycled?",
    "What items belong in the Blue Bin?",
    "How do I recycle green wine glass bottles?"
  ];

  const handleSend = async (textToSend = inputText) => {
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

    try {
      const response = await askWasteAssistant(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: response.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1, sender: "bot",
        text: "I could not reach the waste guidance service. Please try again in a moment.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="page page-enter" style={{ paddingBottom: "7rem", maxWidth: "600px" }}>
      {/* Top Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--green-glass)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--border)"
          }}>
            <Bot size={20} color="var(--green-primary)" />
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>
            WasteBot Assistant
          </h2>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.825rem" }}>
          Instant recycling guidance, disposal rules, and material sorting tips.
        </p>
      </div>

      <div className="glass-card" style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        height: "500px",
        background: "var(--bg-2)"
      }}>
        {/* Quick Suggestion Chips */}
        <div style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "10px",
          marginBottom: "12px",
          borderBottom: "1px solid var(--border)"
        }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
            <Lightbulb size={12} color="#f59e0b" /> Ask:
          </span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              style={{
                padding: "4px 10px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text-muted)",
                fontSize: "0.72rem",
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all var(--transition)"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--green-primary)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          paddingRight: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignSelf: isBot ? "flex-start" : "flex-end",
                  maxWidth: "85%"
                }}
              >
                {isBot && (
                  <div style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                    background: "var(--green-glass)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Bot size={16} color="var(--green-primary)" />
                  </div>
                )}

                <div>
                  <div style={{
                    padding: "10px 14px",
                    borderRadius: isBot ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
                    background: isBot ? "var(--surface)" : "var(--green-dark)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                    fontSize: "0.85rem",
                    lineHeight: 1.4,
                    boxShadow: "var(--shadow-card)"
                  }}>
                    {msg.text}
                  </div>
                  <div style={{
                    fontSize: "0.68rem",
                    color: "var(--text-dim)",
                    marginTop: "3px",
                    textAlign: isBot ? "left" : "right"
                  }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "var(--green-light)", fontSize: "0.78rem", fontWeight: 600 }}>
              <Bot size={14} className="pulse" /> Searching guidelines...
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
            gap: "8px",
            marginTop: "12px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border)"
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask sorting rules (e.g. Can I recycle pizza boxes?)..."
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
              fontSize: "0.85rem",
              outline: "none"
            }}
          />
          <button
            type="button"
            onClick={startVoiceInput}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              cursor: "pointer"
            }}
          >
            <Mic size={18} />
          </button>
          <button
            type="submit"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "var(--green-primary)",
              color: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </main>
  );
}
