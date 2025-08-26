import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { BaseUrl } from '../Url';
 
export default function Register() {
  const toast = useToast();
const navigate=useNavigate()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState('');
   const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please fill all fields.',
        description: 'You are not registered.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match.',
        description: 'You are not registered.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${BaseUrl}/api/user/register`, {
        name,
        email,
        password,
        pic,
      });
      console.log(data);
      setLoading(false);
      toast({
        title: 'Registration successful.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
       localStorage.setItem('userinfo',JSON.stringify(data))
       navigate('/chat')
     } catch (err) {
      console.log(err);
      toast({
        title: 'Error occurred.',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const postDetails = async (pics) => {
    setLoading(true);
    if (!pics) return;

    if (pics.type === 'image/png' || pics.type === 'image/jpeg') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'djtzzoex5');

      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/djtzzoex5/image/upload', {
          method: 'POST',
          body: data,
        });

        const result = await res.json();
        setPic(result.secure_url);
        setLoading(false);
        console.log('Uploaded Image URL:', result.secure_url);
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl id="name">
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter your name" onChange={(e) => setName(e.target.value)} />
      </FormControl>

      <FormControl id="email">
        <FormLabel>Email</FormLabel>
        <Input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
      </FormControl>

      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            <Button size="sm" variant="ghost" onClick={() => setShow(!show)}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm-password">
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement>
            <Button size="sm" variant="ghost" onClick={() => setShow(!show)}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload Picture</FormLabel>
        <Input type="file" accept="image/*" onChange={(e) => postDetails(e.target.files[0])} />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        isLoading={loading}
        onClick={submitHandler}
      >
        Register
      </Button>
    </VStack>
  );
}
