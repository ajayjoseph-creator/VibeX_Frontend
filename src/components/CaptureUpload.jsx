import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { FaUpload, FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CaptureUpload() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id) {
      setUserId(storedUser._id);
    }
  }, []);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const upload = async () => {
    if (!capturedImage) {
      setUploadStatus("No image captured.");
      return;
    }

    try {
      setUploadStatus("Uploading...");
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      const file = new File([blob], "captured.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const response = await axios.post(
        "http://localhost:5000/api/users/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Uploaded:", response.data);
      toast.success("Upload successful!");
      setUploadStatus("Upload successful!");

      // Navigate to home after short delay
      setTimeout(() => {
        navigate("/"); // 🔁 Change path if your homepage route is different
      }, 1000);

    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed.");
      setUploadStatus("Upload failed.");
    }
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      {/* Full Screen Webcam */}
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover shadow-[0_0_60px_rgba(255,255,255,0.2)]"
        videoConstraints={{ facingMode: "user" }}
      />

      {/* Helper Text */}
      <div className="absolute top-5 text-white text-lg font-semibold bg-black/40 px-4 py-2 rounded-xl shadow">
        📸 Please ensure your face is clearly visible in good lighting
      </div>

      {/* Buttons */}
      <div className="absolute bottom-10 flex gap-4">
        <button
          onClick={capture}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-md text-lg flex items-center gap-2"
        >
          <FaCamera /> Click
        </button>
        <button
          onClick={upload}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-md text-lg flex items-center gap-2"
        >
          <FaUpload /> Upload
        </button>
      </div>

      {/* Preview Image */}
      {capturedImage && (
        <div className="absolute bottom-5 right-5 w-40 h-32 rounded-md overflow-hidden border-2 border-white shadow-lg">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Upload Status */}
      {uploadStatus && (
        <div className="absolute top-20 text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-lg shadow">
          {uploadStatus}
        </div>
      )}
    </div>
  );
}

export default CaptureUpload;
