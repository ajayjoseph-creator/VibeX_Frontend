import React, { useEffect, useState } from "react";
import socket from "../socket";

export default function IncomingCallNotification({ userId, onAccept, onReject }) {
  const [caller, setCaller] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const handleIncomingCall = ({ fromUserId, metadata }) => {
      if (fromUserId !== userId) { // ignore if somehow self
        setCaller({ fromUserId, metadata });
      }
    };

    socket.on("incoming_call", handleIncomingCall);

    return () => {
      socket.off("incoming_call", handleIncomingCall);
    };
  }, [userId]);

  if (!caller) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg z-50">
      <p>Incoming call from {caller.fromUserId}</p>
      <button onClick={() => { onAccept(caller.fromUserId); setCaller(null); }} className="mr-2 px-3 py-1 bg-green-600 rounded">Accept</button>
      <button onClick={() => { onReject(caller.fromUserId); setCaller(null); }} className="px-3 py-1 bg-red-600 rounded">Reject</button>
    </div>
  );
}
