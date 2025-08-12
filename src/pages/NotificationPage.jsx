import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [followingList, setFollowingList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?._id;
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    const fetchFollowing = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${userId}/following`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowingList(res.data.following.map((f) => f._id));
      } catch (e) {
        console.error("Error fetching following list", e);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/notifications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(res.data);
      } catch (e) {
        console.error("Error fetching notifications", e);
      } finally {
        setLoading(false);
      }
    };

    const init = async () => {
      await fetchFollowing();
      await fetchNotifications();

      const newSocket = io("http://localhost:5000", { auth: { token } });
      newSocket.emit("join", userId);
      setSocket(newSocket);
    };

    init();

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, []);

  useEffect(() => {
    if (!socket || followingList.length === 0) return;

    const onNotification = (notification) => {
      if (
        notification?.sender &&
        followingList.includes(notification.sender._id)
      ) {
        setNotifications((prev) => [notification, ...prev]);
      }
    };

    socket.on("receive_notification", onNotification);

    return () => {
      socket.off("receive_notification", onNotification);
    };
  }, [socket, followingList]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error("Error marking as read", e);
    }
  };

  const handleNotificationClick = (note) => {
    if (!note.isRead) markAsRead(note._id);
    navigate(`/profile/${note.sender._id}`);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Notifications</h1>
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="flex items-center p-4 mb-2 border rounded shadow-sm"
          >
            <Skeleton circle width={48} height={48} className="mr-4" />
            <div className="flex-1">
              <Skeleton width="60%" height={16} />
              <Skeleton width="40%" height={12} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul>
          {notifications.map((note) => (
            <li
              key={note._id}
              onClick={() => handleNotificationClick(note)}
              className={`flex items-center p-4 mb-2 rounded border cursor-pointer transition-all ${
                note.isRead ? "bg-gray-100" : "bg-green-100 font-semibold"
              }`}
            >
              <img
                src={note.sender.profileImage || "/default-profile.png"}
                alt={`${note.sender.username || note.sender.name}'s profile`}
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <p>
                  <strong>{note.sender.name || note.sender.username}</strong>:{" "}
                  {note.message}
                </p>
                <small className="text-gray-500">
                  {new Date(note.createdAt).toLocaleString()}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
