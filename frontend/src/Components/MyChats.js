import React, { useState, useContext ,useEffect} from "react";
import { GlobalState } from "../Context/ChatProvider";

import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Button } from "@chakra-ui/react";
import { getSender } from "../Config/ChatLogin";
import ChatLoading from "./ChatLoading"
import GroupChatModal from "./GroupChatModal";

function MyChats() {
  const { user ,selectedChat,setSelectedChat,chats, setChats,renderAgain } = useContext(GlobalState);
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.accesstoken}`,
        },
      };
      const { data } = await axios.get("/api/v1/chats", config);
      
      setChats(data.chats);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
 
  }, [renderAgain]);


  
  
  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px"
  >
    <Box
      pb={3}
      px={3}
      fontSize={{ base: "28px", md: "30px" }}
      fontFamily="Work sans"
      display={"flex"}
      w="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      My Chats
      <GroupChatModal> 
        <Button
          d="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
        </GroupChatModal>
    </Box>
    <Box
      display={"flex"}
      flexDir="column"
      p={3}
      bg="#F8F8F8"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="hidden"
    >
      {chats ? (
        <Stack overflowY="scroll">
  
          {chats.map((chat) => (
           
            <Box
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
              color={selectedChat === chat ? "white" : "black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={chat._id}
            >  
          
            <Text>
          
            {!chat.isGroupChat
              ? (
                getSender(loggedUser, chat.users).name
                ): chat.chatName}
          </Text>
            </Box>
          ))}
        </Stack>
      ) : (
        <ChatLoading />
      )}
    </Box>
  </Box>
  )
}

export default MyChats