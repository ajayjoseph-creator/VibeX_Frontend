// src/components/VideoCall.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";

export default function VideoCall({ userId, remoteUserId: propRemoteUserId, onClose }) {
  const { receiverId: paramReceiverId } = useParams();
  const navigate = useNavigate();

  const remoteUserId = propRemoteUserId || paramReceiverId;
  const isCaller = !!propRemoteUserId;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  const [status, setStatus] = useState("init");

  useEffect(() => {
    if (!userId || !remoteUserId) {
      console.warn("VideoCall: missing userId or remoteUserId");
      return;
    }

    function createPeerConnection(iceTargetUserId = remoteUserId) {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (["connected", "completed"].includes(pc.iceConnectionState)) {
          setStatus("connected");
        } else if (["disconnected", "failed"].includes(pc.iceConnectionState)) {
          setStatus("error");
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            targetUserId: iceTargetUserId,
            candidate: event.candidate,
            fromUserId: userId,
          });
        }
      };

      return pc;
    }

    async function getLocalStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        return stream;
      } catch (err) {
        console.error("getUserMedia error:", err);
        setStatus("error");
        throw err;
      }
    }

    async function onOffer({ fromUserId, offer }) {
      if (isCaller) return;

      console.log("📨 Offer received from", fromUserId);

      try {
        const pc = pcRef.current || createPeerConnection(fromUserId);
        pcRef.current = pc;

        if (!localStreamRef.current) {
          const stream = await getLocalStream();
          stream.getTracks().forEach((t) => pc.addTrack(t, stream));
        }

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", {
          targetUserId: fromUserId,
          answer,
          fromUserId: userId,
        });

        console.log("📩 Answer sent ->", fromUserId);
        setStatus("connected");
      } catch (err) {
        console.error("onOffer error:", err);
        setStatus("error");
      }
    }

    async function onAnswer({ fromUserId, answer }) {
      if (!isCaller) return;
      console.log("📨 Answer received from", fromUserId);

      try {
        if (!pcRef.current) return;
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setStatus("connected");
      } catch (err) {
        console.error("onAnswer error:", err);
        setStatus("error");
      }
    }

    async function onRemoteIce({ fromUserId, candidate }) {
      try {
        if (!pcRef.current) return;
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("onRemoteIce error:", err);
      }
    }

    async function startAsCaller() {
      try {
        setStatus("calling");
        const stream = await getLocalStream();

        const pc = createPeerConnection(remoteUserId);
        pcRef.current = pc;

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("offer", {
          targetUserId: remoteUserId,
          offer,
          fromUserId: userId,
        });

        console.log("📞 Offer sent ->", remoteUserId);
      } catch (err) {
        console.error("startAsCaller error:", err);
        setStatus("error");
      }
    }

    async function startAsCallee() {
      try {
        setStatus("init");
        const stream = await getLocalStream();

        const pc = createPeerConnection();
        pcRef.current = pc;

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        console.log("Callee ready, waiting for offer...");
        // ✅ Ensure backend knows callee is ready
        socket.emit("ready-for-offer", { userId });
      } catch (err) {
        console.error("startAsCallee error:", err);
        setStatus("error");
      }
    }

    // Register socket events first
    socket.on("offer", onOffer);
    socket.on("answer", onAnswer);
    socket.on("ice-candidate", onRemoteIce);

    // Start the role-specific flow
    if (isCaller) {
      startAsCaller();
    } else {
      startAsCallee();
    }

    return () => {
      socket.off("offer", onOffer);
      socket.off("answer", onAnswer);
      socket.off("ice-candidate", onRemoteIce);

      pcRef.current?.close();
      pcRef.current = null;

      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    };
  }, [userId, remoteUserId]);

  function endCall() {
    socket.emit("end_call", { targetUserId: remoteUserId, fromUserId: userId });

    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    if (onClose) onClose();
    else navigate(-1);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 flex flex-col items-center justify-center z-50 p-4">
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-72 rounded-lg bg-black" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-72 rounded-lg bg-black" />
      </div>

      <div className="mt-4 text-white">
        {status === "calling" && <div>Calling... 🔔</div>}
        {status === "connected" && <div>In Call</div>}
        {status === "init" && <div>Waiting for connection...</div>}
        {status === "error" && <div>Connection error. Check console.</div>}
      </div>

      <div className="mt-4">
        <button onClick={endCall} className="px-6 py-2 bg-red-600 text-white rounded-full">
          End Call
        </button>
      </div>
    </div>
  );
}
