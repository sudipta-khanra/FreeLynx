import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "../services/authService"; // adjust path
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    skills: [],
    portfolio: [],
    experience: "",
    role: "freelancer",
  });

  const [skillInput, setSkillInput] = useState("");
  const [portfolioInput, setPortfolioInput] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Skill handlers
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
    }
    setSkillInput("");
  };
  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  // ✅ Portfolio handlers
  // const addPortfolio = () => {
  //   if (
  //     portfolioInput.trim() &&
  //     !formData.portfolio.includes(portfolioInput.trim())
  //   ) {
  //     setFormData({
  //       ...formData,
  //       portfolio: [...formData.portfolio, portfolioInput.trim()],
  //     });
  //   }
  //   setPortfolioInput("");
  // };
  const addPortfolio = () => {
    if (!portfolioInput.trim()) return;

    const newUrls = portfolioInput
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url);

    setFormData((prev) => ({
      ...prev,
      portfolio: [...new Set([...prev.portfolio, ...newUrls])],
    }));

    setPortfolioInput(""); // Clear input
  };

  const removePortfolio = (link) => {
    setFormData({
      ...formData,
      portfolio: formData.portfolio.filter((p) => p !== link),
    });
  };

  // ✅ Submit handler
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (formData.password !== formData.confirmPassword) {
  //     alert("Passwords do not match!");
  //     return;
  //   }

  //   try {
  //     const res = await registerUser(formData);
  //     console.log("Registered:", res);
  //     alert("Registration successful ✅");
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     alert(error.message);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Convert portfolio array to comma-separated string
    const dataToSend = {
      ...formData,
      portfolio: formData.portfolio.join(", "),
    };

    try {
      const res = await registerUser(dataToSend);
      console.log("Registered:", res);
      alert("Registration successful ✅");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-5"
    >
      <h2 className="text-2xl font-bold text-center">Register</h2>

      {/* Name */}
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded-xl"
      />

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded-xl"
      />

      {/* Password */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-xl"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-xl"
        />
      </div>

      {/* Bio */}
      <textarea
        name="bio"
        placeholder="Write a short bio..."
        value={formData.bio}
        onChange={handleChange}
        className="w-full p-3 border rounded-xl"
        rows="3"
      />

      {/* Role */}
      <div>
        <label className="block text-sm font-semibold mb-1">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        >
          <option value="freelancer">Freelancer</option>
          <option value="client">Client</option>
        </select>
      </div>

      {/* Skills (conditional for freelancer) */}
      {formData.role === "freelancer" && (
        <>
          <div>
            <label className="block text-sm font-semibold mb-1">Skills</label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-xl bg-gray-50">
              <AnimatePresence>
                {formData.skills.map((skill, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>
                      <X size={14} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                  placeholder="Add a skill"
                  className="border-none outline-none p-1 text-sm w-32"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="p-1 bg-blue-500 text-white rounded-full"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Portfolio
            </label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-xl bg-gray-50">
              <AnimatePresence>
                {formData.portfolio.map((link, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                  >
                    {link}
                    <button type="button" onClick={() => removePortfolio(link)}>
                      <X size={14} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>

              <div className="flex items-center gap-1">
                <input
                  type="url"
                  value={portfolioInput}
                  onChange={(e) => setPortfolioInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addPortfolio())
                  }
                  placeholder="Add portfolio link"
                  className="border-none outline-none p-1 text-sm w-40"
                />
                <button
                  type="button"
                  onClick={addPortfolio}
                  className="p-1 bg-green-500 text-white rounded-full"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Experience
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            >
              <option value="">Select Experience</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="5">5+ years</option>
            </select>
          </div>
        </>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        Register
      </button>
    </form>
  );
}
