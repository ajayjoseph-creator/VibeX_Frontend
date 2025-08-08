import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import NotificationPopup from "./NotificationPopup";

const AppLayout = () => {
  const { pathname } = useLocation();
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  // Pages where sidebar should be hidden
  const hideSidebar = ["/login", "/register", "/otp-varification"].includes(pathname);

  return (
    <div className="flex">
      {/* Show Sidebar if not hidden */}
      {!hideSidebar && <Sidebar />}
      
      {/* ✅ Use parsedUser here */}
      {parsedUser && <NotificationPopup currentUserId={parsedUser._id} />}

      <div
        className={`flex-1 min-h-screen ${
          !hideSidebar ? "pl-16" : ""
        } transition-all duration-300`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
