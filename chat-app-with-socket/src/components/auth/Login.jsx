import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../Url';

export default function Login() {
  const URL='https://47c9858a-f22c-45c1-af43-c7df59201e87-00-1ma9m0qigeuxf.picard.replit.dev/'
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      toast({
        title: 'Please fill all fields.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${BaseUrl}/api/user/login`, {
        email,
        password,
      });
      console.log(data);
      

      toast({
        title: 'Login successful!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      localStorage.setItem('userinfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chat');
    } catch (err) {
      console.log(err);
      
      toast({
        title: 'Login failed',
        description: err.response?.data?.message || err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <VStack spacing={4} align="stretch">
        <FormControl id="email-login">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id="password-login">
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={!show ? 'password' : 'text'}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShow(!show)}
              >
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          width="100%"
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>

        <Button
          colorScheme="red"
          width="100%"
          onClick={() => {
            setEmail('omar@gmail.com');
            setPassword('123456');
          }}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
    </div>
  );
}
