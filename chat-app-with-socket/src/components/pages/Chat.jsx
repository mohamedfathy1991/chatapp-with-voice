import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Chatcontext } from '../../context/chatContext';
import { Box } from '@chakra-ui/react';
import Mychat from '../miscellouns/Mychat';
import Chatbox from '../miscellouns/Chatbox';
import Sidedrawer from '../miscellouns/Sidedrawer';
import { BaseUrl } from '../Url';

export default function Chat() {
  const { user,selectchat, setselectchat,chat, setchat ,loading} = useContext(Chatcontext);
  const navigate = useNavigate();
  const [data, setdata] = useState([]);

  const getdata = async () => {
    try {
      const { data } = await axios.post(`${BaseUrl}/api/chat`, {
        headers: {
          token: user.token
        }
      });
      setdata(data);
    } catch (err) {
      console.error("Error fetching chat data:", err);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/');
      } else {
        getdata();
      }
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      {user && <Sidedrawer/>}
      <Box  display="flex" justifyContent="space-between" bg={'green'}  w="100%" h='91.5vh' >
        {user &&<Mychat    />} 
         {user &&<Chatbox  selectchat={selectchat}/>}
      </Box >
    </div>
  );
}
