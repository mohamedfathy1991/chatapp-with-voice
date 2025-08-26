import { Button } from "@chakra-ui/react";
import React, { useRef } from "react";
import { io } from "socket.io-client";

export default function VoiceCall({ user, selectchat,socket }) {
   
  const peer = useRef(null);
  const remoteAudioRef = useRef(null);

  const startCall = async () => {
     
    peer.current = new RTCPeerConnection();
    // 1. خُد الصوت من الميكروفون
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => {
      peer.current.addTrack(track, stream);
    });
    // 2. لما يوصلك صوت من الطرف التاني
    peer.current.ontrack = (event) => {
      remoteAudioRef.current.srcObject = event.streams[0];
    };

    // 3. ابعت offer
    const offer = await peer.current.createOffer();
    await peer.current.setLocalDescription(offer);

    socket.emit("voice-offer", {
      offer,
      to: selectchat.users.find(c => c._id !== user.user._id)._id
    });

    // 4. استقبل answer
    socket.current.on("voice-answer", async ({ answer }) => {
      await peer.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // 5. تبادل ICE candidates
    peer.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("voice-candidate", {
          candidate: event.candidate,
          to: selectchat.users.find(c => c._id !== user.user._id)._id
        });
      }
    };

    socket.on("voice-candidate", async ({ candidate }) => {
      try {
        await peer.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate", err);
      }
    });
  };

  return (
    <div>
      <Button  onClick={startCall}>Start Voice Call</Button>
      <audio ref={remoteAudioRef} autoPlay controls />
    </div>
  );
}
