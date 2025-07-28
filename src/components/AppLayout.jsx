// src/layouts/AppLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const AppLayout = () => {
  const { pathname } = useLocation();

  // Pages where sidebar should be hidden
  const hideSidebar = ["/login", "/register", "/otp-varification"].includes(pathname);

  return (
    <div className="flex">
      {/* Show Sidebar if not hidden */}
      {!hideSidebar && <Sidebar />}

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
