// src/pages/JobsList.jsx
import JobCard from "../components/JobCard";

export default function JobsList({ jobs }) {
  return (
    <div>
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}
