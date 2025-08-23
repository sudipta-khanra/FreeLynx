import axios from 'axios';

// Base axios instance for conversations
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/conversations',
});

// Automatically attach token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -------------------- Conversations --------------------

// Initialize or get conversation with another user
export const createConversation = (receiverId) =>
  api.post('/init', { receiverId });

// List all conversations of the logged-in user
export const listConversations = () => api.get('/');

// -------------------- Messages --------------------

// Get messages of a conversation with optional limit/skip
export const listMessages = (conversationId, opts = {}) =>
  api.get(`/${conversationId}/messages`, { params: opts });

// -------------------- Messages via REST (if supported) --------------------

// Send a message in a conversation
export const sendMessage = (conversationId, body) =>
  api.post(`/${conversationId}/messages`, { body });

// Mark a message as read (if backend route exists)
export const markRead = (messageId) =>
  api.patch(`/messages/${messageId}/read`, {});
