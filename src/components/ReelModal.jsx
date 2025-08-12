import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineClose,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function ReelModal({ reel, onClose }) {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const commentInputRef = useRef(null);

  const [comments, setComments] = useState(reel.comments || []);
  const [liked, setLiked] = useState(reel.isLiked || false);
  const [likeCount, setLikeCount] = useState(reel.likes?.length || 0);

  if (!reel) return null;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("📋 Link copied to clipboard!");
      setShowShare(false);
    } catch {
      toast.error("❌ Failed to copy link.");
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("❌ Login required to like.");

      const res = await axios.put(
        `http://localhost:5000/api/reels/like/${reel._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Backend should return { isLiked, likesCount }
      setLiked(res.data.isLiked);
      setLikeCount(res.data.likesCount);
    } catch (err) {
      console.error("Like error:", err.response?.data || err.message);
      toast.error("❌ Failed to like the reel.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return toast.warning("⚠️ Comment cannot be empty");

    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("❌ Login required to comment.");

      const res = await axios.post(
        `http://localhost:5000/api/reels/comment/${reel._id}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Backend should return populated comment object
      setComments((prev) => [...prev, res.data]);
      setCommentText("");
      toast.success("✅ Comment posted!");
    } catch {
      toast.error("❌ Failed to post comment.");
    }
  };

  const handleCommentIconClick = () => {
    setShowCommentInput(true);
    setTimeout(() => commentInputRef.current?.focus(), 100);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-[380px] h-[90vh] bg-black rounded-xl overflow-hidden flex flex-col shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-white bg-black/50 p-1 rounded-full z-10"
        >
          <AiOutlineClose size={20} />
        </button>

        {/* Media */}
        <div className="flex-grow relative">
          {reel.mediaUrl?.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={reel.mediaUrl}
              className="w-full h-full object-cover"
              autoPlay
              controls
              loop
            />
          ) : (
            <img
              src={reel.mediaUrl}
              alt="Post"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-[30%] right-2 flex flex-col gap-4 items-center text-white text-2xl">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`hover:scale-110 transition ${
              liked ? "text-red-500" : "text-white"
            }`}
          >
            {liked ? <AiFillHeart /> : <AiOutlineHeart />}
            <div className="text-xs mt-1">{likeCount}</div>
          </button>

          {/* Comment */}
          <button
            onClick={handleCommentIconClick}
            className="hover:scale-110 transition"
          >
            <FaRegCommentDots />
            <div className="text-xs mt-1">{comments.length}</div>
          </button>

          {/* Share */}
          <div className="relative">
            <button
              onClick={() => setShowShare(!showShare)}
              className="hover:scale-110 transition"
            >
              <AiOutlineShareAlt />
            </button>
            <AnimatePresence>
              {showShare && (
                <motion.div
                  className="absolute top-8 right-0 w-28 bg-white text-black rounded shadow-lg z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <button
                    onClick={handleShare}
                    className="w-full px-3 py-2 text-sm hover:bg-gray-100 text-left"
                  >
                    📋 Copy Link
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* User Info */}
        <div
          onClick={() => {
            if (reel.postedBy?._id) {
              navigate(`/profile/${reel.postedBy._id}`);
              onClose();
            }
          }}
          className="absolute bottom-[90px] left-3 text-white text-sm max-w-[75%] cursor-pointer"
        >
          <p className="font-bold hover:underline">
            @{reel.postedBy?.username || reel.postedBy?.name || "User"}
          </p>
          <p className="text-xs mt-1">{reel.caption || "No caption"}</p>
        </div>

        {/* Comments UI */}
        {showCommentInput && (
          <div className="absolute bottom-0 left-0 w-full h-[55%] bg-white z-50 flex flex-col rounded-t-xl overflow-hidden">
            <div className="flex justify-between items-center p-2 border-b">
              <p className="text-sm font-semibold">Comments</p>
              <button onClick={() => setShowCommentInput(false)}>
                <MdClose size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-xs text-black">
              {comments.length > 0 ? (
                comments.map((comment, i) => (
                  <div key={i} className="border-b pb-1">
                    <p className="font-medium">
                      @{comment.commentedBy?.username ||
                        comment.commentedBy?.name ||
                        "User"}
                    </p>
                    <p>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="italic text-gray-400">No comments yet.</p>
              )}
            </div>

            <div className="flex items-center gap-2 p-2 border-t bg-white">
              <input
                ref={commentInputRef}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-1 rounded-full text-xs outline-none border border-gray-300"
              />
              <motion.button
                onClick={handleCommentSubmit}
                className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full"
                whileTap={{ scale: 0.95 }}
              >
                Post
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ReelModal;
