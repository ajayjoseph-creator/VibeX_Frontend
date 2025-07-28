// src/pages/UploadReel.jsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import profileDummy from "../assets/DummyProfile.jpeg";

const UploadReel = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, []);

  const fetchUser = async () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      setError("Please log in to upload reels.");
      setLoadingUser(false);
      return;
    }

    const userData = JSON.parse(storedUser);
    const userId = userData?._id;

    try {
      setLoadingUser(true);
      const res = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data || res.data);
    } catch (err) {
      console.error("❌ Failed to fetch user:", err.message);
      setError("Failed to load user profile.");
      toast.error("Failed to load user profile 💥");
    } finally {
      setLoadingUser(false);
    }
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      toast.error("Please select a valid video file 📹");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a video to upload 📹");
      return;
    }

    setIsUploading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "reels_upload");
    formData.append("cloud_name", "dew9vyhs1");
    formData.append("resource_type", "video");

    try {
      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dew9vyhs1/video/upload",
        formData,
        {
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          },
        }
      );

      const cloudURL = cloudRes.data.secure_url;

      await axios.post(
        "http://localhost:5000/api/reels/upload",
        { videoUrl: cloudURL, caption },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("🎉 Reel uploaded successfully!");
      resetForm();
    } catch (err) {
      console.error("Upload failed:", err.message);
      toast.error("Upload failed 💥");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setCaption("");
    setProgress(0);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const memoizedUser = useMemo(() => user, [user]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <motion.button
            onClick={() => {
              setError(null);
              setLoadingUser(true);
              fetchUser();
            }}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 py-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg p-5 rounded-xl w-full max-w-lg border border-gray-200"
      >
        <h2 className="text-xl md:text-2xl font-bold text-center text-green-600 mb-4">
          🎥 Upload Your Reel
        </h2>

        {/* User Info */}
        {loadingUser ? (
          <div className="flex items-center gap-3 mb-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          memoizedUser && (
            <div
              className="flex items-center gap-3 mb-4 cursor-pointer"
              onClick={() => navigate(`/profile/${memoizedUser._id}`)}
            >
              <img
                src={memoizedUser.profileImage || profileDummy}
                className="w-10 h-10 rounded-full object-cover border border-green-500"
                alt={`${memoizedUser.name}'s profile`}
              />
              <div>
                <p className="font-medium text-gray-800 text-sm">{memoizedUser.name || "User"}</p>
                <p className="text-xs text-gray-500">Logged in</p>
              </div>
            </div>
          )
        )}

        {/* Upload Box */}
        <div
          className={`border-dashed border-2 ${
            isDragging ? "border-green-500 bg-green-100" : "border-green-300 bg-green-50"
          } p-4 rounded-lg text-center cursor-pointer hover:bg-green-100 transition`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="hidden"
            id="videoUpload"
            ref={fileInputRef}
          />
          <label htmlFor="videoUpload" className="cursor-pointer text-green-700 font-medium text-sm">
            {file ? <span className="truncate block max-w-full">{file.name}</span> : "📂 Click or drag to upload a video"}
          </label>
        </div>

        {/* Preview */}
        {preview && (
          <div className="relative mt-3">
            <video
              src={preview}
              controls
              className="rounded-lg w-full shadow-sm"
              aria-label="Video preview"
            />
            <button
              onClick={resetForm}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
            >
              <FaTimes size={12} />
            </button>
          </div>
        )}

        {/* Caption */}
        <input
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-2 mt-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm text-gray-800"
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`w-full mt-3 ${
            isUploading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          } text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm`}
        >
          {isUploading ? (
            <>
              <ClipLoader size={18} color="white" />
              Uploading...
            </>
          ) : (
            "🚀 Upload Now"
          )}
        </button>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
            <p className="text-xs text-gray-600 mt-1 text-center">{progress}%</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UploadReel;
