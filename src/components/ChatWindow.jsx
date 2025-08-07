import React, { useState, useEffect, useRef } from "react";
import MessageInput from "./MessageInput";

const ChatWindow = ({
  messages,
  sender,
  receiver,
  onSend,
  replyTo: externalReplyTo,
  clearReplyTo: externalClearReplyTo,
  receiverDetails = {},
  onlineUsers = {},
}) => {
  const [replyTo, setReplyTo] = useState(null);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState(null);
  const bottomRef = useRef(null);

  const isReceiverOnline = onlineUsers?.[receiver];

  const getReceiverProfile = (msg) => {
    return msg.sender?._id === receiver
      ? msg.sender?.profileImage ||
          `https://ui-avatars.com/api/?name=${msg.sender?.name || "User"}`
      : null;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleReply = (msg) => setReplyTo(msg);

  const handleSend = (newMsg) => {
    onSend(newMsg);
    setReplyTo(null);
  };

  const handleReaction = async (msgId, emoji) => {
    try {
      const res = await fetch(`/api/messages/react/${msgId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ emoji }),
      });

      const data = await res.json();
      console.log("Reaction updated", data);
      setActiveReactionMsgId(null);
    } catch (error) {
      console.error("Failed to react", error);
    }
  };

  return (
    <div className="w-[70%] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white shadow-sm sticky top-0 z-10">
        <img
          src={
            receiverDetails?.profileImage ||
            `https://ui-avatars.com/api/?name=${receiverDetails?.name || "User"}`
          }
          alt={receiverDetails?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold">{receiverDetails?.name || "User"}</h2>
          <p className="text-sm text-gray-500">
            {isReceiverOnline ? "Online " : "Offline "}
          </p>
        </div>
      </div>

      {/* Message list with background image */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-3 bg-cover bg-center"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1526045431048-53fde7f1c63b?auto=format&fit=crop&w=1500&q=80")`,
        }}
      >
        {messages.map((msg) => {
          const isOwn = msg.sender === sender || msg.sender?._id === sender;

          return (
            <div
              key={msg._id || msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              {!isOwn && (
                <img
                  src={getReceiverProfile(msg)}
                  alt="receiver"
                  className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                />
              )}

              <div
                className={`p-3 max-w-xs rounded-lg relative backdrop-blur-sm bg-opacity-60 ${
                  isOwn ? "bg-green-200" : "bg-white"
                }`}
              >
                {/* Reply preview */}
                {msg.replyTo && (
                  <div className="text-xs italic text-gray-600 mb-1 border-l-4 border-green-400 pl-2">
                    Reply to:{" "}
                    {
                      messages.find((m) => m._id === msg.replyTo)?.message ||
                      "Message"
                    }
                  </div>
                )}

                <p>{msg.message}</p>

                {/* Footer actions */}
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                  <button
                    onClick={() => handleReply(msg)}
                    className="hover:text-green-600"
                  >
                    Reply
                  </button>

                  <button
                    onClick={() =>
                      setActiveReactionMsgId(
                        activeReactionMsgId === msg._id ? null : msg._id
                      )
                    }
                    className="hover:text-red-500"
                  >
                    React
                  </button>

                  {isOwn && (
                    <span className="ml-2 text-[10px] text-green-700">
                      {msg.isRead ? "Seen 👀" : "Delivered ✔️"}
                    </span>
                  )}
                </div>

                {/* Emoji Picker */}
                {activeReactionMsgId === msg._id && (
                  <div className="mt-2 flex gap-2 text-lg">
                    {["❤️", "😂", "👍", "🔥", "🥺"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(msg._id, emoji)}
                        className="hover:scale-110 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Reactions display */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex gap-1 mt-1 text-sm">
                    {msg.reactions.map((r, index) => (
                      <span key={index}>{r.emoji}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Message input */}
      <MessageInput
        sender={sender}
        receiver={receiver}
        onSend={handleSend}
        replyTo={replyTo}
        clearReplyTo={() => setReplyTo(null)}
      />
    </div>
  );
};

export default ChatWindow;
