import { Avatar, Box, FormControl, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Chatcontext } from "../../context/chatContext";
import { io } from "socket.io-client";
import VoiceCall from "./Voicecall";
import { BaseUrl } from "../Url";

export default function SingleMessagebox({ selectchat }) {
  const { user } = useContext(Chatcontext);
  
  const [messages, setmessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");
  const messagesEndRef = useRef(null);
  
  const socketRef = useRef();
   



  console.log((selectchat?.users.find((c)=>c._id!=user.user._id))?._id);
  


  const getMessage = async () => {
    try {
      setloading(true);
      const { data } = await axios.get(
        `${BaseUrl}/api/message/${selectchat._id}`,
        {
          headers: {
            token: user?.token,
          },
        }
      );
      setloading(false);
      setmessages(data);
    } catch (err) {
      console.log(err);
      alert("Error occurred while fetching messages");
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return; // مايبعتش فاضية
    try {
      setloading(true);
      const { data } = await axios.post(
        `http://localhost:5000/api/message`,
        {
          content: message,
          chatid: selectchat._id,
        },
        {
          headers: {
            token: user?.token,
          },
        }
      );
      socketRef.current.emit("sendPrivateMessage", {
       message:{
         sender:user.user,
          contents: message,
          chat:selectchat,

       },
      reciverid: selectchat?.users.find((c)=>c._id!=user.user._id),
        
       });

      setloading(false);
      setmessages([...messages, data]);
      
      setmessage(""); // يمسح الـ input
    } catch (err) {
      console.log(err);
      alert("Error occurred while sending message");
    }
  };

  // scroll لآخر رسالة تلقائيًا
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectchat) {
      getMessage();
    }
  }, [selectchat]);
  


  // socket start
useEffect(() => {
  socketRef.current = io(`${BaseUrl}`, {
    auth: { userId: user }
  });
   socketRef.current.on("privateMessage", (newMessage) => {
    console.log(newMessage);
    
    setmessages((prev) => [...prev, newMessage]);
  });

  return () => {
    socketRef.current.disconnect();
  };
}, [user.user]);


  return (
    <Box flex="1" display="flex" flexDirection="column" bg={"gray.900"}>
      {!selectchat ? (
        "Select chat"
      ) : (
        <>
          {/* الرسائل */}
          <Box
            flex="1"
            overflowY="auto"
            px="4"
            py="5"
            maxH="calc(100vh - 120px)" // ارتفاع الرسائل فقط
          >
            {messages?.map((msg) => {
              const isMe = msg.sender._id === user.user._id;
              return (
                <Box
                  key={msg._id}
                  display="flex"
                  justifyContent={isMe ? "flex-end" : "flex-start"}
                  mb="2"
                >
                  {!isMe && <Avatar src={msg.sender.pic} size="sm" mr="2" />}
                  <Box>
                    {!isMe && (
                      <Text fontSize="xs" color="gray.500">
                        {msg.sender.name}
                      </Text>
                    )}
                    <Box
                      display="inline-block"
                      bg={isMe ? "blue.500" : "gray.300"}
                      color={isMe ? "white" : "black"}
                      px="3"
                      py="2"
                      borderRadius="lg"
                      maxW="300px"
                      wordBreak="break-word"
                    >
                      {msg.contents}
                    </Box>
                  </Box>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>

          {/* input box */}
           {selectchat && (
        <VoiceCall user={user} selectchat={selectchat} socket={socketRef.current} />
           )}
          <FormControl p="3" borderTop="1px solid #ccc">
            <Input bg={"whiteAlpha.800"}
              placeholder="Enter your message here"
              value={message}
              onChange={(e) => setmessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
          </FormControl>
        </>
      )}
    </Box>
  );
}
