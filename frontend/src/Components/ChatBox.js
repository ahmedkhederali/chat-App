import { Box } from "@chakra-ui/react";
import React, {useContext } from "react";

import { GlobalState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

function ChatBox() {
  const { selectedChat} = useContext(GlobalState);

  return (
    <>
    
    <Box
    display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
    alignItems="center"
    flexDir="column"
    justifyContent={"space-between"}
    p={3}
    bg="white"
    w={{ base: "100%", md: "68%" }}
    borderRadius="lg"
    borderWidth="1px"
  >
    <SingleChat/>
  </Box>
    </>
  )
}

export default ChatBox