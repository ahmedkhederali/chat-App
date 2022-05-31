import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/layout";
import SideDrwer from "../Components/SideDrwer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
function ChatPage() {
  const { user } = useContext(GlobalState);
 
  // console.log(user);
  return (
   

    <div style={{ width: "100%" }}>
      {user && <SideDrwer />}
      <Box display={"flex"} justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats />}
        {user && (
          <ChatBox />
        )}
      </Box>
    </div>
  );
}

export default ChatPage;
