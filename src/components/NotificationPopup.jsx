// NotificationPopup.jsx
import { useEffect, useState } from "react";
import socket from "../socket";

const NotificationPopup = ({ currentUserId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("getNotification", (data) => {
      if (data.receiverId === currentUserId) {
        setNotifications((prev) => [data, ...prev]);
      }
    });

    return () => socket.off("getNotification");
  }, [currentUserId]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((n, i) => (
        <div
          key={i}
          className="bg-white shadow px-4 py-2 rounded border border-green-400"
        >
          🟢 User {n.senderId} followed you!
        </div>
      ))}
    </div>
  );
};

export default NotificationPopup;
