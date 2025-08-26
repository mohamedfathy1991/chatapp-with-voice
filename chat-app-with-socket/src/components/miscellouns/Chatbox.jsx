import React, { useContext, useEffect, useState } from 'react';
import { Chatcontext } from '../../context/chatContext';
import { 
  Box, 
  Text, 
  IconButton, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter, 
  Button,
  useDisclosure
} from "@chakra-ui/react";
import { InfoIcon, EditIcon } from "@chakra-ui/icons";
import ChatInfoModal from './ChatinfoModal';
import SingleMessagebox from "./SingleMessagebox";

export default function Chatbox() {
  const { user, selectchat } = useContext(Chatcontext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState(null); // user || group

  const getSenderName = (loggedUser, users = []) => {
    return users.find((u) => u._id !== loggedUser.user._id)?.name;
  };

  const handleOpenModal = () => {
    if (selectchat?.isGroup) {
      setModalType("group");
    } else {
      setModalType("user");
    }
    onOpen();
  };
  
  return (
    <Box 
      w="100%" 
      h="100%" 
      display="flex" 
      flexDir="column" 
      border="1px solid #ccc"
      borderRadius="md"
      bg={"green"}
    >
      {/* الهيدر */}
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between" 
        h="60px" 
        borderBottom="1px solid #ccc"
        bg="gray.100"
        px="4"
      >
        {selectchat ? (
          <Text fontSize="xl" fontWeight="bold">
            {selectchat.isGroup 
              ? selectchat.chatname 
              : getSenderName(user, selectchat.users)}
          </Text>
        ) : (
          <Text fontSize="lg" color="gray.500">
            اختر محادثة لعرضها
          </Text>
        )}

        {selectchat && (
          <IconButton
          bg={'blue.300'}
            aria-label="chat info"
            icon={selectchat.isGroup ? <EditIcon /> : <InfoIcon />}
            onClick={handleOpenModal}
            size="sm"
          />
        )}
      </Box>

      {/* الرسائل */}
      <SingleMessagebox  selectchat={selectchat} />
      

      {/* المودال */}
       <ChatInfoModal
        user={user} 
         selectchat={selectchat}
         isOpen={isOpen}
        onClose={onClose}
        modalType={modalType}
        getSenderName={getSenderName}
       
       
       />
    </Box>
  );
}
