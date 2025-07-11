"use client";

import React, { useState, useRef } from "react";

export default function Home() {
  const [developerMessage, setDeveloperMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [model, setModel] = useState("gpt-4.1-mini");
  const [apiKey, setApiKey] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  const availableModels = [
    "gpt-4.1-mini",
    "gpt-4.1-nano",
    "gpt-3.5-turbo"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponse("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: userMessage,
          model,
          api_key: apiKey,
        }),
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          setResponse((prev) => prev + chunk);
        }
      }
    } catch (err: any) {
      setResponse("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to response
  React.useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        color: "#222",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          maxWidth: 420,
          width: "100%",
          padding: "2.5rem 2rem 2rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.1rem",
            fontWeight: 700,
            color: "#0070f3",
            margin: 0,
            letterSpacing: "-1px",
            textAlign: "center",
          }}
        >
          OpenAI Chat
        </h1>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem", // Reduce gap between form elements
          }}
        >
          <label style={{ fontWeight: 500, color: "#333", marginBottom: 0, marginTop: 0 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              Developer Message
              <span style={{ position: "relative", display: "inline-block" }}>
                <span
                  tabIndex={0}
                  aria-label="What is Developer Message?"
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#f7f8fa",
                    border: "1px solid #bbb",
                    color: "#888",
                    fontSize: 12,
                    fontWeight: 700,
                    textAlign: "center",
                    lineHeight: "16px",
                    cursor: "pointer",
                    marginLeft: 2,
                  }}
                >
                  ?
                </span>
                <span
                  style={{
                    visibility: "hidden",
                    opacity: 0,
                    width: 240,
                    background: "#222",
                    color: "#fff",
                    textAlign: "left",
                    borderRadius: 6,
                    padding: "8px 12px",
                    position: "absolute",
                    zIndex: 10,
                    left: "50%",
                    top: 22,
                    transform: "translateX(-50%)",
                    fontSize: 13,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    transition: "opacity 0.2s",
                    pointerEvents: "none"
                  }}
                  className="devmsg-tooltip"
                  role="tooltip"
                >
                  The developer message (also called system prompt) is a special instruction for the AI model. Use it to set behavior, context, or constraints for the conversation. For example: &quot;You are a helpful assistant.&quot; or &quot;Only answer in JSON.&quot;
                </span>
                <style>{`
                  label span[aria-label]::after { display: none; }
                  label span[aria-label]:hover + .devmsg-tooltip,
                  label span[aria-label]:focus + .devmsg-tooltip,
                  label span[aria-label]:focus-visible + .devmsg-tooltip {
                    visibility: visible !important;
                    opacity: 1 !important;
                    pointer-events: auto !important;
                  }
                `}</style>
              </span>
            </span>
          </label>
          <textarea
            value={developerMessage}
            onChange={e => setDeveloperMessage(e.target.value)}
            required
            style={{
              width: "100%",
              minHeight: 36,
              margin: 0, // Remove all margin for tightest spacing
              borderRadius: 8,
              border: "1px solid #eaeaea",
              padding: "0.5rem 0.75rem",
              fontSize: 15,
              background: "#f7f8fa",
              resize: "vertical",
              transition: "border 0.2s",
            }}
            placeholder="Enter developer/system message"
          />
          <label style={{ fontWeight: 500, color: "#333" }}>
            User Message
            <textarea
              value={userMessage}
              onChange={e => setUserMessage(e.target.value)}
              required
              style={{
                width: "100%",
                minHeight: 36,
                marginTop: 6,
                borderRadius: 8,
                border: "1px solid #eaeaea",
                padding: "0.5rem 0.75rem",
                fontSize: 15,
                background: "#f7f8fa",
                resize: "vertical",
                transition: "border 0.2s",
              }}
              placeholder="Enter user message"
            />
          </label>
          <label style={{ fontWeight: 500, color: "#333" }}>
            Model
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              style={{
                width: "100%",
                marginTop: 6,
                borderRadius: 8,
                border: "1px solid #eaeaea",
                padding: "0.5rem 0.75rem",
                fontSize: 15,
                background: "#f7f8fa",
                transition: "border 0.2s",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
              }}
            >
              {availableModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label style={{ fontWeight: 500, color: "#333" }}>
            OpenAI API Key
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              required
              style={{
                width: "100%",
                marginTop: 6,
                borderRadius: 8,
                border: "1px solid #eaeaea",
                padding: "0.5rem 0.75rem",
                fontSize: 15,
                background: "#f7f8fa",
                letterSpacing: 2,
                transition: "border 0.2s",
              }}
              placeholder="sk-..."
              autoComplete="off"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#b2d7ff" : "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "0.85rem 0",
              fontWeight: 700,
              fontSize: 17,
              marginTop: 4,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 2px 8px rgba(0,112,243,0.08)",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
        <div style={{ marginTop: "0.5rem", width: "100%" }}>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "#222",
              marginBottom: 8,
              marginTop: 0,
            }}
          >
            Response
          </h2>
          <div
            ref={responseRef}
            style={{
              background: "#232526",
              color: "#f7f7fa",
              borderRadius: 12,
              minHeight: 80,
              maxHeight: 220,
              overflowY: "auto",
              padding: 18,
              fontFamily: "Fira Mono, monospace",
              fontSize: 15,
              whiteSpace: "pre-wrap",
              boxShadow: "0 2px 8px rgba(31,38,135,0.07)",
              border: "1px solid #2c2f33",
              marginBottom: 0,
              marginTop: 0,
              transition: "border 0.2s",
            }}
          >
            {response ? (
              <span style={{ wordBreak: "break-word" }}>{response}</span>
            ) : (
              <span style={{ color: "#aaa" }}>(No response yet)</span>
            )}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 32, color: "#fff", opacity: 0.7, fontSize: 14, textAlign: "center" }}>
        Powered by OpenAI | Built with Next.js
      </div>
    </div>
  );
}
