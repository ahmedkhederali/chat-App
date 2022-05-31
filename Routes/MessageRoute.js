const router=require('express').Router();
const {protect} =require("../middleware/authMiddleWare.js")
const {sendMessage,allMessages}=require("../controllers/MsgCtrl")

router.route("/").post(protect,sendMessage)

//fetch All Messages Based On chat ID
router.route("/:chatid").get(protect,allMessages)

module.exports=router;
