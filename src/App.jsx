import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { initSocket } from './socket'; // ✅ only initSocket import

import Hero from './components/Hero';
import Register from './pages/Register';
import Login from './pages/Login';
import OTPVerify from './pages/OTPVerify';
import CaptureUpload from './components/CaptureUpload';
import UserProfile from './components/Profile';
import InterestSelector from './components/InterestSelector';
import EditProfile from './components/EditProfile';
import UploadReel from './components/UploadReel';
import AllReelsFeed from './components/AllReelsFeed';
import SearchUsers from './components/SearchUsers';
import AppLayout from './components/AppLayout';
import ChatPage from './pages/ChatPage';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import MapPage from './pages/MapPage';
import NotificationPage from './pages/NotificationPage';
import VideoCall from './components/VideoCall';

// ✅ Video Call Wrapper
function VideoCallWrapper() {
  const { receiverId } = useParams();
  const senderId = JSON.parse(localStorage.getItem("user"))?._id;
  return <VideoCall userId={senderId} remoteUserId={receiverId} />;
}

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Socket join setup with reconnect
  useEffect(() => {
    if (user?._id) {
      initSocket(user._id);
    }
  }, [user?._id]);

  return (
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} theme="light" limit={3} />

      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp-varification" element={<OTPVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected pages */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Hero />} />
          <Route path="/capture-upload" element={<CaptureUpload />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/interestSelector" element={<InterestSelector />} />
          <Route path="/edit_profile/:id" element={<EditProfile />} />
          <Route path="/upload_reel" element={<UploadReel />} />
          <Route path="/reels" element={<AllReelsFeed />} />
          <Route path="/search" element={<SearchUsers />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/messages/:receiverId" element={<ChatPage />} />
          <Route path="/location-search" element={<MapPage />} />
          <Route path="/video-call/:receiverId" element={<VideoCallWrapper />} />
          <Route path="/notifications" element={<NotificationPage userId={user?._id} />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
