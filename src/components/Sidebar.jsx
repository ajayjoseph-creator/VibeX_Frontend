import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaCompass,
  FaVideo,
  FaHeart,
  FaPlus,
  FaChartBar,
  FaUser,
  FaStream,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import Logo from "../assets/VibeX.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // For mobile toggle
  const [hovered, setHovered] = useState(false); // For desktop hover
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId && token) {
      setUser({
        _id: userId,
        username: "admin",
        avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      });
    }
  }, [userId, token]);

  const navLinks = useMemo(
    () => [
      { label: "Dashboard", icon: <FaHome />, to: "/admin/dashboard" },
      { label: "Search", icon: <FaSearch />, to: "/search" },
      { label: "Explore", icon: <FaCompass />, to: "/admin/explore" },
      { label: "Reels", icon: <FaVideo />, to: "/reels" },
      { label: "Messages", icon: <FaStream />, to: "/admin/messages" },
      { label: "Notifications", icon: <FaHeart />, to: "/admin/notifications" },
      { label: "Upload", icon: <FaPlus />, to: "/upload_reel" },
      { label: "Analytics", icon: <FaChartBar />, to: "/admin/analytics" },
      { label: "Profile", icon: <FaUser />, to: `/profile/${userId}` },
      { label: "Settings", icon: <FaCog />, to: "/admin/settings" },
    ],
    [userId]
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-[#333] p-2 rounded-full"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ width: 64 }}
        animate={{ width: isOpen || hovered ? 256 : 64 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`fixed top-0 left-0 z-50 bg-[#1f1f1f] text-white h-screen py-6 px-2 flex flex-col justify-between transition-colors duration-300 ${
          isOpen ? "block md:w-64" : "block md:w-16"
        } md:block`}
      >
        {/* Logo */}
        <div className="mb-6 px-2 flex justify-center">
          <motion.div
            className="cursor-pointer"
            onClick={() => navigate("/")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {(isOpen || hovered) ? (
                <motion.img
                  key="logo"
                  src={Logo}
                  alt="VibeX Logo"
                  className="h-8 object-contain"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.span
                  key="icon"
                  className="text-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  🔥
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col space-y-2">
          {navLinks.map(({ label, icon, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  isActive ? "bg-[#333] text-green-400" : "hover:bg-[#2a2a2a]"
                }`
              }
              role="link"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(to)}
            >
              <span className="text-lg">{icon}</span>
              {(isOpen || hovered) && (
                <motion.span
                  className="text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {label}
                </motion.span>
              )}
              {!(isOpen || hovered) && (
                <span className="absolute left-full ml-2 bg-[#333] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {label}
                </span>
              )}
            </NavLink>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2a2a2a] text-red-400 transition-all"
            aria-label="Logout"
          >
            <FaSignOutAlt className="text-lg" />
            {(isOpen || hovered) && (
              <motion.span
                className="text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                Logout
              </motion.span>
            )}
          </button>
        </div>

        {/* Bottom Profile Avatar */}
        <div className="flex justify-center mt-4">
          <motion.img
            src={
              user?.avatar ||
              user?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gradient-to-r from-green-500 to-blue-500 object-cover"
            alt="Profile avatar"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => user && navigate(`/profile/${user._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && user && navigate(`/profile/${user._id}`)}
          />
        </div>
      </motion.div>
    </>
  );
};

Sidebar.propTypes = {
  // No props are passed, but included for future extensibility
};

export default Sidebar;