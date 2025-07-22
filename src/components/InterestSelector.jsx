import React, { useState } from "react";
import {
  FaShoppingBag,
  FaRunning,
  FaPlane,
  FaCamera,
  FaDrumstickBite,
  FaPaintBrush,
  FaMicrophone,
  FaSwimmer,
  FaGamepad,
  FaGlassMartiniAlt,
  FaMusic,
  FaYinYang,
  FaGem,
  FaTableTennis,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const interests = [
  { icon: <FaCamera />, label: "Photography" },
  { icon: <FaDrumstickBite />, label: "Cooking" },
  { icon: <FaPaintBrush />, label: "Art" },
  { icon: <FaShoppingBag />, label: "Shopping" },
  { icon: <FaTableTennis />, label: "Tennis" },
  { icon: <FaPlane />, label: "Traveling" },
  { icon: <FaMicrophone />, label: "Karaoke" },
  { icon: <FaRunning />, label: "Run" },
  { icon: <FaGem />, label: "Extreme" },
  { icon: <FaYinYang />, label: "Yoga" },
  { icon: <FaSwimmer />, label: "Swimming" },
  { icon: <FaMusic />, label: "Music" },
  { icon: <FaGlassMartiniAlt />, label: "Drink" },
  { icon: <FaGamepad />, label: "Video games" },
];


function InterestSelector() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);


  const toggleInterest = (label) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleContinue = async () => {
    if (selected.length === 0) return alert("Please select at least 1 interest");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/users/vibe", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedVibes: selected }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Vibes updated successfully!");
        
        
      } else {
        toast.error("Failed to update vibe ");
      }
    } catch (err) {
      console.error("Error updating vibe:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10">
      <h2 className="text-2xl font-bold text-black text-center mb-6">
        Select your <br /> interests and set your vibe
      </h2>

      <div className="grid grid-cols-3 gap-4 max-w-4xl w-full">
        {interests.map(({ icon, label }) => (
          <button
            key={label}
            onClick={() => toggleInterest(label)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-black text-sm font-medium shadow-sm transition-all duration-200 ${
              selected.includes(label)
                ? "bg-green-500 text-white"
                : "bg-white border-gray-300"
            }`}
          >
            <span
              className={`text-lg ${
                selected.includes(label) ? "text-white" : "text-green-500"
              }`}
            >
              {icon}
            </span>
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={loading || selected.length === 0}
        className={`mt-10 ${
          selected.length === 0 || loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        } text-white text-sm font-semibold px-8 py-3 rounded-lg shadow-md transition-all`}
      >
        {loading ? "Updating..." : "Continue"}
      </button>
    </div>
  );
}

export default InterestSelector;
