// src/components/FloatingChatModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
// import jwtDecode from "jwt-decode";
import * as jwtDecode from "jwt-decode"; // ✅ works

export default function FloatingChatModal({ token, receiverId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const chatBoxRef = useRef(null);

  // Initialize socket
  useEffect(() => {
    if (!token) return;
    const user = jwtDecode(token);

    socketRef.current = io("http://localhost:5000", { autoConnect: false });
    socketRef.current.connect();

    // Generate conversation ID based on sender & receiver
    const convId = `conv-${user.id || user._id}-${receiverId}`;
    setConversationId(convId);

    // Join conversation room
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

  // Send message
  const sendMessage = () => {
    if (!text.trim() || !socketRef.current || !conversationId) return;
    const user = jwtDecode(token);

    const messageData = {
      conversationId,
      senderId: user.id || user._id,
      body: text,
      _id: Date.now(), // temporary ID for UI
    };

    socketRef.current.emit("sendMessage", messageData);

    setMessages((prev) =>
      prev.some((m) => m._id === messageData._id) ? prev : [...prev, messageData]
    );
    setText("");
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          borderRadius: "50%",
          width: 60,
          height: 60,
          background: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: 24,
        }}
      >
        💬
      </button>

      {/* Chat modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 300,
            maxHeight: 400,
            border: "1px solid #ccc",
            borderRadius: 8,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            padding: 10,
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <h4>Chat</h4>
          <div
            ref={chatBoxRef}
            style={{
              flex: 1,
              overflowY: "auto",
              border: "1px solid #eee",
              padding: 4,
              marginBottom: 8,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg._id}
                style={{
                  textAlign: msg.senderId === (jwtDecode(token).id || jwtDecode(token)._id) ? "right" : "left",
                  margin: "4px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    borderRadius: 8,
                    background:
                      msg.senderId === (jwtDecode(token).id || jwtDecode(token)._id)
                        ? "#d1ffd6"
                        : "#f1f1f1",
                  }}
                >
                  {msg.body}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1 }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
