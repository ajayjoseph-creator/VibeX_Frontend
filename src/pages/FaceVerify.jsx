import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function FaceVerify() {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  const sendToBackend = async () => {
    if (!image) return alert("Capture a photo first");

    setLoading(true);
    const blob = await fetch(image).then(res => res.blob());
    const formData = new FormData();
    formData.append("image", blob, "captured.jpg");

    try {
      const res = await axios.post("http://localhost:5000/verify-face", formData);
      setGender(res.data.gender);
    } catch (err) {
      console.error("Face verification failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture} className="bg-blue-500 px-4 py-2 rounded text-white">📸 Capture</button>
      <button onClick={sendToBackend} className="bg-green-500 px-4 py-2 rounded text-white" disabled={loading}>
        {loading ? "Verifying..." : "✅ Verify Face"}
      </button>
      {gender && <p className="text-xl text-white">Gender Detected: <strong>{gender}</strong></p>}
    </div>
  );
}

export default FaceVerify;
