import axios from 'axios';

// Axios instance for chat API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/chat',
});

// Automatically attach token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Conversations
export const createConversation = (otherUserId) =>
  api.post('/conversations', { otherUserId });

export const listConversations = () => api.get('/conversations');

// Messages
export const listMessages = (conversationId, opts = {}) =>
  api.get(`/conversations/${conversationId}/messages`, { params: opts });

export const sendMessage = (payload) => api.post('/messages', payload);

export const markRead = (messageId) =>
  api.patch(`/messages/${messageId}/read`, {});
