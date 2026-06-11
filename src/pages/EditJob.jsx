import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated. Please login.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`/jobs/${id}`); // No manual headers needed
        const data = res.data;

        setJobData({
          title: data.title || "",
          description: data.description || "",
          budget: data.budget || "",
          deadline: data.deadline ? data.deadline.split("T")[0] : "",
          category: data.category || "",
        });
      } catch (err) {
        console.error("Error fetching job:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please login.");
        } else {
          setError("Failed to fetch job data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to update a job.");
        return;
      }

      await axios.put(`/jobs/${id}`, jobData); // No need for headers

      navigate("/my-jobs");
    } catch (err) {
      console.error("Error updating job:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update job.");
      }
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;

return (
  <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10">
    <h2 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight">
      Edit Job
    </h2>

    {error && (
      <p className="mb-6 text-red-600 font-semibold text-center animate-shake">
        {error}
      </p>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        name="title"
        value={jobData.title}
        onChange={handleChange}
        placeholder="Job Title"
        required
        className="w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />

      <textarea
        name="description"
        value={jobData.description}
        onChange={handleChange}
        placeholder="Job Description"
        rows={5}
        required
        className="w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />

      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 pointer-events-none">
          $
        </span>
        <input
          type="number"
          name="budget"
          value={jobData.budget}
          onChange={handleChange}
          placeholder="Budget"
          min="1"
          required
          className="w-full pl-12 pr-5 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
      </div>

      <input
        type="date"
        name="deadline"
        value={jobData.deadline}
        onChange={handleChange}
        required
        className="w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />

      <input
        name="category"
        value={jobData.category}
        onChange={handleChange}
        placeholder="Category"
        required
        className="w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />

      <button
        type="submit"
        className="w-full py-3 bg-yellow-500 rounded-xl text-white font-semibold text-lg hover:bg-yellow-600 transition shadow-md"
      >
        Update Job
      </button>
    </form>
  </div>
);

};

export default EditJob;
