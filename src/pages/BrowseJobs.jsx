import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const JOBS_PER_PAGE = 20;

function Pagination({ totalPages, currentPage, onPageChange }) {
  const maxButtons = 7;

  const getPageNumbers = () => {
    const pages = [];
    const siblingCount = 1;
    const totalPageNumbers = siblingCount * 2 + 2;

    if (totalPages <= totalPageNumbers) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
      const rightSiblingIndex = Math.min(
        currentPage + siblingCount,
        totalPages - 1
      );

      pages.push(1);

      if (leftSiblingIndex > 2) {
        pages.push("...");
      }

      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i);
      }

      if (rightSiblingIndex < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center space-x-3 mt-14"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`w-10 h-10 rounded-full flex items-center justify-center border border-indigo-400 text-indigo-600 hover:bg-indigo-100 transition ${
          currentPage === 1 ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`dots-${idx}`}
            className="flex items-center justify-center w-10 h-10 text-indigo-400 font-semibold"
          >
            &#8230;
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition font-semibold
              ${
                page === currentPage
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                  : "border-indigo-300 text-indigo-600 hover:bg-indigo-100"
              }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`w-10 h-10 rounded-full flex items-center justify-center border border-indigo-400 text-indigo-600 hover:bg-indigo-100 transition ${
          currentPage === totalPages ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

export default function BrowseJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "freelancer") {
      navigate("/dashboard");
    } else {
      fetchJobs();
    }
  }, [user, navigate]);

  const fetchJobs = async () => {
    setLoading(true); // start loading
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false); // stop loading
    }
  };

  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const currentJobs = jobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

return (
  <div className="max-w-6xl mx-auto px-5 py-12 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 min-h-screen">
    <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-12 tracking-wide drop-shadow-md">
      Browse Jobs
    </h1>

    {/* ✅ Spinner when loading */}
    {loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : jobs.length === 0 ? (
      <p className="text-center text-gray-500 text-lg">No jobs found.</p>
    ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {currentJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-400 p-6 border border-indigo-200 hover:border-indigo-400 cursor-pointer"
            >
              <h2 className="text-2xl font-semibold text-indigo-800 mb-3 hover:text-indigo-600 transition-colors duration-300">
                {job.title}
              </h2>
              <p className="text-gray-700 mb-5 line-clamp-4 leading-relaxed">
                {job.description}
              </p>
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
                  <span>Deadline: {job.deadline}</span>
                </span>
              </div>
              <Link
                to={`/jobs/${job._id}`}
                className="inline-block px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition duration-300"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </>
    )}
  </div>
);

}
