import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import OTPVerify from './pages/OTPVerify';
import CaptureUpload from './components/CaptureUpload';
import UserProfile from './components/Profile';


function App() {
  return (
    
    <BrowserRouter>
      <Navbar />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/otp-varification' element={<OTPVerify/>}/>
        <Route path='/capture-upload' element={<CaptureUpload/>}/>
        <Route path='/profile/:id' element={<UserProfile/>}/>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
