import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaRocketchat, FaCheckCircle, FaUsers } from "react-icons/fa";
import HeroModal from "../assets/HeroModal.png";
import Register from "../pages/Register"; // ✅ Make sure the path is correct!

function Hero() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative bg-gradient-to-r from-green-100 via-emerald-50 to-lime-200 min-h-screen py-24 px-6 md:px-20 pt-[100px] font-sans overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-green-200 via-lime-100 to-emerald-100 -z-10 opacity-30 blur-3xl animate-pulse top-10 left-1/2 -translate-x-1/2" />

      {/* MAIN CONTENT */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto">
        {/* LEFT - TEXT SECTION */}
        <div className="max-w-xl text-center md:text-left space-y-6">
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Chat Should Feel Like a Place, <br />
            <span className="text-green-600">Not Just a Message</span>
          </motion.h1>

          <motion.p
            className="text-gray-700 text-base md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Connect, communicate, and create bonds — all in a vibe-filled virtual space.
          </motion.p>

          {/* Feature Tags */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4">
            {["Fast", "Secure", "Realtime", "No Ads"].map((tag, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm shadow"
                whileHover={{ scale: 1.05 }}
              >
                <FaCheckCircle className="text-green-500" />
                {tag}
              </motion.div>
            ))}
          </div>

          {/* CTA Button + Live Badge */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 mt-6"
            whileHover={{ scale: 1.02 }}
          >
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-all flex items-center gap-2"
            >
              <FaRocketchat /> Start Chatting Now
            </button>
            <div className="flex items-center text-sm gap-2 text-green-700">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <FaUsers className="text-green-500" />
              <span className="font-medium">1.4k+ online now</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT - IMAGE SECTION */}
        <motion.div
          className="relative mt-12 md:mt-0"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={HeroModal}
            alt="Chat Hero"
            className="w-[300px] md:w-[350px] mx-auto hover:scale-105 transition-all duration-300"
          />

          {/* Chat Bubble 1 */}
          <div className="absolute -top-4 right-4 bg-white px-4 py-2 shadow-xl rounded-2xl flex items-center gap-2 text-sm">
            <img
              src="https://randomuser.me/api/portraits/women/75.jpg"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <span>
              Gravida Libero Eu, <br /> Luctus Ipsum. Aliquam
            </span>
          </div>

          {/* Chat Bubble 2 */}
          <div className="absolute -bottom-6 left-0 bg-green-600 text-white px-4 py-2 shadow-xl rounded-2xl flex items-center gap-2 text-sm">
            <img
              src="https://randomuser.me/api/portraits/men/12.jpg"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <span>Aliquam Non Pulvinar Ex.</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Cue */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-green-700 text-xs animate-bounce"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        ↓ Scroll to discover more
      </motion.div>

      {/* Modal */}
      {showModal && <Register closeModal={() => setShowModal(false)} />}
    </div>
  );
}

export default Hero;
