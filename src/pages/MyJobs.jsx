import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyJobs, deleteJobById } from "../services/jobService";
import { useAuth } from "../hooks/useAuth";

export default function MyJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // Redirect if not logged in or not a client
  useEffect(() => {
    if (!user) {
      console.warn("🚫 No user, redirecting to login");
      navigate("/login");
    } else if (user.role !== "client") {
      console.warn("🚫 Not a client, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Load jobs when token is available
  useEffect(() => {
    if (user?.token) {
      loadJobs();
    } else {
      console.warn("🚫 No token, skipping loadJobs()");
    }
  }, [user?.token]);

  const loadJobs = async () => {
    console.log("🔄 loadJobs called");
    try {
      setLoading(true);
      setError("");

      const data = await getMyJobs(user.token);

      if (Array.isArray(data)) {
        setJobs(data);
      } else if (data && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else {
        console.warn("⚠️ Unexpected data format:", data);
        setJobs([]);
        setError("Unexpected API response format");
      }
    } catch (err) {
      console.error("❌ Failed to load jobs:", err);
      setError(err.message || "Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (jobId) => {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    try {
      await deleteJobById(jobId, user.token); // replace with your actual delete service
      setJobs(jobs.filter((job) => job._id !== jobId)); // update local job list
    } catch (err) {
      console.error("❌ Failed to delete job:", err);
      alert("Failed to delete job. Please try again.");
    }
  };

  // JSX rendering
  return (
    <div className="my-jobs-page px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📄 My Posted Jobs
      </h1>

      {loading && (
        <div className="flex justify-center items-center">
          <p className="text-lg text-blue-600 animate-pulse">
            ⏳ Loading jobs...
          </p>
        </div>
      )}

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded shadow text-center">
          {error}
        </p>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center mt-10 text-gray-600">
          <p className="text-xl">📭 No jobs found.</p>
          <p className="text-sm mt-2">
            Start by posting a new job from your dashboard.
          </p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  {job.title}
                </h3>
                <p className="text-gray-700 mb-3 line-clamp-3">
                  {job.description}
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>
                    💰 Budget:{" "}
                    <span className="font-medium text-gray-800">
                      ${job.budget}
                    </span>
                  </p>
                  <p>
                    📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  View Details
                </button>

                <button
                  onClick={() => navigate(`/my-jobs/${job._id}/edit`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
