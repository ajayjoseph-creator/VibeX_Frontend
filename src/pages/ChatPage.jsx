import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SidebarChat from "../components/SidebarChat";
import ChatWindow from "../components/ChatWindow";
import axiosInstance from "../api/axiosInstance";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const { receiverId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user._id);
      if (socket.connected) {
        socket.emit("join", user._id);
      } else {
        socket.on("connect", () => {
          socket.emit("join", user._id);
        });
      }
    }
  }, []);

  useEffect(() => {
    socket.on("online_users", (onlineUserList) => {
      const onlineMap = {};
      onlineUserList.forEach((id) => {
        onlineMap[id] = true;
      });
      setOnlineUsers(onlineMap);
    });

    return () => socket.off("online_users");
  }, []);

  useEffect(() => {
    if (receiverId) setSelectedUser(receiverId);
  }, [receiverId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axiosInstance.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data);
      } catch (err) {
        console.error("\u274C Failed to fetch users:", err);
      }
    };

    if (currentUser) fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/messages/${currentUser}/${selectedUser}`
        );
        setMessages(data);

        socket.emit("mark_read", {
          senderId: selectedUser,
          receiverId: currentUser,
        });
      } catch (err) {
        console.error("\u274C Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [selectedUser, currentUser]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setIncomingMessage(msg);
      if (msg.senderId === selectedUser) {
        setMessages((prev) => [...prev, msg]);

        socket.emit("mark_read", {
          senderId: selectedUser,
          receiverId: currentUser,
        });
      }
    });

    return () => socket.off("receive_message");
  }, [selectedUser, currentUser]);

  const handleNewMessage = (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);

    if (newMsg?.message?.trim()) {
      socket.emit("send_message", {
        senderId: currentUser,
        receiverId: selectedUser,
        message: newMsg.message,
      });
    }
  };

  if (!currentUser) return <div>Loading user...</div>;

  return (
    <div className="flex h-screen w-full">
      <SidebarChat
        onSelectUser={setSelectedUser}
        currentUser={currentUser}
        users={users}
        incomingMessage={incomingMessage}
        onlineUsers={onlineUsers} // Pass to sidebar
      />
      {selectedUser && (
        <ChatWindow
          sender={currentUser}
          receiver={selectedUser}
          messages={messages}
          onSend={handleNewMessage}
          receiverDetails={users.find((u) => u._id === selectedUser)}
          onlineUsers={onlineUsers} // Pass to chat window
        />
      )}
    </div>
  );
};

export default ChatPage;
