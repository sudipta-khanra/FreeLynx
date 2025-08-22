// src/components/FloatingChatButton.jsx
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import jwt_decode from "jwt-decode"; // fixed import

export default function FloatingChatButton({ token, receiverId }) {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const user = jwt_decode(token);

    // Initialize socket once
    socketRef.current = io("http://localhost:5000", { autoConnect: false });
    socketRef.current.connect();

    // Start conversation room
    const convId = `conv-${user.id}-${receiverId}`;
    setConversationId(convId);
    socketRef.current.emit("joinConversation", convId);

    // Listen for incoming messages
    socketRef.current.on("newMessage", (message) => {
      setMessages((prev) =>
        prev.some((m) => m._id === message._id) ? prev : [...prev, message]
      );
    });

    return () => {
      socketRef.current.off("newMessage");
      socketRef.current.disconnect();
    };
  }, [token, receiverId]);

  const sendMessage = () => {
    if (!text.trim() || !socketRef.current || !conversationId) return;

    const user = jwt_decode(token);
    const messageData = {
      _id: Date.now(),
      conversationId,
      sender: user.id || user._id,
      body: text,
    };

    // Emit message
    socketRef.current.emit("sendMessage", messageData);

    // Optimistic update
    setMessages((prev) => [...prev, messageData]);
    setText("");
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            height: "400px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            padding: "8px",
          }}
        >
          <div
            ref={chatBoxRef}
            style={{
              flex: 1,
              overflowY: "auto",
              border: "1px solid #ccc",
              marginBottom: 8,
              padding: 4,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg._id}
                style={{
                  textAlign: msg.sender === jwt_decode(token).id ? "right" : "left",
                  margin: "4px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    borderRadius: 8,
                    background:
                      msg.sender === jwt_decode(token).id ? "#d1ffd6" : "#f1f1f1",
                  }}
                >
                  {msg.body}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1 }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          zIndex: 1001,
        }}
      >
        💬
      </button>
    </>
  );
}
