import React from "react";
import { motion } from "framer-motion";
import {
  AiOutlineClose,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ReelModal({ reel, onClose, onLike, isLiked }) {
  const navigate = useNavigate();
  if (!reel) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative w-full max-w-md h-[80vh] bg-black rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-2xl hover:text-red-500 z-50"
        >
          <AiOutlineClose />
        </button>

        {/* 🎥 Video */}
        <div className="flex-1 flex items-center justify-center bg-black">
          <video
            src={reel.videoUrl}
            className="w-full max-h-full object-contain"
            controls
            autoPlay
          />
        </div>

        {/* 📝 Caption + ❤️ Like + 💬 Comment + 👤 Username */}
        <div className="bg-white px-4 py-3 rounded-t-xl flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-sm font-semibold truncate">
              {reel.caption || "No caption"}
            </h2>
            <p className="text-xs text-gray-500">
              {reel.likes?.length || 0} likes
            </p>

            {/* 👤 Username */}
            <p
              className="text-xs text-blue-600 cursor-pointer hover:underline mt-1"
              onClick={() => {
                if (reel.postedBy?._id) {
                  navigate(`/profile/${reel.postedBy._id}`);
                  onClose(); // close modal after navigating
                }
              }}
            >
              @{reel.postedBy?.name || "User"}
            </p>
          </div>

          {/* ❤️ + 💬 */}
          <div className="flex items-center gap-4 text-xl ml-4">
            <button
              onClick={() => onLike(reel._id)}
              className={`transition hover:scale-110 ${
                isLiked ? "text-red-500" : "text-gray-500"
              }`}
            >
              {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
            </button>

            <button className="text-gray-500 hover:scale-110 transition">
              <FaRegCommentDots />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ReelModal;
