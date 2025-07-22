import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import banner from '../assets/banner1.png'
import profile from '../assets/DummyProfile.jpeg'
import { ClipLoader } from "react-spinners";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log('token: ',token)
        const res = await axios.get(`http://localhost:5000/api/users/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("🌄 Banner Image:", res.data.data);
        setUser(res.data.data);
      } catch (err) {
        console.error("Error fetching user:", err.message);
      }
    };

    fetchUser();
  }, [id]);

  if (!user){
     return (
      <div className="flex justify-center items-center h-screen bg-white">
      <ClipLoader color="#36d7b7" size={50} />
    </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-black font-sans">
      {/* Top Banner */}
      <div
        className="relative h-48 rounded-b-3xl shadow-md"
        style={{
          backgroundImage: `url(${user.bannerImage || banner  })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Removed overlay for better visibility */}

        {/* Profile Image */}
        <div className="absolute bottom-0 left-6 translate-y-1/2">
          <img
            src={user.profileImage || profile}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-24">
        {/* Header Info + Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-lg shadow-md">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.profession || "Full Stack Dev"}</p>
          </div>
          <div className="flex gap-3">
          <button
  onClick={() => navigate(`/edit_profile/${user._id}`)}
  className="bg-white text-green-600 border border-green-500 px-4 py-1 rounded-md hover:bg-green-50 transition"
>
  Edit Profile
</button>

            <button
              onClick={() => navigate("/interestSelector")}
              className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition"
            >
              Update Your Vibes
            </button>
          </div>
        </div>

        {/* Counters */}
        <div className="mt-6 flex gap-6 text-sm text-gray-700">
          <p><span className="font-bold">{user.postsCount || 0}</span> posts</p>
          <p><span className="font-bold">{user.followers || 0}</span> followers</p>
          <p><span className="font-bold">{user.following || 0}</span> following</p>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mt-4 text-sm text-gray-800 bg-white p-4 rounded-md shadow-md">
            {user.bio}
          </div>
        )}

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-10">
          {/* Left Column - About */}
          <div className="col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-md border shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-green-600">About</h3>
              <p className="text-sm text-gray-700">Gender: {user.gender || "NA"}</p>
              <p className="text-sm text-gray-700">📍 Location: {user.location || "Unknown"}</p>
              <p className="text-sm text-gray-700">📧 {user.email}</p>
              <p className="text-sm text-gray-700">📞 {user.phone || "Not Added"}</p>
            </div>
          </div>

          {/* Center Column - Posts */}
          <div className="col-span-2 space-y-6">
            {[1, 2].map((post, i) => (
              <div key={i} className="bg-white border rounded-lg p-4 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={user.profileImage}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="avatar"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">3 mins ago</p>
                  </div>
                </div>
                <img
                  src="https://placehold.co/600x300"
                  className="w-full rounded-md mb-3"
                  alt="post"
                />
                <p className="text-sm text-gray-700">
                  {user.name} posted something awesome 🚀🔥
                </p>
              </div>
            ))}
          </div>

          {/* Right Column - Suggestions */}
          <div className="col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-md border shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-green-600">You Might Know</h3>
              {["Eddie", "Alexey", "Anton"].map((name, i) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  <div className="text-sm text-gray-800">{name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
