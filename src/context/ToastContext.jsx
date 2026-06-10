import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  // Helpers:
  const success = (msg, duration) => addToast(msg, "success", duration);
  const error = (msg, duration) => addToast(msg, "error", duration);
  const info = (msg, duration) => addToast(msg, "info", duration);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info }}>
      {children}
      <div
        style={{
          position: "fixed",
          top: 80,
          right: 20,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            style={{
              padding: "10px 20px",
              borderRadius: 5,
              color: "white",
              backgroundColor:
                type === "success"
                  ? "green"
                  : type === "error"
                  ? "red"
                  : "gray",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              minWidth: 200,
            }}
          >
            {message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
