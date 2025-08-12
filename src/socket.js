// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

let isJoined = false;

export const initSocket = (userId) => {
  socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);
    if (!isJoined) {
      socket.emit("join", userId);
      console.log("📡 Joined as:", userId);
      isJoined = true;
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 Disconnected from socket server");
    isJoined = false;
  });

  socket.io.on("reconnect", (attempt) => {
    console.log(`🔄 Reconnected after ${attempt} attempts`);
    socket.emit("join", userId);
    isJoined = true;
  });
};

export default socket;
