import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "../assets/VibeX.png";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.data); // Assuming user data is in res.data.data
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId && token) {
      fetchUser();
    }
  }, [userId, token]);

  const navLinks = ["Home", "Explore", "Contact"];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-50 bg-white/30 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="w-32 h-auto"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <img src={Logo}onClick={() => navigate("/")} alt="Logo" className="h-10 w-auto object-contain cursor-pointer" />
            
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {user &&
              navLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={`#${link.toLowerCase()}`}
                  className="text-gray-700 hover:text-green-600 font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  {link}
                </motion.a>
              ))}

            {!user ? (
              <button
                className="px-4 py-2 text-green-600 font-semibold hover:underline"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            ) : (
              <div className="relative profile-dropdown">
                <img
                  src={user.avatar || user.baseImage || "https://placehold.co/100x100"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-green-500 cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div className="absolute flex flex-col top-12 right-0 bg-white shadow-lg rounded-lg py-2 w-36 z-10">
                    <button
                      className="px-4 py-2 hover:bg-gray-100 text-sm text-left"
                      onClick={() => {
                        navigate(`/profile/${user._id}`);
                        setShowDropdown(false);
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="px-4 py-2 hover:bg-gray-100 text-sm text-red-500 text-left"
                      onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        setUser(null);
                        setShowDropdown(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-green-700 text-xl"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="md:hidden px-6 pb-4"
          >
            <div className="flex flex-col items-start gap-4">
              {user &&
                navLinks.map((link, i) => (
                  <a
                    key={i}
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-700 hover:text-green-600 font-medium"
                  >
                    {link}
                  </a>
                ))}

              {!user ? (
                <button
                  className="text-green-600 font-medium"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowLogin(true);
                  }}
                >
                  Login
                </button>
              ) : (
                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={user.avatar || user.baseImage || "https://placehold.co/100x100"}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-green-500"
                  />
                  <span className="text-gray-800 font-semibold">{user.username}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {showLogin && (
        <Login
          closeModal={() => setShowLogin(false)}
          switchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <Register
          closeModal={() => setShowRegister(false)}
          switchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}

export default Navbar;
