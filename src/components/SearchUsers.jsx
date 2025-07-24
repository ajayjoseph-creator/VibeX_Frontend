import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function SearchUsers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 🔁 Fetch recent searches initially
  useEffect(() => {
    if (!query.trim()) {
      fetchRecentSearches();
    }
  }, [query]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== "") {
        searchUsers(query);
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchUsers = async (q) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/users/search?q=${q}`);
      setResults(res.data);
    } catch (err) {
      console.error("❌ Search error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentSearches = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/recent-search`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecent(res.data.recent);
    } catch (err) {
      console.error("❌ Recent search fetch failed:", err.message);
    }
  };

  const handleSelectUser = async (userId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/users/recent-search`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("❌ Failed to add to recent:", err.message);
    }
    navigate(`/profile/${userId}`);
  };

  const handleRemoveRecent = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/recent-search/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecent((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("❌ Failed to remove recent:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or vibe..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none ml-3 bg-transparent text-gray-800"
          />
        </div>

        {/* Searching... */}
        {loading && <p className="mt-4 text-gray-500">Searching...</p>}

        {/* 🔍 Search Results */}
        {results.length > 0 && (
          <motion.ul className="mt-4 space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {results.map((user) => (
              <li
                key={user._id}
                className="flex items-center gap-4 p-3 bg-gray-50 hover:bg-green-50 rounded-lg cursor-pointer"
                onClick={() => handleSelectUser(user._id)}
              >
                <img
                  src={user.profileImage || "https://via.placeholder.com/40"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {user.vibe?.join(", ") || "No vibes added"}
                  </p>
                </div>
              </li>
            ))}
          </motion.ul>
        )}

        {/* 🕓 Recent Searches */}
        {!query && recent.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm text-gray-500 mb-2">Recent Searches</h3>
            <motion.ul className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {recent.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between p-2 bg-gray-50 hover:bg-green-50 rounded-lg"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => handleSelectUser(user._id)}
                  >
                    <img
                      src={user.profileImage || "https://via.placeholder.com/40"}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.vibe?.join(", ") || "No vibes"}
                      </p>
                    </div>
                  </div>
                  <FaTimes
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                    onClick={() => handleRemoveRecent(user._id)}
                  />
                </li>
              ))}
            </motion.ul>
          </div>
        )}

        {/* No Results */}
        {!loading && query && results.length === 0 && (
          <p className="mt-4 text-gray-400 text-sm">No users found 😔</p>
        )}
      </div>
    </div>
  );
}

export default SearchUsers;
