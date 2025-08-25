import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Validation schema using Yup
const schema = yup.object({
  title: yup.string().required("Job title is required"),
  description: yup
    .string()
    .min(20, "At least 20 characters")
    .required("Description is required"),
  budget: yup
    .number()
    .min(1, "Budget must be positive")
    .required("Budget is required"),
  deadline: yup.date().required("Deadline is required"),
  category: yup.string().required("Category is required"),
});

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "client") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

const onSubmit = async (data) => {
  if (!user) return; // safety check
  setIsSubmitting(true);
  try {
    // Add postedBy field
    const payload = { ...data, postedBy: user._id };

    const response = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`, // auth token
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Failed to post job");
    }

    const result = await response.json();
    alert("Job posted successfully!");
    navigate("/dashboard");
  } catch (error) {
    console.error("❌ Job post failed:", error.message);
    alert(`Job post failed: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-600">
        Post a Job
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Title */}
        <div className="mb-6">
          <label
            className="block mb-2 font-semibold text-gray-700"
            htmlFor="title"
          >
            Job Title
          </label>
          <input
            {...register("title")}
            id="title"
            type="text"
            placeholder="e.g. Build a landing page"
            className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            className="block mb-2 font-semibold text-gray-700"
            htmlFor="description"
          >
            Job Description
          </label>
          <textarea
            {...register("description")}
            id="description"
            rows={6}
            placeholder="Describe the project in detail..."
            className={`w-full px-4 py-3 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Budget and Deadline in one row */}
        <div className="mb-6 flex flex-col sm:flex-row sm:space-x-6">
          {/* Budget */}
          <div className="flex-1 mb-6 sm:mb-0">
            <label
              className="block mb-2 font-semibold text-gray-700"
              htmlFor="budget"
            >
              Budget ($)
            </label>
            <input
              {...register("budget")}
              id="budget"
              type="number"
              placeholder="Enter budget"
              className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.budget ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.budget && (
              <p className="text-red-600 text-sm mt-1">
                {errors.budget.message}
              </p>
            )}
          </div>

          {/* Deadline */}
          <div className="flex-1">
            <label
              className="block mb-2 font-semibold text-gray-700"
              htmlFor="deadline"
            >
              Deadline
            </label>
            <input
              {...register("deadline")}
              id="deadline"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.deadline ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.deadline && (
              <p className="text-red-600 text-sm mt-1">
                {errors.deadline.message}
              </p>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="mb-8">
          <label
            className="block mb-2 font-semibold text-gray-700"
            htmlFor="category"
          >
            Category
          </label>
          <select
            {...register("category")}
            id="category"
            className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select category</option>
            <option value="web">Web Development</option>
            <option value="design">UI/UX Design</option>
            <option value="mobile">Mobile Apps</option>
            <option value="writing">Content Writing</option>
            <option value="marketing">Digital Marketing</option>
            <option value="seo">SEO</option>
            <option value="data_entry">Data Entry</option>
            <option value="customer_support">Customer Support</option>
            <option value="video_editing">Video Editing</option>
            <option value="animation">Animation</option>
            <option value="software_dev">Software Development</option>
            <option value="devops">DevOps</option>
            <option value="translation">Translation</option>
            <option value="finance">Finance & Accounting</option>
            <option value="legal">Legal Consulting</option>
            <option value="other">Other</option>
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-md text-white font-semibold transition ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
