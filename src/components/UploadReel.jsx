import React, { useState, useEffect } from 'react';
import { storage } from '../client/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from 'axios';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import profileDummy from '../assets/DummyProfile.jpeg';

function UploadReel() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
  const fetchUser = async () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      console.error("User or token missing");
      return;
    }

    const userData = JSON.parse(storedUser);
    const userId = userData?._id;

    if (!userId) {
      console.error("User ID missing in parsed data");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch user:", err.message);
    }
  };

  fetchUser();
}, []);


  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);

    const storageRef = ref(storage, `reels/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (error) => {
        console.error("Upload error:", error);
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const token = localStorage.getItem("token");

          await axios.post(
            "http://localhost:5000/api/reels",
            { videoUrl: downloadURL, caption },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          alert("🎉 Reel uploaded successfully!");
          setFile(null);
          setCaption('');
          setProgress(0);
          setPreview(null);
        } catch (err) {
          console.error("Backend error:", err.message);
        } finally {
          setIsUploading(false);
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl p-6 rounded-2xl w-full max-w-md border border-green-100"
      >
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">🎥 Upload Your Reel</h2>

        {/* User Preview */}
        {user && (
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user.profileImage || profileDummy}
              className="w-10 h-10 rounded-full object-cover border"
              alt="User Profile"
            />
            <div>
              <p className="font-medium text-gray-800">{user.name || "Unnamed User"}</p>
              <p className="text-xs text-gray-500">Logged in</p>
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="border-dashed border-2 border-green-300 p-4 rounded-md text-center cursor-pointer bg-green-50 hover:bg-green-100 transition">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
            className="hidden"
            id="videoUpload"
          />
          <label htmlFor="videoUpload" className="cursor-pointer text-green-700 font-medium">
            {file ? file.name : '📂 Click to select a video'}
          </label>
        </div>

        {/* Preview */}
        {preview && (
          <motion.video
            src={preview}
            controls
            className="rounded-md w-full mt-4 shadow-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}

        {/* Caption */}
        <input
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-2 mt-4 border rounded-md"
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`w-full mt-4 ${isUploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold py-2 rounded-md transition`}
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <ClipLoader size={18} color="white" /> Uploading...
            </span>
          ) : (
            '🚀 Upload Now'
          )}
        </button>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
            <motion.div
              className="bg-green-500 h-3"
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.3 }}
            />
            <p className="text-xs text-gray-600 mt-1 text-center">{progress.toFixed(0)}%</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default UploadReel;
