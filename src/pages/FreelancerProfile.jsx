import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function FreelancerProfile() {
  const { proposalId } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    setFreelancer(null);

    // Step 1: fetch proposal by proposalId
    fetch(`/api/proposals/${proposalId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Proposal not found");
        return res.json();
      })
      .then((proposalData) => {
        const freelancerId = proposalData.freelancerId; // get freelancer ID from proposal
        // Step 2: fetch freelancer by freelancerId
        return fetch(`/api/freelancers/${freelancerId}`);
      })
      .then((res) => {
        if (!res.ok) throw new Error("Freelancer not found");
        return res.json();
      })
      .then((freelancerData) => setFreelancer(freelancerData))
      .catch((err) => setError(err.message));
  }, [proposalId]);

  if (error) {
    return <p className="text-red-600 font-semibold">Error: {error}</p>;
  }

  if (!freelancer) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{freelancer.name}</h1>
      <p>{freelancer.email}</p>
      <p>Role: {freelancer.role}</p>
    </div>
  );
}
