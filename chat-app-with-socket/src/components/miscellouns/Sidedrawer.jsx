import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chatcontext } from "../../context/chatContext";
import ChatLoading from "./Chatloading";
import { Profilemodal } from "./Profilemodal";
import { BaseUrl } from "../Url";

export default function Sidedrawer() {
  const { user,  setselectchat,chats,setchats} =useContext(Chatcontext);

  // حالات البحث
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  // Drawer البحث
  const { isOpen, onOpen, onClose } = useDisclosure();
  // مودال البروفايل
  const {
    isOpen: isProfileOpen,
    onOpen: openProfile,
    onClose: closeProfile,
  } = useDisclosure();

  const navigate = useNavigate();

  const logouthandel = () => {
    localStorage.removeItem("userinfo");
    navigate("/");
  };

  const handelsearch = async () => {
    if (!searchTerm) {
      alert("please enter something to search");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${searchTerm}`,
        {
          headers: {
            token: user?.token,
          },
        }
      );
      setSearchResult(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const accesschat = async (userId) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BaseUrl}/api/chat`,
        { userId },
        {
          headers: {
            token: user?.token,
          },
        }
      );
   

      if(!chats.find((c)=>c.id==data.id)) setchats([data,...chats])

      setselectchat(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      bg="white"
      w="100%"
      p="5px 10px"
      borderWidth="5px"
    >
      {/* زر البحث يفتح الـ Drawer */}
      <Tooltip label="search user to chat" hasArrow>
        <Button variant="ghost" onClick={onOpen}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <Text px="2px">search</Text>
        </Button>
      </Tooltip>

      <Text fontSize="2xl" fontFamily="work sans">
        my chat app
      </Text>

      <div>
        <Menu>
          <MenuButton pt="5px">
            <i className="fa fa-bell" aria-hidden="true"></i>
          </MenuButton>
          <MenuList>
            <MenuItem>logout</MenuItem>
            <MenuItem>New File...</MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar
              size="sm"
              cursor="pointer"
              name={user?.user?.name}
              src={user?.user?.pic}
            />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={openProfile}>my profile</MenuItem>
            <MenuDivider />
            <MenuItem onClick={logouthandel}>log out</MenuItem>
          </MenuList>
        </Menu>
      </div>

      {/* مودال البروفايل */}
      <Profilemodal
        isOpen={isProfileOpen}
        onClose={closeProfile}
        user={user?.user}
      />

      {/* Drawer البحث */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search Users</DrawerHeader>
          <DrawerBody>
            <Input
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.length > 0 &&
              searchResult.map((u) => (
                <Box
                  key={u._id}
                  user={u}
                  onClick={() => accesschat(u._id)}
                  p={2}
                  mt={2}
                  borderWidth="1px"
                  borderRadius="md"
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                >
                  <Box>
                    <Box display={"flex"} justifyContent="space-between">
                      <Avatar src={u.pic} />
                      <Text>{u.name}</Text>
                    </Box>
                    <Text>{u.email}</Text>
                  </Box>
                </Box>
              ))
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handelsearch} colorScheme="blue">
              Search
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
