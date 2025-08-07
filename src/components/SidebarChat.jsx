import React, { useState, useEffect } from "react";

const SidebarChat = ({
  currentUser,
  onSelectUser,
  users = [],
  incomingMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [lastMessages, setLastMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});

  // 🔁 Handle incoming messages: update last message + unread count
  useEffect(() => {
    if (incomingMessage?.senderId && incomingMessage?.message) {
      setLastMessages((prev) => ({
        ...prev,
        [incomingMessage.senderId]: {
          message: incomingMessage.message,
          createdAt: new Date(),
        },
      }));

      setUnreadCounts((prev) => ({
        ...prev,
        [incomingMessage.senderId]: (prev[incomingMessage.senderId] || 0) + 1,
      }));
    }
  }, [incomingMessage]);

  // 📍 Reset unread count when a user is selected
  const handleSelectUser = (userId) => {
    setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));
    onSelectUser(userId);
  };

  // 🔍 Filter users
  const filteredUsers = users
    .filter((user) => user._id !== currentUser)
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // 🔝 Sort by unread count and latest message time
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const unreadA = unreadCounts[a._id] || 0;
    const unreadB = unreadCounts[b._id] || 0;
    if (unreadB !== unreadA) return unreadB - unreadA;

    const timeA = lastMessages[a._id]?.createdAt || 0;
    const timeB = lastMessages[b._id]?.createdAt || 0;
    return new Date(timeB) - new Date(timeA);
  });

  return (
    <div className="w-[30%] bg-gray-100 p-4 overflow-y-auto border-r">
      <input
        type="text"
        placeholder="Search or start a chat"
        className="w-full mb-4 p-2 rounded bg-white border"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {sortedUsers.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between p-3 rounded hover:bg-gray-200 cursor-pointer"
          onClick={() => handleSelectUser(user._id)}
        >
          <div className="flex items-center gap-3">
            <img
              src={
                user.profileImage ||
                `https://ui-avatars.com/api/?name=${user.name}`
              }
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-600 max-w-[150px] truncate">
                {lastMessages[user._id]?.message || "Say hi 👋"}
              </p>
            </div>
          </div>

          {/* 🔴 Unread badge */}
          {unreadCounts[user._id] > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCounts[user._id]}
            </span>
          )}
        </div>
      ))}

      {sortedUsers.length === 0 && (
        <p className="text-center text-sm text-gray-500 mt-4">
          No users found.
        </p>
      )}
    </div>
  );
};

export default SidebarChat;
