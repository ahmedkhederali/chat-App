const router=require('express').Router();
const {protect} =require("../middleware/authMiddleWare.js")
const {accessChat, fetchChats,groupChats,renameGroupChats,addToGroup,removeGroupChats}=require("../controllers/ChatsCtrl")
// For Create Chats one to one user chat
router.route("/").post(protect , accessChat) 
//Get All Chats
router.route("/").get(protect , fetchChats) 
// // For Create group Chat
router.route("/groupchat").post(protect , groupChats) 
// // For rename group Chat
router.route("/renamechatgroup").put(protect , renameGroupChats) 
// // For remove group Chat
router.route("/removefromchatgroup").put(protect , removeGroupChats) 
// // For add member in group Chat
router.route("/groupaddnew").put(protect , addToGroup) 
module.exports=router;
