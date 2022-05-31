import React, { Fragment } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useContext } from "react";
import { GlobalState } from "../Context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import USerListItem from "./USerListItem";

const UpdateGroupChatModal = ({fetchAllMessage}) => {
  const { user, selectedChat, setSelectedChat, chats, setChats,renderAgain,setRenderAgain } =
    useContext(GlobalState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [search, setSearch] = useState(selectedChat.chatName);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

const handleRemoveUser = () => {};
//Rename Group Name
  const handleRename=async()=>{
    if (!groupChatName) return;
      try {
        setRenameLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.accesstoken}`,
          },
        };

        const { data } = await axios.put(
            `/api/v1/chats/renamechatgroup`,
            {
              chatId: selectedChat._id,
              chatName: groupChatName,
            },
            config
          );

          console.log(data._id);
          // setSelectedChat("");
          setSelectedChat(data);
          setRenderAgain(!renderAgain);
          setRenameLoading(false);
      } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setRenameLoading(false);
        }
        setGroupChatName("");
      
  }
//Handle Search
const handleSearch = async (searchval) => {
  setSearch(searchval);
  // setSearch(searchval);
  if (!searchval) {
    console.log("empty");
    searchval = null;
    setLoading(true);
  }

  try {
    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.accesstoken}`,
      },
    };

    const { data } = await axios.get(
      `/api/v1/user/allusers?search=${searchval}`,
      config
    );
    setLoading(false);
    setSearchResult(data.users);
  } catch (error) {
    toast({
      title: "Failed to Create the Chat!",
      description: error.response.data,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
};
// Handle Add User 
const handleAddUser = async (user1) => {
  if (selectedChat.users.find((u) => u._id === user1._id)) {
    toast({
      title: "User Already in group!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  if (selectedChat.groupAdmin._id !== user._id) {
    toast({
      title: "Only admins can add someone!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.accesstoken}`,
      },
    };
    const { data } = await axios.put(
      `/api/v1/chats/groupaddnew`,
      {
        chatId: selectedChat._id,
        userId: user1._id,
      },
      config
    );

    setSelectedChat(data);
    setRenderAgain(!renderAgain);
    setLoading(false);
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
  }
  setGroupChatName("");
};
//Remove User
const handleRemove = async (user1) => {
  if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
    toast({
      title: "Only admins can remove someone!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.accesstoken}`,
      },
    };
    const { data } = await axios.put(
      `/api/v1/chats/removefromchatgroup`,
      {
        chatId: selectedChat._id,
        userId: user1._id,
      },
      config
    );
// if admin leave group it will be removed from chats
    user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
    setRenderAgain(!renderAgain);
    fetchAllMessage() // to exec when u delete a user 
    setLoading(false);
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
  }
  setGroupChatName("");
};

return (
  <Fragment>
    <IconButton
      display={{ base: "flex" }}
      icon={<ViewIcon />}
      onClick={onOpen}
    />

    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
        >
          {selectedChat.chatName}
        </ModalHeader>

        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column" alignItems="center">
          <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users?.map((user) => (
              <UserBadgeItem
                key={user._id}
                user={user}
                handleFunction={handleRemoveUser}
              />
            ))}
          </Box>
          <FormControl display="flex">
            <Input
              placeholder="Chat Name"
              mb={3}
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button
              variant="solid"
              colorScheme="teal"
              ml={1}
              mb={2}
              isLoading={renameloading}
                onClick={handleRename}
            >
              Update
            </Button>
          </FormControl>
          <FormControl>
            <Input
              placeholder="Add User to group"
              mb={1}
                onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>
          {loading ? (
            <Spinner size="lg" />
          ) : (
            searchResult?.map((user) => (
              <USerListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}
          
        </ModalBody>
        <ModalFooter>
        <Button onClick={() => handleRemove(user)} colorScheme="red">
        Leave Group
      </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Fragment>
);
};

export default UpdateGroupChatModal;
