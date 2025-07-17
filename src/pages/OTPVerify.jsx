import React, { useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";

function OTPVerify({ closeModal }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      return alert("📱 Enter a valid phone number");
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/users/send-otp", { phone });
      if (res.data.success) {
        setOtpSent(true);
        alert(`📨 OTP sent to ${phone}`);
      } else {
        alert("❌ Failed to send OTP");
      }
    } catch (err) {
      alert("❌ Error sending OTP");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return alert("❌ Enter a valid 6-digit OTP");
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/users/verify-otp", { phone, otp });

      if (res.data.success) {
        alert("✅ OTP Verified Successfully");
        closeModal?.();
      } else {
        alert("❌ Invalid OTP");
      }
    } catch (err) {
      alert("❌ Error verifying OTP");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-3xl bg-white/20 backdrop-blur-lg shadow-xl p-8 md:p-10 border border-white/30 text-center"
      >
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-green-600 mb-2">
          {otpSent ? "Enter OTP" : "Phone Verification"}
        </h2>
        <p className="text-sm text-white/80 mb-6">
          {otpSent
            ? `OTP sent to ${phone}`
            : "Enter your phone number to receive OTP"}
        </p>

        {/* Phone Form or OTP Form */}
        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength="10"
              placeholder="Enter 10-digit phone number"
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 text-center text-lg tracking-wide"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Sending OTP..." : "📨 Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 text-center text-lg tracking-widest"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Verifying..." : "✅ Verify OTP"}
            </button>
          </form>
        )}

        {/* Cancel Button */}
        <button
          onClick={closeModal}
          className="mt-6 text-sm text-white/70 hover:text-red-400 transition"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}

export default OTPVerify;
