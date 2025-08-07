import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/VibeX.png";
import ForgotImage from "../assets/Forgot password.jpg";

const step1Schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const step2Schema = yup.object().shape({
  email: yup.string().email().required(),
  otp: yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
  newPassword: yup.string().min(6, "Min 6 characters").required("New password is required"),
});

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1 = Email, Step 2 = OTP + New Password
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(step === 1 ? step1Schema : step2Schema),
    defaultValues: { email: "" },
  });

  const emailValue = watch("email");

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (step === 1) {
        const res = await axios.post("http://localhost:5000/api/users/send-otp", {
          email: data.email,
        });

        if (res.data.success) {
          toast.success("OTP sent to your email");
          setStep(2); // Show OTP + new password form
        } else {
          toast.error(res.data.message || "❌ Failed to send OTP");
        }
      } else if (step === 2) {
        const res = await axios.post("http://localhost:5000/api/users/reset-password", {
          email: data.email,
          otp: data.otp,
          newPassword: data.newPassword,
        });

        if (res.data.success) {
          toast.success("✅ Password reset successful");
          navigate("/login");
        } else {
          toast.error(res.data.message || "❌ Reset failed");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white px-4 py-6">
      <div className="w-full max-w-4xl aspect-[3/2] bg-white shadow-2xl border border-gray-200 rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 relative h-52 md:h-full">
          <img
            src={ForgotImage}
            alt="Forgot Password"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-5 md:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            <div className="flex flex-col items-center mb-6">
              <motion.img
                src={Logo}
                alt="VibeX Logo"
                className="h-12 w-auto"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <h1 className="text-2xl font-bold text-gray-800 mt-3 tracking-tight">
                {step === 1 ? "Forgot your password?" : "Reset your password"}
              </h1>
              <p className="text-sm text-gray-500 mt-1 text-center">
                {step === 1
                  ? "Enter your email to receive OTP"
                  : "Enter OTP and your new password"}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Email"
                  disabled={step === 2}
                  className="w-full px-4 pt-5 pb-2 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer disabled:opacity-70"
                />
                <label className="absolute left-4 top-3 text-gray-500 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-500">
                  Email Address
                </label>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Show OTP + New Password fields only on Step 2 */}
              {step === 2 && (
                <>
                  {/* OTP */}
                  <div className="relative">
                    <input
                      type="text"
                      {...register("otp")}
                      placeholder="Enter OTP"
                      className="w-full px-4 pt-5 pb-2 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer"
                    />
                    <label className="absolute left-4 top-3 text-gray-500 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-500">
                      OTP
                    </label>
                    {errors.otp && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.otp.message}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <input
                      type="password"
                      {...register("newPassword")}
                      placeholder="New Password"
                      className="w-full px-4 pt-5 pb-2 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer"
                    />
                    <label className="absolute left-4 top-3 text-gray-500 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-500">
                      New Password
                    </label>
                    {errors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? step === 1
                    ? "Sending OTP..."
                    : "Resetting..."
                  : step === 1
                  ? "Send OTP"
                  : "Reset Password"}
              </motion.button>
            </form>

            {/* Back to login */}
            <div className="mt-5 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 hover:text-green-500 transition duration-200"
              >
                Remembered your password?{" "}
                <span className="underline font-medium cursor-pointer">
                  Back to login
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
