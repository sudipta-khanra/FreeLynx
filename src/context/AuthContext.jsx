// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL; // ✅ Add API URL

// Create AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const deleteAccount = async () => {
    try {
      if (!user?.token) throw new Error("No token found");

      const res = await fetch(`${API_URL}/users/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete account");
      }

      logout();
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  };

  const updateProfilePicture = (newAvatarUrl) => {
    if (!user) return;
    const updatedUser = { ...user, avatar: newAvatarUrl };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (loading) return null; // Prevent children rendering until user is restored

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        updateProfilePicture,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook
export const useAuth = () => useContext(AuthContext);
