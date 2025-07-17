import React, { useState } from "react";
import { motion } from "framer-motion";
import Logo from "../assets/VibeX.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword)
      return alert("⚠️ Please fill all fields.");
    if (password !== confirmPassword)
      return alert("❌ Passwords do not match.");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/users/send-otp", {
        email,
      });

      if (res.data.success) {
        alert("📨 OTP sent to your email.");
        setOtpStage(true);
      } else {
        alert("❌ Failed to send OTP.");
      }
    } catch (err) {
      console.error("Send OTP Error:", err);
      alert("❌ Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6)
      return alert("❌ Please enter a valid 6-digit OTP.");

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
          alert("✅ Registered successfully!");
          switchToLogin?.();
        } else {
          alert("❌ Registration failed.");
        }
      } else {
        alert("❌ Invalid OTP.");
      }
    } catch (err) {
      console.error("Register Error:", err);
      alert("❌ Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/30 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 md:p-10"
      >
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="logo" className="h-10" />
          <h1 className="text-2xl font-bold text-white mt-2">Join VibeX</h1>
          <p className="text-sm text-gray-200">Create your account below</p>
        </div>

        {!otpStage ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <Input type="text" name="name" value={form.name} placeholder="Full Name" onChange={handleChange} />
            <Input type="email" name="email" value={form.email} placeholder="Email" onChange={handleChange} />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                placeholder="Password"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-white/70"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                placeholder="Confirm Password"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3 text-white/70"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Sending OTP..." : "📨 Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <Input
              type="text"
              name="otp"
              value={otp}
              placeholder="Enter OTP from email"
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength={6}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Verifying..." : "✅ Verify & Register"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={switchToLogin}
            className="text-sm text-white/80 hover:text-green-400 transition"
          >
            Already have an account? <span className="underline">Login</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Input({ type, name, value, placeholder, onChange, autoComplete, maxLength }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      autoComplete={autoComplete}
      maxLength={maxLength}
      required
      className="w-full px-4 py-3 pr-10 rounded-xl bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
    />
  );
}

export default Register;
