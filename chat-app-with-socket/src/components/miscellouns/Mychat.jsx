import { Avatar, Box, Button, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { Chatcontext } from '../../context/chatContext';
import Groupchatmodel from './Groupchatmodel';
import { BaseUrl } from '../Url';

export default function Mychat() {
  const { user, setselectchat, chats, setchats } = useContext(Chatcontext);

  const fetchchat = async () => {
    try {
      const { data } = await axios.get(`${BaseUrl}/api/chat`, {
        headers: {
          token: user?.token, // أو Authorization: `Bearer ${user?.token}` لو السيرفر متوقع كده
        },
      });

       
      setchats(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchchat();
  }, [user]);
 
   const addgroup=()=>{
    
   }
  return (
   <VStack
  spacing={1}
  align="stretch"
  bg="blue.800"
  h="91.5vh" // أو ممكن تحط ارتفاع مناسب زي 80vh
  overflowY="auto"
  p={2}
>
  <Groupchatmodel>
    <Button
      onClick={addgroup}
      bg="red.500"
      w="50%"
      color="blue"
    >
      + add group
    </Button>
  </Groupchatmodel>

  {chats &&
    chats.map((chat) => {
      const otherUser = !chat.isGroup
        ? chat.users.find((u) => u._id !== user.user._id)
        : null;

      return (
        <Box
          key={chat._id}
          onClick={() => setselectchat(chat)}
          p={3}
          _hover={{ bg: "black", cursor: "pointer" }}
          display="flex"
          alignItems="center"
        >
          <Avatar src={chat.isGroup ? "" : otherUser?.pic} size="md" />
          <Box ml={3} flex="1">
            <Text fontWeight="bold" color="white">
              {chat.isGroup ? chat.chatname : otherUser?.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {chat.isGroup ? "Group Chat" : otherUser?.email}
            </Text>
          </Box>
        </Box>
      );
    })}
</VStack>

  );
}
