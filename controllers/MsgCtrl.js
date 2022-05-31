const User = require("../models/UserModel");
const Message = require("../models/MessageModel");
const Chat = require("../models/ChatModel");
const asyncHandler = require("express-async-handler");
// create Message 
const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      return res.status(400).json({ msg: "Invalid Data Passed In request" });
    }
    const newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "-password");
    message = await message.populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      // دي قيمة موجوده في المتغير اللي اسمه
      //(message)
      //ونا عاوز اختار اليوزرز بس
      //وبعدين افك اليوزرز للاسم والصوره والايميل بس
      select: "name pic email",
    });

    // each chat has a latest Message and we will update it
//console.log(message)
    const chat = await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    if (!chat) {
      return res.status(400).json({ msg: "No Chat With This ID" });
    }


  //  console.log(req.user._id)
    res.status(200).json({ message });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//Fetch All Messages Based On req,params.id
const allMessages = asyncHandler(async (req, res) => {
  try {
    const id=req.params.chatid;
    const messages=await Message.find({chat:id}).sort({createdAt:-1}).populate("sender","pic name email").populate("chat")
    
    res.status(200).json({ messages });

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = { sendMessage, allMessages };
