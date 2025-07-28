import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import ReelModal from "../components/ReelModal";
import UserListModal from "../components/UserListModal";
import PropTypes from "prop-types";
import banner from "../assets/banner1.png";
import profile from "../assets/DummyProfile.jpeg";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reels, setReels] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedReel, setSelectedReel] = useState(null);
  const [showUserList, setShowUserList] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUserId(parsedUser._id);
    }
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/users/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
    } catch (err) {
      console.error("Error fetching user:", err.message);
      setError("Failed to load profile. Please try again.");
      toast.error("Failed to load profile 💥");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReels = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reels/user/${id}`);
      setReels(res.data);
    } catch (err) {
      console.error("Error fetching reels:", err.message);
      setError("Failed to load reels.");
      toast.error("Failed to load reels 💥");
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchUserReels();
    }
  }, [id]);

  const handleFollow = async (targetUserId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/users/follow/${targetUserId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Followed successfully 🎉");
      fetchUser();
    } catch (err) {
      toast.error("Follow failed 💥");
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/users/unfollow/${targetUserId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Unfollowed successfully 👋");
      fetchUser();
    } catch (err) {
      toast.error("Unfollow failed 💥");
    }
  };

  const isFollowing = useMemo(
    () => user?.followers?.some((f) => f.toString() === currentUserId),
    [user, currentUserId]
  );

  const suggestedUsers = useMemo(
    () => [
      { id: "1", name: "Eddie", avatar: "https://via.placeholder.com/40" },
      { id: "2", name: "Alexey", avatar: "https://via.placeholder.com/40" },
      { id: "3", name: "Anton", avatar: "https://via.placeholder.com/40" },
    ],
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="h-48 md:h-64 bg-gray-200 rounded-b-2xl animate-pulse"></div>
          <div className="relative -mt-12 ml-4 md:ml-8">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-300 animate-pulse"></div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-7 w-40 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
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
              fetchUser();
              fetchUserReels();
            }}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Retry loading profile"
          >
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Banner */}
      <div className="relative h-48 md:h-64">
        <motion.img
          src={user.bannerImage || banner}
          alt="Profile banner"
          className="w-full h-full object-cover rounded-b-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 rounded-b-2xl"></div>
        <motion.div
          className="absolute -bottom-12 left-4 md:left-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src={user.profileImage || profile}
            alt={`${user.name}'s avatar`}
            className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-gradient-to-r from-green-500 to-blue-500 object-cover shadow-md"
          />
        </motion.div>
      </div>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-green-600 text-sm">{user.profession || "Full Stack Dev"}</p>
          </motion.div>

          <div className="flex gap-2">
            {currentUserId === user._id ? (
              <>
                <motion.button
                  onClick={() => navigate(`/edit_profile/${user._id}`)}
                  className="border border-green-500 text-green-600 px-3 py-1 rounded-md hover:bg-green-50 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Edit profile"
                >
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => navigate("/interestSelector")}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Update vibes"
                >
                  Update Vibes
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  onClick={() => (isFollowing ? handleUnfollow(user._id) : handleFollow(user._id))}
                  className={`${
                    isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                  } text-white px-3 py-1 rounded-md transition`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={isFollowing ? "Unfollow user" : "Follow user"}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </motion.button>
                <motion.button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="border border-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-50 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Message user"
                >
                  Message
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          className="flex gap-4 md:gap-6 mt-3 text-sm text-gray-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <span
            onClick={() => setShowUserList("posts")}
            className="cursor-pointer hover:text-green-600 hover:underline transition"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowUserList("posts")}
            aria-label="View posts"
          >
            <strong>{user.postsCount || 0}</strong> posts
          </span>
          <span
            onClick={() => setShowUserList("followers")}
            className="cursor-pointer hover:text-green-600 hover:underline transition"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowUserList("followers")}
            aria-label="View followers"
          >
            <strong>{user.followers?.length || 0}</strong> followers
          </span>
          <span
            onClick={() => setShowUserList("following")}
            className="cursor-pointer hover:text-green-600 hover:underline transition"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowUserList("following")}
            aria-label="View following"
          >
            <strong>{user.following?.length || 0}</strong> following
          </span>
        </motion.div>

        {/* Bio */}
        {user.bio && (
          <motion.div
            className="mt-3 text-sm bg-gray-50 p-3 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            {user.bio}
          </motion.div>
        )}

        {/* About + Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {currentUserId === user._id && (
            <motion.div
              className="bg-gray-50 p-3 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <h3 className="text-green-600 font-bold text-base mb-2">About</h3>
              <p className="text-sm">Gender: {user.gender || "Not specified"}</p>
              <p className="text-sm flex items-center gap-1">
                <FiMapPin className="text-gray-500" />
                {user.location || "Unknown"}
              </p>
              <p className="text-sm flex items-center gap-1">
                <FiMail className="text-gray-500" />
                {user.email}
              </p>
              <p className="text-sm flex items-center gap-1">
                <FiPhone className="text-gray-500" />
                {user.number || "Not added"}
              </p>
            </motion.div>
          )}

          <motion.div
            className="bg-gray-50 p-3 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <h3 className="text-green-600 font-bold text-base mb-2">You Might Know</h3>
            {suggestedUsers.map(({ id, name, avatar }) => (
              <motion.div
                key={id}
                className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition"
                onClick={() => navigate(`/profile/${id}`)}
                whileHover={{ scale: 1.02 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/profile/${id}`)}
                aria-label={`View ${name}'s profile`}
              >
                <img
                  src={avatar}
                  alt={`${name}'s avatar`}
                  className="w-7 h-7 rounded-full object-cover border border-gray-200"
                />
                <span className="text-sm text-gray-800">{name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Reels */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <h3 className="text-xl text-green-600 font-semibold mb-3">Reels</h3>
          {reels.length === 0 ? (
            <p className="text-sm text-gray-500">No reels uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {reels.map((reel, i) => (
                <motion.div
                  key={i}
                  className="relative group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedReel(reel)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * i }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedReel(reel)}
                  aria-label={`View reel: ${reel.caption || "No caption"}`}
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
                    <p className="truncate">{reel.caption || "No caption"}</p>
                    <div className="flex justify-between mt-1 text-[10px] text-gray-200">
                      <span>❤️ {reel.likes?.length || 0} likes</span>
                      <span>{new Date(reel.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedReel && (
          <ReelModal reel={selectedReel} onClose={() => setSelectedReel(null)} />
        )}
        {showUserList && (
          <UserListModal
            title={
              showUserList === "followers"
                ? "Followers"
                : showUserList === "following"
                ? "Following"
                : "Posts"
            }
            users={user[showUserList] || []}
            onClose={() => setShowUserList(null)}
            onNavigate={(id) => navigate(`/profile/${id}`)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

Profile.propTypes = {
  // No props are passed, but included for future extensibility
};

export default Profile;