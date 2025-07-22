import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../assets/VibeX.png";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login({ closeModal, switchToRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 🛡️ Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.warning("⚠️ Please fill in all fields.");
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/users/login", form);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      toast.success("Login successful!");
      closeModal?.();
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axiosInstance.post("/users/google-login", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      toast.success("Google login successful!");
      closeModal?.();
      navigate("/");
    } catch (err) {
      toast.error("Google login failed");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-3xl bg-white/30 backdrop-blur-lg shadow-xl p-8 md:p-10 border border-white/20"
      >
        {/* Logo and Heading */}
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="VibeX Logo" className="h-10" />
          <h1 className="text-2xl font-bold text-white mt-2">Welcome Back!</h1>
          <p className="text-sm text-gray-200">Login to continue your vibe</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-white/70 hover:text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Google Login Button */}
        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed")}
          />
        </div>

        {/* Switch to Register */}
        <div className="mt-6 text-center">
          <button
            onClick={switchToRegister}
            className="text-sm text-white/80 hover:text-green-400 transition"
          >
            Don’t have an account? <span className="underline">Register here</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// 🔧 Reusable Input Component
function Input({ type, name, value, placeholder, onChange, autoComplete }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={onChange}
      required
      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
    />
  );
}

export default Login;

