import {
  ArrowBackIcon,
  ArrowForwardIcon,
  AttachmentIcon,
  PhoneIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, Fragment, useState, useEffect } from "react";
import { GlobalState } from "../Context/ChatProvider";
import { getSender } from "../Config/ChatLogin";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import "./style.css";
import ScrollbarChat from "./ScrollbarChat";

// socket.io
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
// selectedChatCompare to check if user is open chat or i will send a notification
var socket, selectedChatCompare;

function SingleChat() {
  const { user, selectedChat, setSelectedChat, renderAgain, setRenderAgain,notification,
    setNotification } =
    useContext(GlobalState);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [files,setFiels]=useState()
  const toast = useToast();

  //useEffect of Socket.io connect
  useEffect(() => {
    socket = io(ENDPOINT); // connect to socket.io in backend
    socket.emit("setup", user); //setup used To create new socket
    socket.on("connected", () => setSocketConnected(true));
    //Typing sockt.io
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);
  const fetchAllMessage = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.accesstoken}`,
        },
      };
      const { data } = await axios.get(
        `/api/v1/message/${selectedChat._id}`,
        config
      );
      setMessages(data.messages);
      setLoading(false);
      //socket io
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    fetchAllMessage();
    //sockt io
    // selectedChatCompare to check if user is open chat or i will send a notification
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  //constantly running out
  console.log(notification)
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // if chat is not selected or doesn't match current chat
        //notification
        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved,...notification])
          setRenderAgain(!renderAgain)
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  // Handle Send Message By press Enter
  const sendMessage = async (e) => {
    if (e.key == "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.accesstoken}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `/api/v1/message`,
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          config
        );
       
        socket.emit("new message", data.message);
        //append data which return to messages
        setMessages([...messages, data.message]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  //Handle when written
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //check connecting
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      console.log(selectedChat);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  // handle On click on Buton
  const sendMessageByPressOnBtn = async (e) => {
    socket.emit("stop typing", selectedChat._id);

    if (newMessage) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.accesstoken}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `/api/v1/message`,
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          config
        );
        socket.emit("new message", data.message);

        //append data which return to messages
        setMessages([...messages, data.message]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  //Handle  Upload file
  const handleUploadFile = (e) => {
    console.log("ok")
  };

  return (
    <Fragment>
      {selectedChat ? (
        <Fragment>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <Fragment>
                {getSender(user, selectedChat.users).name}
                <ProfileModal
                  user={getSender(user, selectedChat.users)}
                ></ProfileModal>
              </Fragment>
            ) : (
              <Fragment>
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  fetchAllMessage={fetchAllMessage} // to send All messgae to this componet
                />
              </Fragment>
            )}
          </Text>
          {/* special For messgae*/}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} margin="auto" />
            ) : (
              <div className="message">
                {/*make a component to show chat's message*/}

                <ScrollbarChat messages={messages} />
              </div>
            )}
          </Box>

          <FormControl display="flex" onKeyDown={sendMessage} mt={3}>
            {isTyping ? 
              <div style={{width:"50px"}}>
                <img src="write.gif"/>
              </div> : <Fragment></Fragment>}
            <InputGroup>
              <Input
                placeholder="Type A Message"
                onChange={typingHandler}
                value={newMessage}
              />
              <InputRightElement
                mr={3}
                cursor="pointer"
                children={
                  <HStack>
                    
                  
                    <Tooltip label="Upload Files">
                      <AttachmentIcon
                        title="Upload Files"
                        color="gray.300"
                        onClick={handleUploadFile}
                      ></AttachmentIcon>
                    </Tooltip>
                    <Tooltip label={user.phone}>
                    
                     <PhoneIcon color="gray.300" />
                   
                    </Tooltip>
                  </HStack>
                }
              />
            </InputGroup>
            <Button
              onClick={sendMessageByPressOnBtn}
              rightIcon={<ArrowForwardIcon />}
              variant="solid"
              colorScheme="teal"
              ml={1}
            >
              Send
            </Button>
          </FormControl>
        </Fragment>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </Fragment>
  );
}

export default SingleChat;
