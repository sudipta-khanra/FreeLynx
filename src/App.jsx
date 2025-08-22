import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "./context/ToastContext";
import FloatingChatButton from "./pages/ChatPage.jsx";

export default function App() {
  const token = localStorage.getItem("token");
  const [receiverId, setReceiverId] = useState(null);

  return (
    <ToastProvider>
      <AppRoutes />

      {/* Floating chat button accessible on all pages */}
      {token && (
        <FloatingChatButton
          token={token}
          receiverId={receiverId || "default-receiver-id"} // replace with logic if needed
        />
      )}
    </ToastProvider>
  );
}
