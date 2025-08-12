import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import IncomingCallNotification from "../components/IncomingCallNotification";

const AppLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser?._id || parsedUser?.id; // whatever your user id key is

  // Pages where sidebar should be hidden
  const hideSidebar = ["/login", "/register", "/otp-varification"].includes(pathname);

  // Handlers for call accept/reject
  const handleAccept = (callerId) => {
    navigate(`/video-call/${callerId}`);
  };

  const handleReject = (callerId) => {
    // emit socket event if needed
    // socket.emit('reject_call', { targetUserId: callerId, fromUserId: userId });
    console.log("Call rejected from", callerId);
  };

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar user={parsedUser} />}
      <div className={`flex-1 min-h-screen ${!hideSidebar ? "pl-16" : ""} transition-all duration-300`}>
        <IncomingCallNotification userId={userId} onAccept={handleAccept} onReject={handleReject} />
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
