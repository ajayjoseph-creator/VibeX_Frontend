import React, { useState, useEffect } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [suggestions, setSuggestions] = useState(false);
  const [banner, setBanner] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState("https://placehold.co/100x100");
  const [location, setLocation] = useState("");
  const [profession, setProfession] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const maxBioLength = 150;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/users/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data.data;
        setUser(data);
        setBio(data.bio || "");
        setGender(data.gender || "");
        setSuggestions(data.suggestions || false);
        setBannerPreview(data.bannerImage || null);
        setProfilePreview(data.profileImage || "https://placehold.co/100x100");
        setLocation(data.location || "");
        setProfession(data.profession || "");
        setPhone(data.number || "");
      } catch (err) {
        console.error("Error fetching user:", err.message);
        toast.error("❌ Failed to load profile data.");
      }
    };

    fetchUser();
  }, [id]);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      if (bio !== user.bio) formData.append("bio", bio);
      if (gender !== user.gender) formData.append("gender", gender);
      if (suggestions !== user.suggestions)
        formData.append("suggestions", suggestions ? "true" : "false");
      if (location !== user.location) formData.append("location", location);
      if (profession !== user.profession) formData.append("profession", profession);
      if (phone !== user.number) formData.append("phone", phone);
      if (banner) formData.append("banner", banner);
      if (profile) formData.append("profile", profile);

      if ([...formData.entries()].length === 0) {
        toast.info("No changes made.");
        setLoading(false);
        return;
      }

      await axios.put(`http://localhost:5000/api/users/profile/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("✅ Profile updated successfully!");
      navigate(`/profile/${id}`);
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err.message);
      toast.error("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/60 to-blue-900/60 backdrop-blur-md px-4 py-10 sm:px-6 lg:px-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-3xl w-full bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
        role="form"
        aria-labelledby="edit-profile-title"
      >
        {/* Banner */}
        <div className="relative">
          <div className="w-full h-40 sm:h-56 bg-gradient-to-r from-gray-700/50 to-gray-900/50">
            {bannerPreview ? (
              <motion.img
                src={bannerPreview}
                alt="Banner"
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/60">
                No banner uploaded
              </div>
            )}
          </div>
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-4 right-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-xl shadow cursor-pointer hover:from-green-600 hover:to-teal-600 transition"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
              aria-label="Upload banner image"
            />
            Change Banner
          </motion.label>
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <h1
            id="edit-profile-title"
            className="text-3xl font-bold text-center text-white mb-6 tracking-tight"
          >
            Edit Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <motion.img
                src={profilePreview}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white/80 shadow-lg object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-xl shadow cursor-pointer hover:from-green-600 hover:to-teal-600 transition"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileChange}
                  className="hidden"
                  aria-label="Upload profile photo"
                />
                Change Profile Photo
              </motion.label>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Bio */}
              <div className="sm:col-span-2 relative">
                <textarea
                  maxLength={maxBioLength}
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 pt-5 pb-2 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer"
                  placeholder="Write something cool 😎"
                  id="bio"
                  aria-label="Bio"
                />
                <label
                  htmlFor="bio"
                  className="absolute left-4 top-3 text-white/60 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-400"
                >
                  Bio
                </label>
                <p className="text-xs text-white/60 text-right mt-1">
                  {bio.length}/{maxBioLength}
                </p>
              </div>

              {/* Gender */}
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 pt-5 pb-2 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer"
                  id="gender"
                  aria-label="Gender"
                >
                  <option value="">Select gender</option>
                  <option value="Man">Man</option>
                  <option value="Woman">Woman</option>
                  <option value="NoFace">NoFace</option>
                  <option value="Unknown">Prefer not to say</option>
                </select>
                <label
                  htmlFor="gender"
                  className="absolute left-4 top-3 text-white/60 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-400"
                >
                  Gender
                </label>
              </div>

              {/* Profession */}
              <div className="relative">
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full px-4 pt-5 pb-2 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer"
                  placeholder="e.g. Full Stack Developer"
                  id="profession"
                  aria-label="Profession"
                />
                <label
                  htmlFor="profession"
                  className="absolute left-4 top-3 text-white/60 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-400"
                >
                  Profession
                </label>
              </div>

              {/* Location */}
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 pt-5 pb-2 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer"
                  placeholder="e.g. Kochi, Kerala"
                  id="location"
                  aria-label="Location"
                />
                <label
                  htmlFor="location"
                  className="absolute left-4 top-3 text-white/60 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-400"
                >
                  Location
                </label>
              </div>

              {/* Phone */}
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full px-4 pt-5 pb-2 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition peer"
                  placeholder="e.g. 9876543210"
                  id="phone"
                  aria-label="Phone Number"
                />
                <label
                  htmlFor="phone"
                  className="absolute left-4 top-3 text-white/60 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-400"
                >
                  Phone Number
                </label>
                {phone && !/^\d{10}$/.test(phone) && (
                  <p className="text-red-400 text-xs mt-1">Enter a valid 10-digit phone number.</p>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">
                  Show account suggestions on profiles
                </label>
                <input
                  type="checkbox"
                  checked={suggestions}
                  onChange={(e) => setSuggestions(e.target.checked)}
                  className="w-5 h-5 accent-green-400"
                  aria-label="Toggle account suggestions"
                />
              </div>
              <p className="text-xs text-white/60 mt-1">
                Your profile might appear on other profiles.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <motion.button
                type="button"
                onClick={() => navigate(`/profile/${id}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-xl bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition"
                aria-label="Cancel"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold px-6 py-2 rounded-xl transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Save Changes"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </motion.button>
            </div>
          </form>

          <p className="text-xs text-white/60 mt-8 text-center">
            Some profile info like your name, bio & links are visible to everyone.{" "}
            <a href="#" className="text-green-400 underline hover:text-green-300">
              Learn more
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default EditProfile;