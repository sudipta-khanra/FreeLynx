import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-400 p-6 border border-indigo-200 hover:border-indigo-400 cursor-pointer"
    >
      <h2 className="text-2xl font-semibold text-indigo-800 mb-3 hover:text-indigo-600 transition-colors duration-300">
        {job.title}
      </h2>
      <p className="text-gray-700 mb-5 line-clamp-4 leading-relaxed">{job.description}</p>
      <div className="flex justify-between text-indigo-600 font-medium text-sm mb-5">
        <span className="flex items-center space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.5 0-2.5 1-2.5 2.5S10.5 13 12 13s2.5-1 2.5-2.5S13.5 8 12 8z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
            />
          </svg>
          <span>Budget: ${job.budget}</span>
        </span>
        <span className="flex items-center space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z"
            />
          </svg>
          {/* <span>Deadline: {job.deadline}</span> */}
          <span>
  Deadline: {new Date(job.deadline).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })} IST
</span>

        </span>
      </div>
      <Link
        to={`/job/${job._id}`}
        className="inline-block px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition duration-300"
      >
        Apply Now
      </Link>
    </div>
  );
}
