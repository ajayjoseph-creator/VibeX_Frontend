import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';


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

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Pages without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp-varification" element={<OTPVerify />} />

        {/* All others with layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Hero />} />
          <Route path="/capture-upload" element={<CaptureUpload />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/interestSelector" element={<InterestSelector />} />
          <Route path="/edit_profile/:id" element={<EditProfile />} />
          <Route path="/upload_reel" element={<UploadReel />} />
          <Route path="/reels" element={<AllReelsFeed />} />
          <Route path="/search" element={<SearchUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
