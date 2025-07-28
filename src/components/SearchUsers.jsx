import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaSearch, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch recent searches when query is empty
  useEffect(() => {
    if (!query.trim()) {
      fetchRecentSearches();
    }
  }, [query]);

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        searchUsers(query);
      } else {
        setResults([]);
        setError(null);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchUsers = async (q) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`http://localhost:5000/api/users/search?q=${q}`);
      setResults(res.data);
    } catch (err) {
      console.error("❌ Search error:", err.message);
      setError("Failed to fetch search results. Please try again.");
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
      setError("Failed to fetch recent searches.");
    }
  };

  const handleSelectUser = async (userId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/users/recent-search`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error("❌ Failed to add to recent:", err.message);
      setError("Failed to save recent search.");
    }
  };

  const handleRemoveRecent = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/recent-search/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecent((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("❌ Failed to remove recent:", err.message);
      setError("Failed to remove recent search.");
    }
  };

  const handleClearRecent = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/recent-search/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecent([]);
    } catch (err) {
      console.error("❌ Failed to clear recent searches:", err.message);
      setError("Failed to clear recent searches.");
    }
  };

  const handleClearQuery = () => {
    setQuery("");
    setResults([]);
    setError(null);
  };

  // Memoize results to prevent unnecessary re-renders
  const memoizedResults = useMemo(() => results, [results]);
  const memoizedRecent = useMemo(() => recent, [recent]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center px-4 py-8 transition-all duration-300">
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        {/* Search Input */}
        <div className="relative flex items-center border border-gray-200 rounded-full px-4 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:ring-green-400 transition-all">
          <FaSearch className="text-gray-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by name or vibe..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none ml-3 bg-transparent text-gray-800 placeholder-gray-400"
            aria-label="Search users"
          />
          {query && (
            <FaTimes
              className="text-gray-400 hover:text-red-500 cursor-pointer"
              onClick={handleClearQuery}
              aria-label="Clear search"
            />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            className="mt-4 text-red-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Search Results */}
        {memoizedResults.length > 0 && (
          <motion.ul
            className="mt-4 space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {memoizedResults.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                onSelect={() => handleSelectUser(user._id)}
              />
            ))}
          </motion.ul>
        )}

        {/* Recent Searches */}
        {!query && memoizedRecent.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500">Recent Searches</h3>
              <button
                onClick={handleClearRecent}
                className="text-xs text-green-500 hover:text-green-600"
                aria-label="Clear all recent searches"
              >
                Clear All
              </button>
            </div>
            <motion.ul
              className="mt-2 space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {memoizedRecent.map((user) => (
                <RecentUserItem
                  key={user._id}
                  user={user}
                  onSelect={() => handleSelectUser(user._id)}
                  onRemove={() => handleRemoveRecent(user._id)}
                />
              ))}
            </motion.ul>
          </div>
        )}

        {/* No Results */}
        {!loading && query && memoizedResults.length === 0 && (
          <motion.p
            className="mt-4 text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No users found 😔
          </motion.p>
        )}
      </div>
    </div>
  );
};

// Reusable User Item Component
const UserItem = ({ user, onSelect }) => (
  <li
    className="flex items-center gap-4 p-3 bg-gray-50 hover:bg-green-100 rounded-lg cursor-pointer transition-colors duration-200"
    onClick={onSelect}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onSelect()}
  >
    <img
      src={user.profileImage || "https://via.placeholder.com/40"}
      alt={user.name}
      className="w-10 h-10 rounded-full object-cover border border-gray-200"
    />
    <div>
      <p className="font-semibold text-gray-800">{user.name}</p>
      <p className="text-xs text-gray-500">{user.vibe?.join(", ") || "No vibes added"}</p>
    </div>
  </li>
);

// Reusable Recent User Item Component
const RecentUserItem = ({ user, onSelect, onRemove }) => (
  <li className="flex items-center justify-between p-2 bg-gray-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
    <div
      className="flex items-center gap-3 cursor-pointer"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
    >
      <img
        src={user.profileImage || "https://via.placeholder.com/40"}
        alt={user.name}
        className="w-9 h-9 rounded-full object-cover border border-gray-200"
      />
      <div>
        <p className="text-sm font-medium text-gray-800">{user.name}</p>
        <p className="text-xs text-gray-500">{user.vibe?.join(", ") || "No vibes"}</p>
      </div>
    </div>
    <FaTimes
      className="text-gray-400 hover:text-red-500 cursor-pointer"
      onClick={onRemove}
      aria-label={`Remove ${user.name} from recent searches`}
    />
  </li>
);

UserItem.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
    vibe: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

RecentUserItem.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
    vibe: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default SearchUsers;