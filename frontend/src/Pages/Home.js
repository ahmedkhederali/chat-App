import React, {useEffect } from "react";

import {   Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text } from "@chakra-ui/react";
import Login from "./Login";
import Signup from "./Signup";

function Home({history}) {
  
  useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"))    
    if(userInfo){
      history.push("/chats")
    }
},[history])
  //Box Like div
  return (
    <Container maxW="xl" centerContent>
      <Box
      display='flex'
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" textAlign="center">
          Chat App
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
      <Tabs isFitted variant="soft-rounded">
      
      <TabList mb="1em">
        <Tab>Login</Tab>
        <Tab>Sign Up</Tab>
      </TabList>
      
      <TabPanels>
        <TabPanel>
          <Login />
        </TabPanel>
        <TabPanel>
          <Signup />
        </TabPanel>
      </TabPanels>
    </Tabs>
      </Box>
    </Container>
  );
}

export default Home;
