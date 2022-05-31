import React, { useState, useContext } from "react";
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
} from "@chakra-ui/react";
import axios from "axios";
import { GlobalState } from "../Context/ChatProvider";
import USerListItem from "./USerListItem";
import { Spinner } from "@chakra-ui/spinner";
import UserBadgeItem from "./UserBadgeItem";

function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, selectedChat, setSelectedChat, chats, setChats } =
    useContext(GlobalState);
  // console.log(chats)
  //Handle Onclick To create chatGroup
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
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

      const { data } = await axios.post(
        `/api/v1/chats/groupchat`,
        { users: JSON.stringify(selectedUsers), name: groupChatName },
        config
      );

      setLoading(false);
      setChats([data, ...chats]); // put data before ...chat to make it before it

      // alert To know User Group Is Created
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create Gropu Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

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
  //check your already in group or not
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User Already ADDED!",

        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* Render Selected User*/}
            {selectedUsers?.map((user) => (
              <UserBadgeItem
                key={user._id}
                user={user}
                handleFunction={() => handleDelete(user)}
              >
                {user.name}
              </UserBadgeItem>
            ))}
            {/* Render SearchResult of Users */}
            <Box w="100%" d="flex" flexWrap="wrap">
              {loading ? (
                // <ChatLoading />
                <div>
                  <Spinner />
                </div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <USerListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal;
