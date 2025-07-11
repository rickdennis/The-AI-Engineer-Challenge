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

  const handleSubmit = async (e: React.FormEvent) => {
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
      let fullText = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          fullText += chunk;
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
  const scrollToBottom = () => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  };
  
  // Scroll when response updates
  React.useEffect(() => {
    scrollToBottom();
  }, [response]);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7fa", color: "#222", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>OpenAI Chat API Frontend</h1>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "2rem", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", maxWidth: 480, width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          Developer Message:
          <textarea
            value={developerMessage}
            onChange={e => setDeveloperMessage(e.target.value)}
            required
            style={{ width: "100%", minHeight: 40, marginTop: 4 }}
            placeholder="Enter developer/system message"
          />
        </label>
        <label>
          User Message:
          <textarea
            value={userMessage}
            onChange={e => setUserMessage(e.target.value)}
            required
            style={{ width: "100%", minHeight: 40, marginTop: 4 }}
            placeholder="Enter user message"
          />
        </label>
        <label>
          Model:
          <input
            type="text"
            value={model}
            onChange={e => setModel(e.target.value)}
            style={{ width: "100%", marginTop: 4 }}
            placeholder="gpt-4.1-mini"
          />
        </label>
        <label>
          OpenAI API Key:
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            required
            style={{ width: "100%", marginTop: 4 }}
            placeholder="sk-..."
            autoComplete="off"
          />
        </label>
        <button type="submit" disabled={loading} style={{ background: "#0070f3", color: "#fff", border: "none", borderRadius: 4, padding: "0.75rem 1.5rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      <div style={{ marginTop: "2rem", width: "100%", maxWidth: 480 }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: 8 }}>Response:</h2>
        <div ref={responseRef} style={{ background: "#222", color: "#fff", borderRadius: 6, minHeight: 80, maxHeight: 240, overflowY: "auto", padding: 16, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
          {response || <span style={{ color: "#aaa" }}>(No response yet)</span>}
        </div>
      </div>
    </div>
  );
}
