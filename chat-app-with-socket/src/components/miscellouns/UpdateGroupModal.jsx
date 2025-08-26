import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { Chatcontext } from "../../context/chatContext";
import axios from "axios";
import { BaseUrl } from "../Url";

export default function UpdateGroupModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectchat, setselectchat, user, setchats } = useContext(Chatcontext);

  const [groupName, setGroupName] = useState(selectchat.chatName);

  const handleRename = async () => {
    if (!groupName) return;

    try {
      const { data } = await axios.put(
        `${BaseUrl}/api/chat/rename`,
        {
          chatId: selectchat._id,
          chatName: groupName,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setselectchat(data);
      setchats((prev) => prev.map((c) => (c._id === data._id ? data : c)));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="24px" textAlign="center">
            Update Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Enter new group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>

            {/* هنا ممكن تحط كمان جزء إضافة/حذف أعضاء */}
            <Box mt={4}>
              {/* Add/Remove Users Components */}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleRename}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
