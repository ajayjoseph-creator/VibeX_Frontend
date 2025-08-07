import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "../api/axiosInstance";
import Logo from "../assets/VibeX.png";
import LoginImage from "../assets/Vibex_Login_Page_image.png";

// ✅ Validation Schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .transform((value) => value?.toLowerCase()), // 🔥 lowercase only after validation
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function LoginPage({ closeModal, switchToRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/users/login", data);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      closeModal?.();
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);

      // Show forgot password only if password issue
      if (msg.toLowerCase().includes("password")) {
        setShowForgotPassword(true);
      }
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
    <div className="w-full min-h-screen flex items-center justify-center bg-white px-4 py-6">
      <div className="w-full max-w-4xl aspect-[3/2] bg-white shadow-2xl border border-gray-200 rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 relative h-52 md:h-full">
          <img
            src={LoginImage}
            alt="Login Poster"
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
            {/* Logo & Text */}
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
                Welcome Back!
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Sign in to vibe with us
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                 
                  autoComplete="email"
                  className="w-full px-4 pt-5 pb-2 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer"
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

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  
                  autoComplete="current-password"
                  className="w-full px-4 pt-5 pb-2 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer"
                />
                <label className="absolute left-4 top-3 text-gray-500 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-500">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
                {/* ✅ Forgot Password link (only on password error) */}
                {showForgotPassword && (
                  <p
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-blue-500 hover:underline mt-2 cursor-pointer"
                  >
                    Forgot your password?
                  </p>
                )}
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">or</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed")}
                theme="outline"
                size="large"
                text="signin_with"
                width="100%"
              />
            </div>

            {/* Register Link */}
            <div className="mt-4 text-center">
              <button
                onClick={switchToRegister}
                className="text-sm text-gray-600 hover:text-green-500 transition duration-200"
              >
                Don’t have an account?{" "}
                <span
                  className="underline font-medium cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Register here
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
