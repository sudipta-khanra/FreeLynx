// src/lib/socket.js
import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io("https://freelynx-backend.onrender.com", {
      auth: { token }, // optional if you use token-based auth
    });


    socket.on("connect", () => {
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }
  return socket;
};
