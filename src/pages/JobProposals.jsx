import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function JobProposals() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "client") {
      navigate("/dashboard");
      return;
    }
    if (jobId) {
      fetchProposals();
    }
  }, [user, navigate, jobId]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError("");

      // Ensure jobId is a string or number
      const actualJobId =
        typeof jobId === "object" && jobId !== null
          ? jobId._id || jobId.id
          : jobId;
      // console.log("Using jobId:", actualJobId, typeof actualJobId);

      // Fetch proposals
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/proposals/${actualJobId}`,

        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setProposals(res.data);

      // Fetch job title
      const jobRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobs/${actualJobId}`
      );
      setJobTitle(jobRes.data.title);
    } catch (err) {
      console.error("Failed to load proposals:", err);
      setError("Failed to load proposals. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading proposals...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Proposals for "{jobTitle}"
      </h1>

      {proposals.length === 0 ? (
        <p className="text-center text-gray-500">No proposals submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {proposals.map((p) => (
            <div key={p._id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold text-gray-800">
                {p.freelancerId.name} ({p.freelancerId.email})
              </h2>
              <p className="text-gray-700 my-2">{p.coverLetter}</p>
              <p className="text-sm text-gray-500">
                Budget: ${p.proposedBudget}
              </p>
              <p className="text-xs text-gray-400">
                Submitted: {new Date(p.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
