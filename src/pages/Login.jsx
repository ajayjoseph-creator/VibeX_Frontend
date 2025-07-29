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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/60 to-blue-900/60 backdrop-blur-md px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl bg-white/20 backdrop-blur-xl shadow-2xl p-6 md:p-8 border border-white/10"
        role="dialog"
        aria-labelledby="login-title"
      >
        {/* Logo and Heading */}
        <div className="flex flex-col items-center mb-6">
          <motion.img
            src={Logo}
            alt="VibeX Logo"
            className="h-12 w-auto"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <h1
            id="login-title"
            className="text-3xl font-bold text-white mt-3 tracking-tight"
          >
            Welcome Back!
          </h1>
          <p className="text-sm text-gray-200/80 mt-1">
            Sign in to vibe with us
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            autoComplete="email"
            label="Email Address"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="current-password"
              label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Login"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-white/20"></div>
          <span className="mx-4 text-sm text-white/60">or</span>
          <div className="flex-grow h-px bg-white/20"></div>
        </div>

        {/* Google Login Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed")}
            theme="filled_blue"
            size="large"
            text="signin_with"
            width="100%"
          />
        </div>

        {/* Switch to Register */}
        <div className="mt-6 text-center">
          <button
            onClick={switchToRegister}
            className="text-sm text-white/80 hover:text-green-400 transition duration-200"
            aria-label="Switch to register"
          >
            Don’t have an account?{" "}
            <span className="underline font-medium cursor-pointer" onClick={()=>navigate('/register')}>Register here</span>
            
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// 🔧 Reusable Input Component with Floating Label
function Input({ type, name, value, placeholder, onChange, autoComplete, label }) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={onChange}
        required
        className="w-full px-4 pt-5 pb-2 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer"
        id={name}
        aria-label={label}
      />
      <label
        htmlFor={name}
        className="absolute left-4 top-3 text-white/60 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-400"
      >
        {label}
      </label>
    </div>
  );
}

export default Login;