import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyProposals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [proposalToDelete, setProposalToDelete] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProposals();
  }, [user, navigate]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/proposals`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProposals(res.data);
    } catch (error) {
      toast.error("Failed to load proposals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (proposalId) => {
    setProposalToDelete(proposalId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!proposalToDelete) return;
    try {
      setDeletingId(proposalToDelete);
      setShowModal(false);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/proposals/${proposalToDelete}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      toast.success("Proposal deleted successfully.");
      setProposals((prev) => prev.filter((p) => p._id !== proposalToDelete));
    } catch (error) {
      toast.error("Failed to delete proposal. Please try again.");
    } finally {
      setDeletingId(null);
      setProposalToDelete(null);
    }
  };

  const filteredProposals =
    filter === "all" ? proposals : proposals.filter((p) => p.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="loader border-8 border-gray-300 border-t-blue-600 w-12 h-12 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 p-8 bg-gray-50 shadow-lg rounded-xl">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-900">
          My Proposals
        </h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredProposals.length === 0 ? (
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">
            No proposals found.
          </h2>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProposals.map((proposal) => (
            <div
              key={proposal._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow hover:shadow-lg transition-shadow"
            >
              {/* Top Row */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <h2 className="text-xl font-semibold text-indigo-700">
                  {proposal.jobId?.title || "Untitled Job"}
                </h2>
                <span
                  className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                    proposal.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : proposal.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {proposal.status.charAt(0).toUpperCase() +
                    proposal.status.slice(1)}{" "}
                  by Client
                </span>
              </div>

              {/* Meta Info */}
              <p className="text-sm text-gray-500 mt-1">
                Submitted on{" "}
                {new Date(proposal.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
                • Proposed Budget: $
                {proposal.proposedBudget?.toFixed(2) || "N/A"} • Timeline:{" "}
                {proposal.timeline || "Not specified"}
              </p>

              {/* Cover Letter */}
              <p className="mt-4 text-gray-700 leading-relaxed">
                {proposal.coverLetter || "No cover letter provided."}
              </p>

              {/* Actions */}
              <div className="mt-6 flex gap-4">
                <Link
                  to={`/jobs/${proposal.jobId._id}`}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  View Job
                </Link>
                <button
                  onClick={() => confirmDelete(proposal._id)}
                  disabled={
                    deletingId === proposal._id ||
                    proposal.status === "accepted"
                  }
                  className={`px-5 py-2 rounded-lg text-white font-semibold transition ${
                    deletingId === proposal._id ||
                    proposal.status === "accepted"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {deletingId === proposal._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this proposal? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
