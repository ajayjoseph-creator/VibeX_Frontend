import React, { useState, useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import { FiVideo } from "react-icons/fi";
import VideoCall from "./VideoCall";
import socket from "../socket";

const ChatWindow = ({
  messages,
  sender,
  receiver,
  onSend,
  receiverDetails = {},
  onlineUsers = {},
}) => {
  const [replyTo, setReplyTo] = useState(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const bottomRef = useRef(null);

  const isReceiverOnline = onlineUsers?.[receiver];

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Incoming video call listener
  useEffect(() => {
    const handleIncomingCall = ({ fromUserId }) => {
      console.log("Incoming call from:", fromUserId);
      setShowVideoCall(true);
    };
    socket.on("incoming_call", handleIncomingCall);
    return () => socket.off("incoming_call", handleIncomingCall);
  }, []);

  const handleSend = (newMsg) => {
    onSend(newMsg);
    setReplyTo(null);
  };

  const startVideoCall = () => {
    socket.emit("call_user", { targetUserId: receiver, fromUserId: sender });
    setShowVideoCall(true);
  };

  return (
    <div className="w-[70%] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b bg-white shadow-sm sticky top-0 z-10">
        <div>
          <h2 className="font-semibold">{receiverDetails?.name || "User"}</h2>
          <p className="text-sm text-gray-500">
            {isReceiverOnline ? "Online" : "Offline"}
          </p>
        </div>

        <button
          onClick={startVideoCall}
          className="p-2 rounded-full hover:bg-green-100 transition"
          title="Start Video Call"
        >
          <FiVideo className="text-green-600" size={22} />
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-3"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1526045431048-53fde7f1c63b?auto=format&fit=crop&w=1500&q=80")',
          backgroundSize: "cover",
        }}
      >
        {messages.map((msg) => {
          const isOwn = msg.sender === sender || msg.sender?._id === sender;
          return (
            <div
              key={msg._id || msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 max-w-xs rounded-lg relative backdrop-blur-sm bg-opacity-60 ${
                  isOwn ? "bg-green-200" : "bg-white"
                }`}
              >
                {msg.replyTo && (
                  <div className="text-xs italic text-gray-600 mb-1 border-l-4 border-green-400 pl-2">
                    Reply to:{" "}
                    {messages.find((m) => m._id === msg.replyTo)?.message ||
                      "Message"}
                  </div>
                )}
                <p>{msg.message}</p>
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                  <button
                    onClick={() => setReplyTo(msg)}
                    className="hover:text-green-600"
                  >
                    Reply
                  </button>
                  {isOwn && (
                    <span className="ml-2 text-[10px] text-green-700">
                      {msg.isRead ? "Seen 👀" : "Delivered ✔️"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        sender={sender}
        receiver={receiver}
        onSend={handleSend}
        replyTo={replyTo}
        clearReplyTo={() => setReplyTo(null)}
      />

      {/* Video Call UI */}
      {showVideoCall && (
        <VideoCall
          userId={sender}
          remoteUserId={receiver}
          onClose={() => setShowVideoCall(false)}
        />
      )}
    </div>
  );
};

export default ChatWindow;
