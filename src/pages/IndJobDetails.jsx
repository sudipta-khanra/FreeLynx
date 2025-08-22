// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../utils/axiosInstance";

// const IndJobDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchJob = async () => {
//       try {
//         const res = await axios.get(`/jobs/${id}`);
//         setJob(res.data);
//       } catch (err) {
//         setError(
//           err.response?.data?.message || "Failed to load job details."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJob();
//   }, [id]);

//   if (loading) return <p className="text-center mt-4">Loading job details...</p>;

//   if (error)
//     return (
//       <p className="text-center mt-4 text-red-600 font-semibold">{error}</p>
//     );

//   if (!job) return <p className="text-center mt-4">No job found.</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
//       <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
//       <p className="mb-2 text-gray-700">{job.description}</p>
//       <p className="mb-2">
//         <strong>Budget:</strong> ${job.budget}
//       </p>
//       <p className="mb-2">
//         <strong>Deadline:</strong>{" "}
//         {job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}
//       </p>
//       <p className="mb-2">
//         <strong>Category:</strong> {job.category}
//       </p>

//       <button
//         onClick={() => navigate(-1)} // go back
//         className="mt-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//       >
//         Back
//       </button>
//     </div>
//   );
// };

// export default IndJobDetails;
