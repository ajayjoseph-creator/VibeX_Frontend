import React, { useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";
import PhoneImage from "../assets/OTP_verification.jpg"; // Make sure this image exists

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-10"
      >
        {/* Left Image Section */}
        <div className="w-full md:w-1/2">
          <img
            src={PhoneImage}
            alt="OTP Illustration"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-extrabold text-green-600 mb-2">
            {otpSent ? "Enter OTP" : "Phone Verification"}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {otpSent
              ? `OTP sent to ${phone}`
              : "Enter your phone number to receive OTP"}
          </p>

          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                maxLength="10"
                placeholder="Enter 10-digit phone number"
                className="w-full px-5 py-3 rounded-xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-center text-lg tracking-wide"
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
                className="w-full px-5 py-3 rounded-xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-center text-lg tracking-widest"
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

          <button
            onClick={closeModal}
            className="mt-6 text-sm text-gray-500 hover:text-red-500 transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default OTPVerify;
