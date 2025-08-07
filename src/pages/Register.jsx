import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Logo from "../assets/VibeX.png";
import RegisterImage from "../assets/Vibex_Login_Page_image.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[A-Z][a-zA-Z ]*$/, "First letter must be capital"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});


function Register({ closeModal, switchToLogin }) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [otpStage, setOtpStage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmitInitial = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/users/send-otp", {
        email: data.email,
      });
      if (res.data.success) {
        toast.success("📨 OTP sent to your email.");
        setOtpStage(true);
      } else {
        toast.error("❌ Failed to send OTP.");
      }
    } catch (err) {
      toast.error("❌ Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async () => {
    const data = getValues();
    if (!otp || otp.length !== 6) {
      return toast.error("❌ Enter a valid 6-digit OTP");
    }

    try {
      setLoading(true);
      const verify = await axios.post("http://localhost:5000/api/users/verify-otp", {
        email: data.email,
        otp,
      });
      if (!verify.data.success) return toast.error("❌ Invalid OTP");

      const registerRes = await axios.post("http://localhost:5000/api/users/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (registerRes.data.success) {
        toast.success("✅ Registered successfully");
        switchToLogin?.();
        navigate("/login");
      } else {
        toast.error("❌ Registration failed");
      }
    } catch (err) {
      toast.error("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white px-4 py-6">
      <div className="w-full max-w-4xl aspect-[3/2] bg-black/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-black/10 flex flex-col md:flex-row">
        {/* Left Side */}
        <div className="w-full md:w-1/2 relative h-52 md:h-full">
          <img
            src={RegisterImage}
            alt="Register Poster"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Right Side */}
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
              <h1 className="text-2xl font-bold text-black mt-3">Create Account</h1>
              <p className="text-sm text-black/60 mt-1">Start vibing with us</p>
            </div>

            {!otpStage ? (
              <form onSubmit={handleSubmit(onSubmitInitial)} className="space-y-5">
                <Input name="name" type="text" label="Full Name" register={register} error={errors.name} />
                <Input name="email" type="email" label="Email Address" register={register} error={errors.email} />
                <PasswordInput
                  name="password"
                  label="Password"
                  register={register}
                  error={errors.password}
                  show={showPassword}
                  setShow={setShowPassword}
                />
                <PasswordInput
                  name="confirmPassword"
                  label="Confirm Password"
                  register={register}
                  error={errors.confirmPassword}
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl transition duration-300 disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : "📨 Send OTP"}
                </motion.button>
              </form>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); onSubmitOtp(); }} className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength={6}
                    className="w-full px-4 pt-5 pb-2 rounded-xl bg-white text-black placeholder-black/50 border border-black/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer"
                  />
                  <label className="absolute left-4 top-3 text-black/60 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-400">
                    OTP from Email
                  </label>
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl transition duration-300 disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "✅ Verify & Register"}
                </motion.button>
              </form>
            )}

            <div className="mt-4 text-center">
              <button
                onClick={()=>navigate('/login')}
                className="text-sm text-black/80 hover:text-green-600 transition"
              >
                Already have an account? <span className="underline">Login</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Input({ name, type, label, register, error }) {
  return (
    <div className="relative">
      <input
        type={type}
        {...register(name)}
        
        className="w-full px-4 pt-5 pb-2 rounded-xl bg-white text-black placeholder-black/50 border border-black/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer"
      />
      <label className="absolute left-4 top-3 text-black/60 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-400">
        {label}
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

function PasswordInput({ name, label, register, error, show, setShow }) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        {...register(name)}
        
        className="w-full px-4 pt-5 pb-2 rounded-xl bg-white text-black placeholder-black/50 border border-black/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer"
      />
      <label className="absolute left-4 top-3 text-black/60 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-400">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
      >
        {show ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

export default Register;