import { Button } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

export default function VoiceCall({ user, selectchat, socket }) {
  const peer = useRef(null);
  const remoteAudioRef = useRef(null);
  const localStream = useRef(null);

  const [incomingCall, setIncomingCall] = useState(null); // 🟡 حالة لو في مكالمة جاية
  const [inCall, setInCall] = useState(false); // 🟢 حالة لو في مكالمة شغالة

  // 🟢 بدء المكالمة
  const startCall = async () => {
    peer.current = new RTCPeerConnection();

    // خُد الصوت من الميكروفون
    localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.current.getTracks().forEach(track => {
      peer.current.addTrack(track, localStream.current);
    });

    // تشغيل صوت الطرف الآخر
    peer.current.ontrack = (event) => {
      remoteAudioRef.current.srcObject = event.streams[0];
    };

    // أنشئ offer وابعت للطرف التاني
    const offer = await peer.current.createOffer();
    await peer.current.setLocalDescription(offer);

    socket.emit("voice-offer", {
      offer,
      to: selectchat.users.find(c => c._id !== user.user._id)._id
    });

    // لو طلع عندي ICE candidate ابعته
    peer.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("voice-candidate", {
          candidate: event.candidate,
          to: selectchat.users.find(c => c._id !== user.user._id)._id
        });
      }
    };

    setInCall(true);
  };

  // 🛑 إنهاء المكالمة
  const endCall = () => {
    if (peer.current) {
      peer.current.close();
      peer.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    setInCall(false);
    setIncomingCall(null);

    socket.emit("end-call", {
      to: selectchat.users.find(c => c._id !== user.user._id)._id
    });
  };

  // 🟡 قبول المكالمة
  const acceptCall = async () => {
    if (!incomingCall) return;
    peer.current = new RTCPeerConnection();

    localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.current.getTracks().forEach(track => {
      peer.current.addTrack(track, localStream.current);
    });

    peer.current.ontrack = (event) => {
      remoteAudioRef.current.srcObject = event.streams[0];
    };

    await peer.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    const answer = await peer.current.createAnswer();
    await peer.current.setLocalDescription(answer);

    socket.emit("voice-answer", { answer, to: incomingCall.from });

    peer.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("voice-candidate", { candidate: event.candidate, to: incomingCall.from });
      }
    };

    setInCall(true);
    setIncomingCall(null);
  };

  // 🟡 استقبال المكالمات
  useEffect(() => {
    if (!socket) return;

    socket.on("voice-offer", ({ offer, from }) => {
      setIncomingCall({ offer, from }); // 📞 جه اتصال
    });

    socket.on("voice-answer", async ({ answer }) => {
      if (peer.current) {
        await peer.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("voice-candidate", async ({ candidate }) => {
      try {
        if (peer.current) {
          await peer.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error("Error adding ICE candidate", err);
      }
    });

    socket.on("end-call", () => {
      endCall();
    });

    return () => {
      socket.off("voice-offer");
      socket.off("voice-answer");
      socket.off("voice-candidate");
      socket.off("end-call");
    };
  }, [socket]);

  return (
    <div>
      {!inCall && (
        <Button colorScheme="blue" onClick={startCall}>Start Voice Call</Button>
      )}

      {incomingCall && !inCall && (
        <div>
          <p>📞 Incoming call...</p>
          <Button colorScheme="green" onClick={acceptCall}>Accept</Button>
          <Button colorScheme="red" onClick={endCall}>Reject</Button>
        </div>
      )}

      {inCall && (
        <Button colorScheme="red" onClick={endCall}>End Call</Button>
      )}

      <audio ref={remoteAudioRef} autoPlay controls />
    </div>
  );
}
