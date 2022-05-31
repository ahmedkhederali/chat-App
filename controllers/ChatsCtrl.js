const User = require("../models/UserModel");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const Chat = require("../models/ChatModel");
const asyncHandler = require("express-async-handler");
//create Chat one to one chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  // define variable to check if this chat already exist
// console.log(req.user._id)
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  // console.log(isChat)
  //if chat exist  result od is chat must be an arry consist from one element
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    //create new chat
    //console.log(req.user._id)
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});
//get All Chats with user.req.id not all chats in DB
const fetchChats = asyncHandler(async (req, res) => {
  try {
    //to return all chat of user not all chats
   // console.log(req.user._id);
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort("-updatedAt");

    res.status(200).json({ chats: chats });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
//Make Group Admin And Make Login user is an Admin
const groupChats = asyncHandler(async (req, res) => {
  //enter two thing
  // 1) name of chat     2) users to group chat must be more than 2
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users); // "[\"62806454f6fe8874ef2298c7\",\"6280647af8f1819533c74ab6\"]"
 // console.log(users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  //to add me in group
 //console.log(req.user);
  users.push(req.user);

  try {
    //Create Group Chat
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user, // to make me an admin
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const renameGroupChats = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {chatName: chatName,},
    {new: true,})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// Added new User in group depend on chatId and UserId
const addToGroup=asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  // check if the requester is admin
  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId },},
    { new: true,}
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
})

// remove user from group chat
const removeGroupChats=asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    // check if the requester is admin
    const remove = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId },},
      { new: true,}
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!remove) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(remove);
    }
})
module.exports = { accessChat,
     fetchChats,
      groupChats, 
      renameGroupChats,
      addToGroup,
      removeGroupChats
     };
