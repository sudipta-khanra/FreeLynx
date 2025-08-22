import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const schema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const onSubmit = async (data) => {
    try {
      setApiError("");
      const res = await loginUser(data);
      login({ ...res.user, token: res.token });
      navigate("/");
    } catch (err) {
      setApiError(err?.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-wide">
        Welcome Back
      </h2>

      {apiError && (
        <div className="mb-6 px-4 py-3 bg-red-100 text-red-700 rounded-lg text-center font-medium shake">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="block mb-2 font-semibold text-gray-700" htmlFor="email">
          Email Address
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? "true" : "false"}
          className={`w-full mb-4 px-4 py-3 rounded-lg border text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mb-4 text-red-600 text-sm font-medium shake">{errors.email.message}</p>
        )}

        <label className="block mb-2 font-semibold text-gray-700" htmlFor="password">
          Password
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? "true" : "false"}
          className={`w-full mb-6 px-4 py-3 rounded-lg border text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Your password"
        />
        {errors.password && (
          <p className="mb-6 text-red-600 text-sm font-medium shake">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-xl text-white text-lg font-semibold transition ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          } shadow-lg`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
