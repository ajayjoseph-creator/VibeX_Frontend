import React, { useEffect, useState } from "react";
import axios from "axios";
import ReelModal from "../components/ReelModal"; // ✅ import modal

function AllReelsFeed() {
  const [reels, setReels] = useState([]);
  const [selectedReel, setSelectedReel] = useState(null); // ✅ modal state

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reels/all");
        setReels(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch reels:", err.message);
      }
    };

    fetchReels();
  }, []);

  return (
    <div className="min-h-screen bg-white text-white px-4 py-10">
      <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">
        🔥 Trending Reels
      </h2>

      {reels.length === 0 ? (
        <p className="text-gray-400 text-center">No reels found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {reels.map((reel, i) => (
            <div
              key={i}
              onClick={() => setSelectedReel(reel)} // ✅ modal trigger
              className="relative group rounded-xl overflow-hidden border border-gray-800 shadow-lg bg-black cursor-pointer"
            >
              <div className="w-full h-auto overflow-hidden">
                <video
  src={reel.videoUrl}
  className="w-full h-auto object-contain group-hover:scale-105 transition duration-300"
/>
              </div>

              <div className="absolute bottom-0 left-0 w-full px-3 py-2 bg-gradient-to-t from-black/70 to-transparent text-white text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={reel.postedBy?.profileImage || "/default-profile.png"}
                    alt="user"
                    className="w-6 h-6 rounded-full object-cover border border-green-400"
                  />
                  <span className="font-medium text-sm">
                    {reel.postedBy?.name || "User"}
                  </span>
                </div>
                <p className="truncate">{reel.caption || "No caption"}</p>
                <div className="flex justify-between text-[11px] text-gray-300 mt-1">
                  <span>❤️ {reel.likes?.length || 0}</span>
                  <span>
                    {new Date(reel.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Modal component */}
      {selectedReel && (
        <ReelModal reel={selectedReel} onClose={() => setSelectedReel(null)} />
      )}
    </div>
  );
}

export default AllReelsFeed;
