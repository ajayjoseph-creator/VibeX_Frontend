import React, { use, useState } from "react";
import { motion } from "framer-motion";
import Logo from "../assets/VibeX.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Register({ closeModal, switchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [otpStage, setOtpStage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate=useNavigate()
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      return toast.warning("⚠️ Please fill all fields.");
    }
    if (password !== confirmPassword) {
      return toast.error("❌ Passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/users/send-otp", {
        email,
      });

      if (res.data.success) {
        toast.success("📨 OTP sent to your email.");
        setOtpStage(true);
      } else {
        toast.error("❌ Failed to send OTP.");
      }
    } catch (err) {
      console.error("Send OTP Error:", err);
      toast.error("❌ Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return toast.error("❌ Please enter a valid 6-digit OTP.");
    }

    try {
      setLoading(true);
      // 1️⃣ Verify OTP
      const otpRes = await axios.post("http://localhost:5000/api/users/verify-otp", {
        email: form.email,
        otp,
      });

      if (otpRes.data.success) {
        // 2️⃣ Register User
        const registerRes = await axios.post("http://localhost:5000/api/users/register", {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        if (registerRes.data.success) {
          toast.success("✅ Registered successfully!");
          navigate('/login')
          switchToLogin?.();
        } else {
          toast.error("❌ Registration failed.");
        }
      } else {
        toast.error("❌ Invalid OTP.");
      }
    } catch (err) {
      console.error("Register Error:", err);
      toast.error("❌ Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/users/send-otp", {
        email: form.email,
      });
      if (res.data.success) {
        toast.success("📨 OTP resent to your email.");
      } else {
        toast.error("❌ Failed to resend OTP.");
      }
    } catch (err) {
      console.error("Resend OTP Error:", err);
      toast.error("❌ Failed to resend OTP.");
    } finally {
      setLoading(false);
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
        aria-labelledby="register-title"
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition"
          aria-label="Close modal"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

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
          
          <p className="text-sm text-gray-200/80 mt-1">
            Create your account to start vibing
          </p>
        </div>

        {!otpStage ? (
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            <Input
              type="text"
              name="name"
              value={form.name}
              placeholder="Full Name"
              onChange={handleChange}
              label="Full Name"
              autoComplete="name"
            />
            <Input
              type="email"
              name="email"
              value={form.email}
              placeholder="Email"
              onChange={handleChange}
              label="Email Address"
              autoComplete="email"
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                placeholder="Password"
                onChange={handleChange}
                label="Password"
                autoComplete="new-password"
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
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                placeholder="Confirm Password"
                onChange={handleChange}
                label="Confirm Password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send OTP"
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
                  Sending OTP...
                </>
              ) : (
                "📨 Send OTP"
              )}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <Input
              type="text"
              name="otp"
              value={otp}
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              label="OTP from Email"
              maxLength={6}
              autoComplete="one-time-code"
            />
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Verify and Register"
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
                  Verifying...
                </>
              ) : (
                "✅ Verify & Register"
              )}
            </motion.button>
            <button
              onClick={handleResendOtp}
              disabled={loading}
              className="text-sm text-white/80 hover:text-green-400 transition"
              aria-label="Resend OTP"
            >
              Resend OTP
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={switchToLogin}
            className="text-sm text-white/80 hover:text-green-400 transition duration-200"
            aria-label="Switch to login"
          >
            Already have an account?{" "}
            <span className="underline font-medium cursor-pointer" onClick={()=>navigate('/login')}>Login</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Input({ type, name, value, placeholder, onChange, autoComplete, maxLength, label }) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete={autoComplete}
        maxLength={maxLength}
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

export default Register;