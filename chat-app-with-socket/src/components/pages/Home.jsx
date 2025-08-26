
import { Box, Button, Container, Link, Text ,Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import React from 'react'
import Register from '../auth/Register';
import Login from '../auth/Login';


export default function Home() {
    const variant = "outline"; // 👈 ضيف ده

  return (
    <Container maxW={'2xl'}>
     <Box  display={'flex'} justifyContent={'center'} bg={'white'} padding={'3px'}
       borderRadius={'lg'}
        m={'40px 0'}
     
     
     >
      <Text  fontSize={'x-large'}>wellcome to my chat app</Text>
     </Box>
   
          <Box w={'100%' } p='4' borderWidth={'1px' } borderRadius={'lg'} bg={'white'} >

         <Tabs variant="soft-rounded" colorScheme="teal" defaultIndex={0}>
        <TabList>
          <Tab   width={'50%'}  >LOGIN</Tab>
          <Tab width={'50%'}>Register</Tab>
          
        </TabList>

        <TabPanels>
          <TabPanel>
            
              <Login/>
                         
                
          </TabPanel>
          <TabPanel>
             
              <Register/>
            
          </TabPanel>
           
        </TabPanels>
      </Tabs>
          </Box>
    </Container>
  )
}
