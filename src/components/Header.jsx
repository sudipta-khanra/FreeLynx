import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
// import { NavLink } from "react-router-dom";
export default function Header() {
  // const { user, logout } = useAuth();
  const { user, logout, updateProfilePicture } = useAuth();
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // <-- ADD THIS
  const toggleSearch = () => {
    if (searchOpen) {
      // Start closing animation
      setIsClosing(true);
      // After animation ends, fully close
      setTimeout(() => {
        setIsClosing(false);
        setSearchOpen(false);
      }, 500);
    } else {
      setSearchOpen(true);
    }
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const res = await fetch(
        `/api/jobs?search=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      setResults(data.jobs); // jobs array from API

      // Keep dropdown open if there are results
      if (data.jobs.length > 0) {
        setSearchOpen(true);
      } else {
        setSearchOpen(false);
      }
    } catch (err) {
      console.error("Search error:", err);
    }
    setSearchTerm("");
  };

  // Close profile modal on outside click
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const skipEffect = useRef(false);

  useEffect(() => {
    if (skipEffect.current) {
      skipEffect.current = false;
      return;
    }

    if (!searchTerm.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `/api/jobs?search=${encodeURIComponent(searchTerm)}`
        );
        const data = await res.json();
        setResults(data.jobs || []);
        setShowDropdown(data.jobs.length > 0);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
        setShowDropdown(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const inputRef = useRef(null);

  const handleSelect = (jobId) => {
    if (inputRef.current) {
      inputRef.current.value = ""; // clear input directly
    }
    setResults([]); // clear results
    setShowDropdown(false); // close dropdown
    navigate(`/jobs/${jobId}`);
        setSearchTerm(""); // still update state

  };

  return (
    <header className="bg-white shadow-md px-4 md:px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-extrabold text-blue-600 hover:text-blue-700 transition-colors duration-200"
      >
        FreeLynx
      </Link>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center w-full max-w-5xl text-gray-700 font-medium">
        <div className={`flex gap-6 items-center ${!user ? "ml-auto" : ""}`}>
          {/* Search */}

          {user && (
            <div className="relative flex items-center">
              <button
                onClick={() => setSearchOpen((prev) => !prev)}
                aria-label="Toggle search"
                title="Search jobs"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-0 text-xl"
              >
                <FaSearch />
              </button>

              {searchOpen && (
                <div className="absolute top-1/2 right-full mr-4 transform -translate-y-1/2">
                  {/* Your exact UI */}
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center bg-white border border-gray-300 rounded-full shadow-md px-4"
                    style={{ width: 300, height: 45 }}
                  >
            
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="🔍 Search jobs by title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-grow h-6 text-sm outline-none"
                      autoFocus
                    />

                    <button
                      type="submit"
                      className="ml-3 bg-blue-600 text-white rounded-full px-3 py-1 text-sm hover:bg-blue-700 transition-colors duration-200"
                      aria-label="Search"
                    >
                      Go
                    </button>
                  </form>

                  {/* Search results dropdown */}
                  {results.length > 0 && (
                    <ul className="absolute left-0 w-full mt-2 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg divide-y divide-gray-200">
                      {results.map((job) => (
                        <li
                          key={job._id}
                          className="px-3 py-2 hover:bg-gray-100"
                        >
                        <Link
  to={`/jobs/${job._id}`}
  className="text-gray-700 text-sm block"
  onClick={() => {
    setSearchOpen(false);
    setSearchTerm(""); // Clear input
  }}
>
  {job.title}
</Link>

                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {!user && (
            <>
              <Link
                to="/login"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Register
              </Link>
            </>
          )}
          {user && (
            <>
              <Link
                to="/dashboard"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Dashboard
              </Link>
              {user.role === "freelancer" && (
                <Link
                  to="/jobs"
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Browse Jobs
                </Link>
              )}
              {user.role === "client" && (
                <button
                  onClick={() => navigate("/post-job")}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Post Job
                </button>
              )}
              {user.role === "freelancer" && (
                <Link
                  to="/my-proposals"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  My Proposals
                </Link>
              )}
            </>
          )}
        </div>
        {/* Avatar + Logout */}
        {user && (
          <div
            className="flex items-center gap-4 relative ml-auto"
            ref={menuRef}
          >
            <div className="flex items-center gap-3 select-none">
              <span className="text-gray-600 text-sm">👋 Hi,</span>
              <span className="font-semibold">
                {user?.name?.split(" ")[0] || "User"}
              </span>
              <img
                src={user.avatar || "user.png"}
                alt={user.name || "User avatar"}
                onClick={() => setShowProfileMenu((prev) => !prev)}
                title="User menu"
                className="w-10 h-10 rounded-full object-cover border border-gray-300 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 hover:ring-2 hover:ring-blue-500 hover:ring-offset-2"
              />
            </div>
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden animate-fadeIn">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                  <img
                    src={user.avatar || "user.png"}
                    alt={user.name || "User avatar"}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="truncate">
                    <h3 className="text-lg font-semibold truncate">
                      {user?.name || "User"}
                    </h3>
                    <p className="text-sm truncate">
                      {user?.email || "No email"}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-white bg-opacity-20 rounded-full">
                      {user?.role
                        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                        : "Role"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col p-4 bg-gray-50 space-y-3">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="text-center text-blue-600 font-semibold hover:bg-blue-100 rounded-md py-2 transition"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="text-center bg-red-600 text-white font-semibold rounded-md py-2 hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-2xl text-gray-700 ml-auto"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
      {/* Mobile Navigation Drawer */}
      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-6 space-y-4 md:hidden z-40">
          {!user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
          {user && (
            <>
              {/* Profile Block */}
              <div className="flex flex-col items-center space-y-2 pb-4 border-b border-gray-200 w-full">
                <img
                  src={user.avatar || "user.png"}
                  alt={user.name || "User avatar"}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                />
                <h3 className="font-semibold">{user?.name || "User"}</h3>
                <p className="text-sm text-gray-500">
                  {user?.email || "No email"}
                </p>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  {user?.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : "Role"}
                </span>
              </div>
              {/* Links */}
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              {user.role === "freelancer" && (
                <Link to="/jobs" onClick={() => setMenuOpen(false)}>
                  Browse Jobs
                </Link>
              )}
              {user.role === "client" && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/post-job");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Post Job
                </button>
              )}
              {user.role === "freelancer" && (
                <Link to="/my-proposals" onClick={() => setMenuOpen(false)}>
                  My Proposals
                </Link>
              )}
              {/* Profile Options */}
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="text-blue-600 font-semibold"
              >
                View Profile
              </Link>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
