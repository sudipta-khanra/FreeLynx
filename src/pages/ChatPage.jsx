// src/components/FloatingChat.jsx
import { useEffect, useState } from "react";
import { connectSocket } from "../lib/socket";

export default function FloatingChat({ token, receiverId }) {
  const [socket, setSocket] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const s = connectSocket(token);
    setSocket(s);

    // Listen for new messages
    s.on("message:new", ({ message }) => {
      setMessages((prev) =>
        prev.some((m) => m._id === message._id) ? prev : [...prev, message]
      );
    });

    return () => s.off("message:new");
  }, [token]);

  const startChat = () => {
    if (!socket) return;
    socket.emit(
      "conversation:start",
      { receiverId },
      ({ conversation, messages, error }) => {
        if (error) return alert(error);
        setConversation(conversation);
        setMessages(messages || []);
      }
    );
  };

  const sendMessage = () => {
    if (!socket || !conversation || !text.trim()) return;
    socket.emit(
      "message:send",
      { conversationId: conversation._id, body: text },
      (res) => {
        if (res.error) return alert(res.error);
        setMessages((prev) =>
          prev.some((m) => m._id === res.message._id)
            ? prev
            : [...prev, res.message]
        );
      }
    );
    setText("");
  };

  // Auto scroll chat
  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
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
          fontSize: "24px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 1001,
        }}
      >
        💬
      </button>

      {/* Floating Chat Box */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "300px",
            height: "400px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              fontWeight: "bold",
              backgroundColor: "#f5f5f5",
            }}
          >
            Chat
            <span
              onClick={() => setOpen(false)}
              style={{
                float: "right",
                cursor: "pointer",
                color: "#888",
                fontWeight: "normal",
              }}
            >
              ✖
            </span>
          </div>

          {/* Chat Messages */}
 <div
  id="chat-box"
  style={{
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    backgroundColor: "#f9f9f9",
  }}
>
  {messages.map((m, index) => (
    <div
      key={`${m._id}-${index}`}
      style={{
        display: "flex",
        justifyContent: m.sender === token ? "flex-end" : "flex-start",
      }}
    >
      <span
        style={{
          display: "inline-block",
          padding: "8px 12px",
          borderRadius: "15px",
          backgroundColor: m.sender === token ? "#dcf8c6" : "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          wordBreak: "break-word",
          maxWidth: "70%",
        }}
      >
        {m.body}
      </span>
    </div>
  ))}
</div>


          {/* Input Box */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ddd",
              padding: "6px",
              gap: "6px",
            }}
          >
            {!conversation && (
              <button
                onClick={startChat}
                style={{
                  flex: 1,
                  borderRadius: "15px",
                  border: "none",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Start Chat
              </button>
            )}
            {conversation && (
              <>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    borderRadius: "15px",
                    border: "1px solid #ccc",
                    outline: "none",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "15px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
