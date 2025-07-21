import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditProfile() {
  const { id } = useParams();
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
        toast.info("No changes made 🤷");
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
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err.message);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 px-4 py-10 sm:px-6 lg:px-16">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
        {/* Banner */}
        <div className="relative">
          <div className="w-full h-44 sm:h-60 bg-gray-200">
            {bannerPreview ? (
              <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No banner uploaded
              </div>
            )}
          </div>
          <label className="absolute bottom-2 right-4 text-sm bg-white px-3 py-1 rounded-md shadow cursor-pointer hover:bg-green-100">
            <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
            Change Banner
          </label>
        </div>

        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-3">
              <img
                src={profilePreview}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <label className="text-sm bg-white px-3 py-1 rounded-md shadow cursor-pointer hover:bg-green-100">
                <input type="file" accept="image/*" onChange={handleProfileChange} className="hidden" />
                Change Profile Photo
              </label>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                maxLength={maxBioLength}
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Write something cool 😎"
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {bio.length}/{maxBioLength}
              </p>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select gender</option>
                <option value="Man">Man</option>
                <option value="Woman">Woman</option>
                <option value="NoFace">NoFace</option>
                <option value="Unknown">Prefer not to say</option>
              </select>
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g. Full Stack Developer"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g. Kochi, Kerala"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g. 9876543210"
              />
            </div>

            {/* Suggestions */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-800">
                  Show account suggestions on profiles
                </label>
                <input
                  type="checkbox"
                  checked={suggestions}
                  onChange={(e) => setSuggestions(e.target.checked)}
                  className="w-5 h-5 accent-green-600"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your profile might appear on other profiles.
              </p>
            </div>

            {/* Save Button */}
            <div className="text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 transition px-6 py-2 rounded-lg text-white font-semibold shadow-md"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-500 mt-8 text-center">
            Some profile info like your name, bio & links are visible to everyone.{" "}
            <a href="#" className="text-green-600 underline">Learn more</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
