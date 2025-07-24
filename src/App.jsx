import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
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

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register', '/otp-varification'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex">
      {shouldShowNavbar && <Navbar />} {/* Fixed Sidebar */}
      
      <div className={`${shouldShowNavbar ? 'pl-64' : ''} flex-1`}>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp-varification" element={<OTPVerify />} />
          <Route path="/capture-upload" element={<CaptureUpload />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/interestSelector" element={<InterestSelector />} />
          <Route path="/edit_profile/:id" element={<EditProfile />} />
          <Route path="/upload_reel" element={<UploadReel />} />
          <Route path="/reels" element={<AllReelsFeed />} />
          <Route path="/search" element={<SearchUsers />} />

        </Routes>
      </div>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
