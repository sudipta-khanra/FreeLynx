import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token automatically if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // read token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register user
export const registerUser = async (userData) => {
  try {
    const res = await api.post("/auth/register", {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || "freelancer",
      bio: userData.bio || "",
      skills: userData.skills || [],
      portfolio: userData.portfolio || [],
      experience: userData.experience || "",
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// Login user
export const loginUser = async ({ email, password }) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    return {
  user: {
    ...res.data.user, // copy everything: name, email, bio, skills, portfolio, experience, etc.
  },
  token: res.data.token,
};

  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export default api;
