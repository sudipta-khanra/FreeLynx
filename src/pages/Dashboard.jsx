import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MyJobs from "./MyJobs";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null; // protect before auth loads

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
        Welcome to Your Dashboard
      </h1>

      {/* Client Dashboard */}
      {user.role === "client" && (
        <div>
          <p className="text-lg mb-6 text-gray-700 text-center">
            You are logged in as a{" "}
            <span className="font-semibold text-blue-600">Client</span>.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => navigate("/post-job")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              📢 Post a New Job
            </button>
            <button
              onClick={() => navigate("/my-jobs")}
              className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              📂 View Posted Jobs
            </button>
            <button
              onClick={() => navigate("/proposals-list")}
              className="bg-rose-700 text-white px-6 py-3 rounded-lg hover:bg-rose-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View Proposals
            </button>
          </div>
        </div>
      )}

      {/* Freelancer Dashboard */}
      {user.role === "freelancer" && (
        <div>
          <p className="text-lg mb-6 text-gray-700 text-center">
            You are logged in as a{" "}
            <span className="font-semibold text-green-600">Freelancer</span>.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => navigate("/jobs")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🔍 Browse Jobs
            </button>
            <button
              onClick={() => navigate("/my-proposals")}
              className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg "
            >
              📄 My Proposals
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
