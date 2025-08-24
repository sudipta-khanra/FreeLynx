import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const { user, logout } = useAuth();
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL; // Already includes /api

  const toggleSearch = () => setSearchOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ------------------ Search Submit ------------------
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const res = await fetch(
        `${API_URL}/jobs?search=${encodeURIComponent(searchTerm)}`
      );

      if (!res.ok) {
        console.error("Search failed with status:", res.status);
        setResults([]);
        setShowDropdown(false);
        setSearchOpen(false);
        return;
      }

      const data = await res.json();
      const jobs = Array.isArray(data.jobs) ? data.jobs : [];
      setResults(jobs);
      setShowDropdown(jobs.length > 0);
      setSearchOpen(jobs.length > 0);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
      setShowDropdown(false);
      setSearchOpen(false);
    }

    setSearchTerm("");
  };

  // ------------------ Profile menu outside click ------------------
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // ------------------ Dropdown outside click ------------------
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputRef = useRef(null);

  // ------------------ Search as you type ------------------
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `${API_URL}/jobs?search=${encodeURIComponent(searchTerm)}`
        );

        if (!res.ok) {
          console.error("Search failed with status:", res.status);
          setResults([]);
          setShowDropdown(false);
          return;
        }

        const data = await res.json();
        const jobs = Array.isArray(data.jobs) ? data.jobs : [];
        setResults(jobs);
        setShowDropdown(jobs.length > 0);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
        setShowDropdown(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, API_URL]);

  // ------------------ Select job from dropdown ------------------
  const handleSelect = (jobId) => {
    if (inputRef.current) inputRef.current.value = "";
    setResults([]);
    setShowDropdown(false);
    navigate(`/jobs/${jobId}`);
    setSearchTerm("");
  };

  return (
    <header className="bg-white shadow-md px-4 md:px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-extrabold text-blue-600 hover:text-blue-700 transition-colors duration-200"
      >
        FreeLynx
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center flex-1 justify-center gap-6 text-gray-700 font-medium">
        {user && (
          <>
            <Link to="/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            {user.role === "freelancer" && (
              <>
                <Link
                  to="/jobs"
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/my-proposals"
                  className="hover:text-blue-600 transition"
                >
                  My Proposals
                </Link>
              </>
            )}
            {user.role === "client" && (
              <button
                onClick={() => navigate("/post-job")}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                Post Job
              </button>
            )}
          </>
        )}
      </nav>

      {/* Right Side: User or Login/Register */}
      <div className="flex items-center gap-3 ml-auto">
        {user ? (
          <>
            {/* Desktop Only */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search Icon */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen((prev) => !prev)}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-xl mt-2"
                  aria-label="Toggle search"
                  title="Search jobs"
                >
                  <FaSearch />
                </button>

                {searchOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-300 rounded-full shadow-lg z-50 p-2">
                    <form
                      onSubmit={handleSearchSubmit}
                      className="flex items-center w-full px-3 py-1 bg-white rounded-full"
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="🔍 Search jobs by title..."
                        className="flex-grow h-8 text-sm outline-none"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="ml-3 bg-blue-600 text-white rounded-full px-3 py-1 text-sm hover:bg-blue-700 transition"
                        aria-label="Search"
                      >
                        Go
                      </button>
                    </form>
                    {results.length > 0 && (
                      <ul className="absolute mt-2 w-80 max-h-64 overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                        {results.map((job) => (
                          <li
                            key={job._id}
                            className="flex flex-col px-4 py-3 hover:bg-blue-50 transition cursor-pointer"
                          >
                            <Link
                              to={`/jobs/${job._id}`}
                              className="text-gray-800 font-semibold text-sm truncate"
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchTerm("");
                              }}
                            >
                              {job.title}
                            </Link>
                            {job.company && (
                              <span className="text-gray-500 text-xs mt-1 truncate">
                                {job.company}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Greeting Name */}
              <span className="text-gray-600 text-sm font-semibold">
                {user?.name?.split(" ")[0] || "User"}
              </span>

              {/* Avatar */}
              <img
                src={user.avatar || "user.png"}
                alt="avatar"
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="w-10 h-10 rounded-full border border-gray-300 object-cover hover:ring-2 hover:ring-blue-500 transition cursor-pointer"
              />

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-3 w-72 bg-white shadow-lg border rounded-lg z-50 overflow-hidden">
                  <div className="flex p-4 gap-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                    <img
                      src={user.avatar || "user.png"}
                      alt="avatar"
                      className="w-16 h-16 rounded-full border-2 border-white"
                    />
                    <div className="truncate">
                      <h3 className="font-semibold truncate">{user?.name}</h3>
                      <p className="text-sm truncate">{user?.email}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white bg-opacity-20">
                        {user.role?.charAt(0).toUpperCase() +
                          user.role.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col p-4 gap-2 bg-gray-50">
                    <Link
                      to="/profile"
                      className="text-blue-600 font-semibold text-center py-2 rounded hover:bg-blue-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogout();
                      }}
                      className="bg-red-600 text-white font-semibold rounded py-2 hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-2xl text-gray-700 ml-2"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <FaBars />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-800 px-4 py-2 rounded-lg transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-800 px-4 py-2 rounded-lg transition"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-30"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="fixed top-0 right-0 w-4/5 max-w-xs sm:max-w-sm h-full bg-white shadow-lg flex flex-col z-40 transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center px-4 py-4 border-b">
              <h2 className="text-xl font-bold text-blue-600">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col px-4 py-6 space-y-4 overflow-y-auto">
              {/* Profile Info */}
              {user && (
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow-md space-y-2">
                  <img
                    src={user.avatar || "user.png"}
                    alt="avatar"
                    className="w-16 h-16 rounded-full border-2 border-gray-300 object-cover"
                  />
                  <h3 className="font-semibold">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    {user.role?.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              )}

              {/* Mobile Search */}
              {user && (
                <div className="relative">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center w-full bg-gray-100 rounded-full px-4 py-2 shadow-sm"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search jobs..."
                      className="flex-grow bg-transparent outline-none text-sm placeholder-gray-500"
                    />
                    <button
                      type="submit"
                      className="ml-2 bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition"
                    >
                      Go
                    </button>
                  </form>
                  {results.length > 0 && (
                    <ul className="max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow divide-y divide-gray-200 mt-2 z-50">
                      {results.map((job) => (
                        <li
                          key={job._id}
                          className="px-3 py-2 hover:bg-gray-100"
                        >
                          <Link
                            to={`/jobs/${job._id}`}
                            onClick={() => setSearchTerm("")}
                            className="block text-gray-700 text-sm"
                          >
                            {job.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Links */}
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center bg-gray-100 py-2.5 rounded-lg hover:bg-gray-200 transition"
                  >
                    Dashboard
                  </Link>
                  {user.role === "freelancer" && (
                    <>
                      <Link
                        to="/jobs"
                        onClick={() => setMenuOpen(false)}
                        className="w-full text-center bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
                      >
                        Browse Jobs
                      </Link>
                      <Link
                        to="/my-proposals"
                        onClick={() => setMenuOpen(false)}
                        className="w-full text-center bg-gray-100 py-2.5 rounded-lg hover:bg-gray-200 transition"
                      >
                        My Proposals
                      </Link>
                    </>
                  )}
                  {user.role === "client" && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/post-job");
                      }}
                      className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
                    >
                      Post Job
                    </button>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center bg-gray-100 py-2.5 rounded-lg hover:bg-gray-200 transition"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
