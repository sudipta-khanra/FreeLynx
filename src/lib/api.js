import axios from "axios";

// Base API URL
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// Axios instance
const api = axios.create({ baseURL: API_BASE });

// Add auth token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Centralized error handler
const handleError = (error) => {
  console.error("API Error:", error.response?.data ?? error.message);
  throw error;
};

// ✅ Fetch all conversations
export async function listConversations() {
  try {
    const res = await api.get("/chat"); // Matches backend: /api/chat
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

// ✅ Fetch messages for a specific conversation
export async function listMessages(conversationId, params = {}) {
  if (!conversationId) throw new Error("conversationId is required");
  try {
    // Corrected path: /api/messages/:conversationId
    const res = await api.get(`/messages/${conversationId}`, { params });
    return res.data;
  } catch (error) {
    handleError(error);
  }
}
