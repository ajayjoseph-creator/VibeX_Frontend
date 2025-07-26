// components/UserListModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

function UserListModal({ title, users, onClose, onNavigate }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white w-full max-w-sm rounded-xl p-5 relative shadow-lg max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-xl text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          <AiOutlineClose />
        </button>

        {/* Modal Title */}
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        {/* User List */}
        {users?.length === 0 ? (
          <p className="text-gray-500 text-sm">No users found.</p>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u._id}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-all"
                onClick={() => {
                  onNavigate(u._id); // Navigate to user profile
                  onClose(); // Close modal
                }}
              >
                <img
                  src={u.profileImage || "/default-profile.png"}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{u.name}</span>
                  <span className="text-xs text-gray-500">@{u.username}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default UserListModal;
