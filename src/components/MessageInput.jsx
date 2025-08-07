import React, { useState } from "react";
import axios from "../api/axiosInstance";

const MessageInput = ({ sender, receiver, onSend, replyTo, clearReplyTo }) => {
  const [msg, setMsg] = useState("");

  const handleSend = async () => {
    if (!msg.trim()) return;

    const newMsg = {
      sender,
      receiver,
      message: msg,
      replyTo: replyTo?._id || null,
    };

    try {
      const { data } = await axios.post("/messages/send", newMsg);
      onSend(data);
      setMsg("");
      clearReplyTo(); // ✅ call correctly
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  return (
    <div className="p-4 bg-white border-t flex flex-col gap-2">
      {replyTo && (
        <div className="bg-gray-100 p-2 rounded border-l-4 border-green-400">
          <p className="text-sm text-gray-600">Replying to:</p>
          <p className="text-sm font-medium text-gray-800">{replyTo.message}</p>
          <button
            onClick={clearReplyTo} // ✅ correct handler here
            className="text-red-500 text-xs mt-1 self-start"
          >
            Cancel
          </button>
        </div>
      )}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message"
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
