const router=require('express').Router();
const {Register,Login,allUsers}=require("../controllers/UserCtrl")
const {protect} =require("../middleware/authMiddleWare")
router.post('/register',Register)
router.post('/login',Login)
router.get('/allusers',protect,allUsers)

module.exports=router;
