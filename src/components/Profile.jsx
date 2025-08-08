import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import ReelModal from "../components/ReelModal";
import UserListModal from "../components/UserListModal";
import banner from "../assets/banner1.png";
import profile from "../assets/DummyProfile.jpeg";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import socket from "../socket";

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
      const res = await axios.get(
        `http://localhost:5000/api/users/profile/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data.data);
    } catch (err) {
      setError("Failed to load profile.");
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
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // 🔔 Emit socket notification
    socket.emit("sendNotification", {
      senderId: currentUserId,
      receiverId: targetUserId,
      type: "follow",
    });

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center flex-col">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => {
            fetchUser();
            fetchUserReels();
          }}
          className="bg-green-500 text-white mt-4 px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Banner */}
      <div className="relative h-48 md:h-64">
        <img
          src={user.bannerImage || banner}
          alt="Banner"
          className="w-full h-full object-cover rounded-b-2xl"
        />
        <div className="absolute -bottom-12 left-6">
          <img
            src={user.profileImage || profile}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-16">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-green-600">
              {user.profession || "No profession set"}
            </p>
          </div>

          <div className="flex gap-3">
            {currentUserId === user._id ? (
              <>
                <button
                  onClick={() => navigate(`/edit_profile/${user._id}`)}
                  className="border border-green-600 text-green-600 px-4 py-1 rounded hover:bg-green-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate("/interestSelector")}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  Update Vibes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    isFollowing
                      ? handleUnfollow(user._id)
                      : handleFollow(user._id)
                  }
                  className={`px-4 py-1 rounded text-white ${
                    isFollowing ? "bg-red-500" : "bg-green-600"
                  } hover:opacity-90`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>

                {/* ✅ New Message Button */}
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="border border-gray-400 text-gray-800 px-4 py-1 rounded hover:bg-gray-100"
                >
                  Message
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-5 mt-4 text-sm text-gray-600">
          <span
            onClick={() => setShowUserList("posts")}
            className="cursor-pointer hover:underline"
          >
            <strong>{(user.postsCount || 0) + reels.length}</strong> posts
          </span>
          <span
            onClick={() => setShowUserList("followers")}
            className="cursor-pointer hover:underline"
          >
            <strong>{user.followers?.length || 0}</strong> followers
          </span>
          <span
            onClick={() => setShowUserList("following")}
            className="cursor-pointer hover:underline"
          >
            <strong>{user.following?.length || 0}</strong> following
          </span>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-3 bg-white p-3 rounded shadow">{user.bio}</p>
        )}

        {/* Contact Info */}
        {currentUserId === user._id && (
          <div className="bg-white p-3 mt-4 rounded shadow space-y-1 text-sm">
            <p>Gender: {user.gender || "Not specified"}</p>
            <p className="flex items-center gap-1">
              <FiMapPin /> {user.location || "Unknown"}
            </p>
            <p className="flex items-center gap-1">
              <FiMail /> {user.email}
            </p>
            <p className="flex items-center gap-1">
              <FiPhone /> {user.number || "Not added"}
            </p>
          </div>
        )}

        {/* Reels Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-green-600 mb-4">Vibes</h3>
          {reels.length === 0 ? (
            <p className="text-sm text-gray-500">No Vibes uploaded yet.</p>
          ) : (
            <BentoGrid className="md:auto-rows-[20rem]">
              {reels.map((reel, i) => (
                <BentoGridItem
                  key={i}
                  className="cursor-pointer"
                  title={reel.caption || "No caption"}
                  description={new Date(reel.createdAt).toLocaleDateString()}
                  header={
                    <div
                      onClick={() => setSelectedReel(reel)}
                      className="relative w-full h-40 md:h-52 rounded-lg overflow-hidden"
                    >
                      <img
                        src={reel.mediaUrl}
                        alt="Post"
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-xs px-2 py-1 flex justify-between">
                        <span>❤️ {reel.likes?.length || 0}</span>
                        <span>
                          {new Date(reel.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  }
                />
              ))}
            </BentoGrid>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedReel && (
          <ReelModal
            reel={selectedReel}
            onClose={() => setSelectedReel(null)}
          />
        )}
        {showUserList && (
          <UserListModal
            title={showUserList}
            users={user[showUserList] || []}
            onClose={() => setShowUserList(null)}
            onNavigate={(id) => navigate(`/profile/${id}`)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
