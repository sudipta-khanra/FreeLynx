import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedBudget, setProposedBudget] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmittedProposal, setHasSubmittedProposal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchJob();
  }, [user, navigate, id]);

 const fetchJob = async () => {
  if (!user?.token) {
    console.error("No token found!");
    return;
  }

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/jobs/${id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    setJob(res.data);
  } catch (err) {
    console.error("Error fetching job:", err);
  } finally {
    setLoading(false);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/proposals`,
        {
          jobId: job._id,
          coverLetter,
          proposedBudget: Number(proposedBudget),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      toast.success("Proposal submitted!");
      setCoverLetter("");
      setProposedBudget("");
      setHasSubmittedProposal(true);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error(
          err.response.data.message || "You have already submitted a proposal."
        );
        setHasSubmittedProposal(true);
      } else if (err.response?.status === 403) {
        toast.error("You are not allowed to submit proposals.");
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="loader"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto mt-12 p-6 bg-white shadow-md rounded-md">
        <ToastContainer position="top-right" autoClose={3000} />
        <p className="text-red-600 font-semibold">
          Job not found or unauthorized.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white shadow-md rounded-md">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Job Information Section */}
      <div className="mb-8 p-8 bg-white shadow-xl rounded-2xl border border-gray-200 transition-transform duration-300 hover:scale-[1.01]">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          {job.client?.name || "Account Owner"}
        </h1>
        <p className="text-gray-700 text-base mb-6 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
          {job.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
          <div className="bg-gradient-to-r from-green-50 to-white p-5 rounded-lg border hover:shadow-md transition-shadow">
            <p className="font-semibold text-gray-600">Estimated Budget</p>
            <p className="text-2xl font-bold text-green-700">${job.budget}</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-white p-5 rounded-lg border hover:shadow-md transition-shadow">
            <p className="font-semibold text-gray-600">Submission Deadline</p>
            <p className="text-lg font-medium">
              {/* {new Date(job.deadline).toDateString()} */}
              {new Date(job.deadline).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
})} IST

            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-white p-5 rounded-lg border hover:shadow-md transition-shadow">
            <p className="font-semibold text-gray-600">Category</p>
            <p className="capitalize text-base">
              {job.category || "Not specified"}
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-white p-5 rounded-lg border hover:shadow-md transition-shadow">
            <p className="font-semibold text-gray-600">Position Type</p>
            <p className="capitalize text-base">
              {job.title || "Not specified"}
            </p>
          </div>
          {job.postedBy && (
            <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-lg border sm:col-span-2 hover:shadow-md transition-shadow">
              <p className="font-semibold text-gray-600">Posted By</p>
              <p className="text-blue-700 font-medium text-lg">
                {job.postedBy.name || "Client"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Proposal Submission Form or message */}
      {user.role === "freelancer" && (
        <div className="border-t pt-6">
          {!hasSubmittedProposal ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Submit Your Proposal
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                As a freelancer, you can submit your proposal below. Include a
                clear and concise cover letter explaining why you're a good fit
                for this job and how you plan to complete it. You also need to
                propose a budget that fits within the client's expectations.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows="6"
                    placeholder="Write a message to the client describing your experience, approach, and why you are the best fit..."
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={submitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Be specific about your experience, timeline, and skills
                    relevant to the job.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Budget (in USD)
                  </label>
                  <input
                    type="number"
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(e.target.value)}
                    placeholder="Enter the amount you want to charge for this job"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min={0}
                    disabled={submitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You may quote higher or lower than the listed budget, but
                    explain why in your cover letter.
                  </p>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="loader inline-block mr-2"></span>
                      Submitting Proposal...
                    </>
                  ) : (
                    "Submit Proposal"
                  )}
                </button>
              </form>
            </>
          ) : (
            <p className="text-green-700 font-semibold mt-4">
              You have already submitted a proposal for this job.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
