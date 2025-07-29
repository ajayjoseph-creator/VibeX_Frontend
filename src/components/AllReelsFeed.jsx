import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReelModal from "../components/ReelModal";

const AllReelsFeed = () => {
  const [reels, setReels] = useState([]);
  const [selectedReel, setSelectedReel] = useState(null);
  const [likedReelIds, setLikedReelIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchReels();
  }, []);

  const handleLike = async (reelId) => {
    try {
      await axios.put(`http://localhost:5000/api/reels/like/${reelId}`);
      setLikedReelIds((prev) =>
        prev.includes(reelId)
          ? prev.filter((id) => id !== reelId)
          : [...prev, reelId]
      );

      // Refresh like count
      setReels((prev) =>
        prev.map((reel) =>
          reel._id === reelId
            ? {
                ...reel,
                likes: prev.includes(reelId)
                  ? reel.likes.filter((id) => id !== "dummyUser")
                  : [...reel.likes, "dummyUser"],
              }
            : reel
        )
      );
    } catch (err) {
      toast.error("Failed to like/unlike");
    }
  };

  const handleComment = async (reelId, comment) => {
    try {
      await axios.post(`http://localhost:5000/api/reels/comment/${reelId}`, {
        text: comment,
      });
      // You can also optionally update the comments in UI
    } catch (err) {
      toast.error("Failed to comment");
    }
  };

  const memoizedReels = useMemo(() => reels, [reels]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-4 py-6">
        {/* Shimmer Loader */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
            onClick={fetchReels}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <h2 className="text-2xl font-bold text-center text-green-500 mb-6">
        🔥 Trending Reels
      </h2>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {memoizedReels.map((reel, i) => (
          <motion.div
            key={i}
            className="relative group cursor-pointer rounded-lg overflow-hidden border bg-white shadow"
            onClick={() => setSelectedReel(reel)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative" style={{ paddingTop: "177.78%" }}>
              <video
                src={reel.videoUrl}
                className="absolute top-0 left-0 w-full h-full object-cover"
                muted
                loop
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => e.target.pause()}
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full px-3 py-2 bg-gradient-to-t from-black/60 to-transparent text-white">
              <div
                className="flex items-center gap-2 mb-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${reel.postedBy?._id}`);
                }}
              >
                <img
                  src={reel.postedBy?.profileImage || "/default-profile.png"}
                  className="w-6 h-6 rounded-full border object-cover"
                  alt="User"
                />
                <span className="text-sm font-medium">
                  {reel.postedBy?.name || "User"}
                </span>
              </div>
              <p className="truncate">{reel.caption || "No caption"}</p>
              <div className="text-[10px] flex justify-between mt-1">
                <span>❤️ {reel.likes?.length || 0}</span>
                <span>{new Date(reel.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedReel && (
          <ReelModal
            reel={selectedReel}
            onClose={() => setSelectedReel(null)}
            onLike={handleLike}
            onComment={handleComment}
            isLiked={likedReelIds.includes(selectedReel._id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllReelsFeed;
