import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import banner from "../assets/banner1.png";
import profile from "../assets/DummyProfile.jpeg";
import { ClipLoader } from "react-spinners";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reels, setReels] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/users/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.data);
      } catch (err) {
        console.error("Error fetching user:", err.message);
      }
    };

    const fetchUserReels = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reels/user/${id}`);
        setReels(res.data);
      } catch (err) {
        console.error("Error fetching user reels:", err.message);
      }
    };

    if (id) {
      fetchUser();
      fetchUserReels();
    }
  }, [id]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <ClipLoader color="#10B981" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Top Banner */}
      <div className="relative h-56">
        <img
          src={user.bannerImage || banner}
          alt="banner"
          className="w-full h-full object-cover rounded-b-3xl"
        />
        <div className="absolute -bottom-16 left-6">
          <img
            src={user.profileImage || profile}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-green-500 object-cover shadow-lg"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-24">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">{user.name}</h2>
            <p className="text-green-600">{user.profession || "Full Stack Dev"}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/edit_profile/${user._id}`)}
              className="border border-green-500 text-green-600 px-4 py-1 rounded-md hover:bg-green-100 transition"
            >
              Edit
            </button>
            <button
              onClick={() => navigate("/interestSelector")}
              className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
            >
              Update Vibes
            </button>
          </div>
        </div>

        <div className="flex gap-6 mt-4 text-sm text-gray-700">
          <span><strong>{user.postsCount || 0}</strong> posts</span>
          <span><strong>{user.followers || 0}</strong> followers</span>
          <span><strong>{user.following || 0}</strong> following</span>
        </div>

        {user.bio && (
          <div className="mt-4 text-sm bg-gray-100 p-4 rounded-lg">
            {user.bio}
          </div>
        )}

        {/* About + Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-green-600 font-bold text-lg mb-2">About</h3>
            <p className="text-sm">Gender: {user.gender || "NA"}</p>
            <p className="text-sm">📍 {user.location || "Unknown"}</p>
            <p className="text-sm">📧 {user.email}</p>
            <p className="text-sm">📞 {user.phone || "Not Added"}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-green-600 font-bold text-lg mb-2">You Might Know</h3>
            {["Eddie", "Alexey", "Anton"].map((name, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full" />
                <span className="text-sm">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reels Section */}
        <div className="mt-10">
  <h3 className="text-2xl text-green-600 font-semibold mb-4">Your Reels</h3>
  {reels.length === 0 ? (
    <p className="text-sm text-gray-500">No reels uploaded yet.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {reels.map((reel, i) => (
        <div
          key={i}
          className="relative group overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm hover:shadow-md transition"
        >
          {/* Reel Video (9:16) */}
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

          {/* Overlay Info */}
          <div className="absolute bottom-0 left-0 w-full px-3 py-2 bg-gradient-to-t from-black/60 to-transparent text-white text-xs">
            <p className="truncate">{reel.caption || "No caption"}</p>
            <div className="flex justify-between mt-1 text-[11px] text-gray-300">
              <span>❤️ {reel.likes.length} likes</span>
              <span>{new Date(reel.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


      </div>
    </div>
  );
}

export default Profile;
