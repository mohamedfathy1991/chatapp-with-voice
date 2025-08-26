import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  IconButton
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import React, { useContext, useState } from 'react'
import { Chatcontext } from '../../context/chatContext'
import axios from 'axios'
import { BaseUrl } from '../Url'

export default function Groupchatmodel({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, chats, setchats } = useContext(Chatcontext)
  const [groupname, setgroupname] = useState()
  const [selecteduser, setselecteduser] = useState([])
  const [search, setsearch] = useState([])
  const [searchresult, setsearchresult] = useState([])
  const [loading, setLoading] = useState(false)

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  const hahdlesearch = async (query) => {
    setsearch(query)
    if (!query) {
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.get(
        `${BaseUrl}/api/user?search=${query}`,
        {
          headers: {
            token: user?.token,
          },
        }
      )
      setLoading(false)
      setsearchresult(data)
    } catch (err) {
      setLoading(false)
      alert('there is err', err)
      console.log(err)
    }
  }

  const handelGroup = (user) => {
    if (selecteduser.find((u) => u._id === user._id)) {
      alert('user already exist')
    } else {
      setselecteduser([...selecteduser, user])
    }
  }

  const handleRemove = (user) => {
    setselecteduser(selecteduser.filter((u) => u._id !== user._id))
  }
  const handelsubmit=async()=>{

     try {
      const { data } = await axios.post(
        `${BaseUrl}/api/chat/group`,{
            chatname:groupname,
            users:JSON.stringify(selecteduser)

        },
        {
          headers: {
            token: user?.token,
          },
        }
      )
      setLoading(false)
      setchats(data)
    } catch (err) {
      setLoading(false)
      alert('there is err', err)
      console.log(err)
    }

  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create group chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Chat name</FormLabel>
              <Input
                ref={initialRef}
                placeholder='chat name'
                onChange={(e) => setgroupname(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Users</FormLabel>

              {selecteduser.length > 0 ? (
                <Box display='flex' flexWrap='wrap' gap='2'>
                  {selecteduser.map((u) => (
                    <Box
                      key={u._id}
                      display='flex'
                      alignItems='center'
                      gap='2'
                      px='3'
                      py='1'
                      bg='blue.100'
                      borderRadius='xl'
                    >
                      <Avatar src={u.pic} size='sm' />
                      <Text fontWeight='bold'>{u.name}</Text>
                      <IconButton
                        size='xs'
                        colorScheme='red'
                        borderRadius='full'
                        icon={<CloseIcon />}
                        onClick={() => handleRemove(u)}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Text fontWeight='bold' color='red.500'>
                  please select user
                </Text>
              )}

              <Input
                placeholder='Enter name '
                onChange={(e) => hahdlesearch(e.target.value)}
                mt={3}
              />
            </FormControl>

            {loading ? (
              <h3>loading...</h3>
            ) : (
              searchresult?.map((user) => (
                <Box
                  key={user._id}
                  onClick={() => handelGroup(user)}
                  p={3}
                  _hover={{ bg: 'gray.200', cursor: 'pointer' }}
                  display='flex'
                  alignItems='center'
                >
                  <Avatar src={user.pic} size='md' />

                  <Box ml={3} flex='1'>
                    <Text fontWeight='bold' color='green'>
                      {user.name}
                    </Text>
                    <Text fontSize='sm' color='gray.500'>
                      {user.email}
                    </Text>
                  </Box>
                </Box>
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3}  onClick={handelsubmit} >
              Save 
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
