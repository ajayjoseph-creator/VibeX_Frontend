import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiSettings } from "react-icons/fi";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/api/users/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data.data))
      .catch((err) => console.error("Error fetching user:", err));
  }, [id]);

  if (!user)
    return (
      <p className="text-center mt-32 text-gray-500 font-medium">
        Loading profile...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 pt-24 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center gap-8">
          <img
            src={user.baseImage}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 shadow-md"
          />
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <button className="bg-gray-200 hover:bg-gray-300 transition px-4 py-1 rounded-md text-sm">
                Edit Profile
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 transition px-4 py-1 rounded-md text-sm">
                Archive
              </button>
              <FiSettings className="text-xl text-gray-600 hover:text-black cursor-pointer" />
            </div>
            <div className="flex gap-6 mt-4 text-sm">
              <p>
                <span className="font-semibold">{user.postsCount || 0}</span>{" "}
                posts
              </p>
              <p>
                <span className="font-semibold">{user.followers || 0}</span>{" "}
                followers
              </p>
              <p>
                <span className="font-semibold">{user.following || 0}</span>{" "}
                following
              </p>
            </div>
            {user.bio && (
              <div className="mt-3 text-sm whitespace-pre-line text-gray-700">
                {user.bio}
              </div>
            )}
          </div>
        </div>

        {/* Highlights (Dummy) */}
        <div className="flex gap-4 mt-10">
          {["Highlights", "10k Fam", "Telegram", "New"].map((label, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-xs text-gray-700"
            >
              <div className="w-16 h-16 rounded-full border bg-gray-200 border-gray-300"></div>
              <p className="mt-1 truncate max-w-[60px] text-center">{label}</p>
            </div>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="mt-10 grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 flex items-center justify-center text-gray-500"
            >
              Post {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
