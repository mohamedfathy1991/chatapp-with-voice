import {
  Avatar,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Input,
  IconButton,
  FormControl,
  Toast,
  useConst
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Chatcontext } from "../../context/chatContext";
import { BaseUrl } from "../Url";
 
export default function ChatInfoModal({ 
  isOpen, 
  onClose, 
  modalType, 
  selectchat, 
  user, 
  getSenderName 
}) {
     
   const {setchats,chats}=useContext(Chatcontext)
  const [groupname, setgroupname] = useState(selectchat?.chatname || "");
  const [selecteduser, setselecteduser] = useState(selectchat?.users || []);
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setLoading] = useState(false);
  
 const removechat=()=>{
  console.log('remove');
  
 }
  const handleRemove = (u) => {
     
    
    
    setselecteduser(selecteduser.filter((usr) => usr._id != u._id));
  
    
  };

  const handleAdd = async (u) => {
    if (selecteduser.find((usr) => usr._id === u._id)) {
      alert("User already exists in group");
      return;
    }
    setselecteduser([...selecteduser, u]);
  };

  const handleSearch = async (query) => {
    setsearch(query);
    if (!query) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${BaseUrl}/api/user?search=${query}`,
        { headers: { token: user?.token } }
      );
      setsearchresult(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGroup = async () => {
    try {
      await axios.put(
        `${BaseUrl}/api/chat/group/${selectchat._id}`,
        {
          chatname: groupname,
          users: JSON.stringify(selecteduser.map((u) => u._id)),
        },
        { headers: { token: user?.token } }
      );
      onClose();
    } catch (err) {
      console.log(err);
    }
  };
  
 useEffect(()=> {
  setgroupname(selectchat?.chatname);
  setselecteduser(selectchat?.users);
}, [selectchat,chats]);

const handleRename = async () => {
  console.log(groupname);
  
    if (!groupname) return;
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${BaseUrl}/api/chat/rename`,
        { groupid: selectchat._id, chatname: groupname },
        { headers: { token: user.token } }
      );


  
 
 

       setchats((prev) => prev.map((c) => (c._id === data._id ? data : c)));
      setLoading(false);
      onClose();
    } catch (err) {
      console.log(err)
      Toast({ title: 'فشل تعديل الاسم', status: 'error' });
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {modalType === "group" ? "Group Settings" : "User Info"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {modalType === "user" && (
            <Box textAlign="center">
              <Avatar
                size="xl"
                src={
                  selectchat?.users.find((u) => u._id !== user.user._id)?.pic
                }
                mb={3}
              />
              <Text fontWeight="bold" fontSize="xl">
                {getSenderName(user, selectchat?.users)}
              </Text>
              <Text color="gray.500">
                {
                  selectchat?.users.find((u) => u._id !== user.user._id)
                    ?.email
                }
              </Text>
            </Box>
          )}

          {modalType === "group" && (
            <>
              {/* تعديل اسم الجروب */}
             <FormControl>
              <Input
                placeholder="اكتب اسم جديد"
                value={groupname}
                onChange={(e) => setgroupname(e.target.value)}
                />
              <Button   mt={2} 
                onClick={()=>handleRename()}

              isLoading={loading}>
                تعديل الاسم
              </Button>
            </FormControl>

              {/* عرض الأعضاء */}
              <Box display="flex" flexWrap="wrap" gap="2" mb={4}>
                {selectchat.users
                .filter((u) => u._id != user.user._id)
                .map((u) => (
                  <Box
                    key={u._id}
                    display="flex"
                    alignItems="center"
                    gap="2"
                    px="3"
                    py="1"
                    bg="blue.100"
                    borderRadius="xl"
                  >
                    <Avatar src={u.pic} size="sm" />
                    <Text fontWeight="bold">{u.name}</Text>
                    <IconButton
                      size="xs"
                      colorScheme="red"
                      borderRadius="full"
                      icon={<CloseIcon />}
                      onClick={() => handleRemove(u)}
                    />
                  </Box>
                ))}
              </Box>

              {/* بحث عن أعضاء جدد */}
              <Input
                placeholder="Search users to add"
                onChange={(e) => handleSearch(e.target.value)}
                mb={3}
              />

              {loading ? (
                <Text>Loading...</Text>
              ) : (
                searchresult.map((u) => (
                  <Box
                    key={u._id}
                    onClick={() => handleAdd(u)}
                    p={2}
                    _hover={{ bg: "gray.200", cursor: "pointer" }}
                    display="flex"
                    alignItems="center"
                  >
                    <Avatar src={u.pic} size="sm" />
                    <Box ml={3}>
                      <Text fontWeight="bold">{u.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {u.email}
                      </Text>
                    </Box>
                  </Box>
                ))
              )}
            </>
          )}
        </ModalBody>

        {modalType === "group" && (
          <ModalFooter justifyContent={"space-between"}>
            <Button colorScheme="blue" onClick={handleSaveGroup}>
              Save
            </Button>
            <Button colorScheme="blue" onClick={removechat} bg={'red.00'}>
              remove chat
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
