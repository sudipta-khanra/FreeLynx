import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Link } from "react-router-dom";

const formatDate = (dateString) => {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  return !isNaN(date) ? date.toLocaleDateString() : "Not specified";
};

export default function ProposalsList() {
  const [proposalList, setProposalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function fetchProposals() {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/proposals/all-populated", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProposalList(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProposals();
  }, []);

  const updateProposalStatus = (id, status) => {
    setProposalList((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status } : p))
    );
  };

  const handleStatusChange = async (id, action) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      await axios.post(
        `/proposals/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateProposalStatus(id, action === "accept" ? "accepted" : "rejected");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const groupedProposals = proposalList.reduce((groups, proposal) => {
    if (!groups[proposal.jobPostId]) {
      groups[proposal.jobPostId] = {
        jobTitle: proposal.jobTitle,
        proposals: [],
      };
    }
    groups[proposal.jobPostId].proposals.push(proposal);
    return groups;
  }, {});

  if (loading)
    return (
      <p className="text-center py-10 text-gray-700">
        Loading proposals...
      </p>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-600 font-semibold">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 space-y-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Submitted Proposals
      </h2>

      {Object.keys(groupedProposals).length === 0 ? (
        <p className="text-gray-600 text-center">No proposals submitted yet.</p>
      ) : (
        Object.entries(groupedProposals).map(([jobPostId, group]) => (
          <section key={jobPostId} className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-700 border-b border-blue-300 pb-2">
              {group.jobTitle}
            </h3>

            {group.proposals.map(
              ({
                _id,
                freelancerName,
                freelancerMail,
                coverLetter,
                bidAmount,
                timeline,
                status,
                createdAt,
              }) => (
                <article
                  key={_id}
                  className={`border rounded-lg p-5 shadow-sm ${
                    status === "accepted"
                      ? "border-green-500 bg-green-50"
                      : status === "rejected"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {freelancerName}
                      </h4>

                      <div className="flex gap-4 items-center mt-1 flex-wrap">
                        <a
                          href={`mailto:${freelancerMail}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {freelancerMail}
                        </a>
                      </div>

                      <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                        {coverLetter}
                      </p>

                      <p className="text-gray-800 font-medium mt-3">
                        Bid: <span className="font-semibold">${bidAmount}</span>
                      </p>

                      <p className="text-gray-800 font-medium mt-1">
                        Timeline:{" "}
                        <span className="font-semibold">
                          {timeline || "Not specified"}
                        </span>
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        Submitted on: {formatDate(createdAt)}
                      </p>

                      {status !== "pending" && (
                        <p
                          className={`mt-3 font-semibold ${
                            status === "accepted"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                        </p>
                      )}
                    </div>

                    {status === "pending" && (
                      <div className="mt-4 sm:mt-0 flex space-x-3">
                        <button
                          onClick={() => handleStatusChange(_id, "accept")}
                          disabled={updatingId === _id}
                          className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center"
                        >
                          {updatingId === _id ? (
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                              ></path>
                            </svg>
                          ) : (
                            "Accept"
                          )}
                        </button>
                        <button
                          onClick={() => handleStatusChange(_id, "reject")}
                          disabled={updatingId === _id}
                          className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
                        >
                          {updatingId === _id ? (
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                              ></path>
                            </svg>
                          ) : (
                            "Reject"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              )
            )}
          </section>
        ))
      )}
    </div>
  );
}
