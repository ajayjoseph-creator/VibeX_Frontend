import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReelModal from "../components/ReelModal";
import PropTypes from "prop-types";

const AllReelsFeed = () => {
  const [reels, setReels] = useState([]);
  const [selectedReel, setSelectedReel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://localhost:5000/api/reels/all");
        setReels(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch reels:", err.message);
        setError("Failed to load reels. Please try again.");
        toast.error("Failed to load reels 💥");
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  const memoizedReels = useMemo(() => reels, [reels]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="relative rounded-lg overflow-hidden bg-gray-200 animate-pulse"
              >
                <div className="w-full" style={{ paddingTop: "177.78%" }}></div>
                <div className="absolute bottom-0 left-0 w-full px-2.5 py-1.5 bg-gray-300">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gray-400"></div>
                    <div className="h-4 w-24 bg-gray-400 rounded"></div>
                  </div>
                  <div className="h-3 w-3/4 bg-gray-400 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <motion.button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchReels();
            }}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Retry loading reels"
          >
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 md:px-8 py-6">
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-green-500 mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🔥 Trending Reels
      </motion.h2>

      {memoizedReels.length === 0 ? (
        <motion.p
          className="text-gray-500 text-center text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          No reels found.
        </motion.p>
      ) : (
        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {memoizedReels.map((reel, i) => (
            <motion.div
              key={i}
              className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => setSelectedReel(reel)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * i }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setSelectedReel(reel)}
              aria-label={`View reel by ${reel.postedBy?.name || "User"}`}
            >
              <div className="relative w-full" style={{ paddingTop: "177.78%" }}>
                <video
                  src={reel.videoUrl}
                  className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 group-hover:brightness-75 transition duration-300"
                  muted
                  loop
                  preload="metadata"
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => e.target.pause()}
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full px-2.5 py-1.5 bg-gradient-to-t from-black/70 to-transparent text-white text-xs">
                <div
                  className="flex items-center gap-2 mb-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${reel.postedBy?._id}`);
                  }}
                >
                  <img
                    src={reel.postedBy?.profileImage || "/default-profile.png"}
                    alt={`${reel.postedBy?.name || "User"}'s avatar`}
                    className="w-6 h-6 rounded-full object-cover border border-green-500"
                  />
                  <span className="font-medium text-sm">
                    {reel.postedBy?.name || "User"}
                  </span>
                </div>
                <p className="truncate">{reel.caption || "No caption"}</p>
                <div className="flex justify-between text-[10px] text-gray-200 mt-1">
                  <span>❤️ {reel.likes?.length || 0} likes</span>
                  <span>{new Date(reel.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedReel && (
          <ReelModal reel={selectedReel} onClose={() => setSelectedReel(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

AllReelsFeed.propTypes = {
  // No props are passed, but included for future extensibility
};

export default AllReelsFeed;


