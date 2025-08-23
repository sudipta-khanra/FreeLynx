import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function ProfilePage() {
  const {
    user,
    setUser,
    logout,
    updateProfilePicture,
    deleteAccount,
  } = useAuth();

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  // Initialize form fields with user data
  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setSkills(user.skills?.join(", ") || "");
      setExperience(user.experience || "");
      setPortfolio(user.portfolio?.join(", ") || "");
    }
  }, [user]);

  // ------------------ Logout ------------------
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ------------------ Delete Account ------------------
  const handleDelete = async () => {
    setShowConfirmModal(false);
    try {
      await deleteAccount();
      toast.success("Account deleted.");
      navigate("/register");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ------------------ Upload Profile Picture ------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.avatar) {
        updateProfilePicture(data.avatar);
        toast.success("Profile picture updated!");
      } else {
        toast.error(data.message || "Failed to upload image");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ------------------ Save Profile ------------------
  const handleSaveProfile = async () => {
    try {
      if (!user?.token) throw new Error("No token found");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          bio,
          skills: skills.split(",").map((s) => s.trim()),
          experience,
          portfolio: portfolio.split(",").map((p) => p.trim()),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated!");
      setEditing(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!user)
    return (
      <p className="text-center mt-10 text-gray-500">
        Please login to view profile.
      </p>
    );
  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-gray-50 rounded-2xl shadow-xl">
      {/* Avatar & Name */}
      <div className="flex flex-col items-center mb-8 relative">
        <div className="relative">
          <img
            key={user.avatar || "avatar"}
            src={user.avatar || "/user.png"}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-md"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-indigo-500 p-2 rounded-full cursor-pointer hover:bg-indigo-600 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 19.5l1.5-1.5m12 0l1.5 1.5M3 8.25V6a3 3 0 013-3h1.5m9 0H18a3 3 0 013 3v2.25"
              />
            </svg>
          </label>
          <input
            id="avatar-upload"
            type="file"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>
      {/* Editable Profile Info */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Bio</h3>
          {editing ? (
            <textarea
              className="w-full mt-1 p-2 border rounded-md focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          ) : (
            <p className="text-gray-600">{user.bio || "Not provided"}</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-700">Skills</h3>
          {editing ? (
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Separate skills with commas"
            />
          ) : (
            <p className="text-gray-600">
              {user.skills?.join(", ") || "Not provided"}
            </p>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-700">Experience</h3>
          {editing ? (
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          ) : (
            <p className="text-gray-600">
              {user.experience || "Not provided"} Years
            </p>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-700">Portfolio</h3>
          {editing ? (
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="Separate URLs with commas"
            />
          ) : (
            <p className="text-gray-600">
              {user.portfolio?.join(", ") || "Not provided"}
            </p>
          )}
        </div>
        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          {editing ? (
            <button
              onClick={handleSaveProfile}
              className="bg-indigo-500 text-white px-5 py-2 rounded-xl hover:bg-indigo-600 transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-indigo-500 text-white px-5 py-2 rounded-xl hover:bg-indigo-600 transition"
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-xl hover:bg-gray-400 transition"
          >
            Delete Account
          </button>
        </div>
      </div>
      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
            <p className="mb-4 font-semibold text-gray-800">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
