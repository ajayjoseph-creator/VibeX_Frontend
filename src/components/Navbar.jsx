import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHome, FaSearch, FaCompass, FaVideo, FaHeart,
  FaPlus, FaChartBar, FaUser, FaStream, FaBars, FaTimes
} from "react-icons/fa";
import Logo from "../assets/VibeX.png";
import { motion } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId && token) {
      axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => {
        setUser(res.data.data);
      }).catch(err => console.log(err));
    }
  }, [userId, token]);

  const navItems = [
    { name: "Home", icon: <FaHome />,action:()=>navigate('/') },
    { name: "Search", icon: <FaSearch />, action:()=>navigate('/search') },
    { name: "Explore", icon: <FaCompass /> },
    { name: "Reels", icon: <FaVideo /> ,  action: () => navigate("/reels")},
    { name: "Messages", icon: <FaStream />, badge: 2 },
    { name: "Notifications", icon: <FaHeart />, badgeDot: true },
    { name: "Create", icon: <FaPlus />, action: () => navigate("/upload_reel") },
    { name: "Dashboard", icon: <FaChartBar /> },
    { name: "Profile", icon: <FaUser />, action: () => navigate(`/profile/${user?._id}`) },
    { name: "More", icon: <FaBars /> },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8 px-2"
      >
        <img
          src={Logo}
          alt="Your Logo"
          className="h-10 w-auto object-contain cursor-pointer"
          onClick={() => {
            navigate("/");
            if (isMobile) setShowMobileSidebar(false);
          }}
        />
        {isMobile && (
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="text-2xl"
          >
            <FaTimes />
          </button>
        )}
      </motion.div>

      {/* Nav Items */}
      <div className="flex flex-col gap-4">
        {navItems.map(({ name, icon, badge, badgeDot, action }, idx) => (
          <div
            key={idx}
            onClick={() => {
              action?.();
              if (isMobile) setShowMobileSidebar(false);
            }}
            className="relative flex items-center gap-4 text-lg px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition"
          >
            <span className="text-xl">{icon}</span>
            <span className={`md:inline ${isMobile ? "hidden" : "hidden md:inline"}`}>{name}</span>
            {badge && (
              <span className="absolute top-1 left-5 text-xs bg-red-600 text-white px-1.5 rounded-full">
                {badge}
              </span>
            )}
            {badgeDot && (
              <span className="absolute top-2 left-6 w-2 h-2 bg-red-600 rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* User Section */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        {user ? (
          // ✅ User is logged in
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img
              src={user.avatar || user.profileImage || "https://placehold.co/100x100"}
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-green-500 object-cover"
            />
            <div>
              <p className={`font-semibold text-sm md:inline ${isMobile ? "hidden" : "hidden md:inline"}`}>
                {user.username || user.name}
              </p>
            </div>
          </div>
        ) : (
          // ❌ Not logged in
          <div className="flex flex-col gap-2 px-3 py-2">
            <button
              onClick={() => {
                navigate("/login");
                if (isMobile) setShowMobileSidebar(false);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Login
            </button>
            {/* Optional: Register Button */}
            {/* <button
              onClick={() => navigate("/register")}
              className="text-sm text-green-600 hover:underline"
            >
              Register
            </button> */}
          </div>
        )}

        {showDropdown && user && (
          <div className="absolute bottom-20 bg-white text-black rounded-md shadow-md w-48 py-2">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              Profile
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate('/');
                setUser(null);
                setShowDropdown(false);
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 🖥️ Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white text-black shadow-md z-50 px-4 py-6">
        <SidebarContent />
      </div>

      {/* 📱 Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowMobileSidebar(true)}
          className="text-2xl bg-white shadow-md rounded-full p-2"
        >
          <FaBars />
        </button>
      </div>

      {/* 📱 Mobile Sidebar */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="fixed top-0 left-0 h-full w-20 bg-white px-2 py-6 z-50 shadow-lg">
            <SidebarContent isMobile />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
