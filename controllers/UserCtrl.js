const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");

const Register = async (req, res) => {
  try {
    if (!req.body.pic) {
      const { name, email, password,phone } = req.body;
      //check if user Already exist in DB or not
      const user = await User.findOne({ email });
      //return this message if user exist in db
      if (user) return res.status(400).json({ msg: "This user Already Exist" });
      //check length of password
      if (password.length < 6)
        return res.status(400).json({ msg: "Password must be More Than 5" });
        if (phone.length < 11)
        return res.status(400).json({ msg: "Password must be  11" });
      // ecrypt password
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: passwordHash,
        phone
      });

      //To Save In DB U Can USed Create But this is anthor way
      await newUser.save();
      const accesstoken = createAccessToken({ id: newUser._id });
      res.status(200).json({
        success: true,
        user: newUser,
        accesstoken: accesstoken,
      });
    } else {
      const myCloud = await cloudinary.v2.uploader.upload(req.body.pic, {
        folder: "chat-avatars",
        width: 150,
        crop: "scale",
      });

      const { name, email, password,phone } = req.body;
      //check if user Already exist in DB or not
      const user = await User.findOne({ email });
      //return this message if user exist in db
      if (user) return res.status(400).json({ msg: "This user Already Exist" });
      //check length of password
      if (password.length < 6)
        return res.status(400).json({ msg: "Password must be More Than 5" });
      // ecrypt password
      const passwordHash = await bcrypt.hash(password, 10);
      console.log(phone)
      const newUser = new User({
        name,
        email,
        password: passwordHash,
        pic: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        phone
      });

      //To Save In DB U Can USed Create But this is anthor way
      await newUser.save();
      const accesstoken = createAccessToken({ id: newUser._id });
      res.status(200).json({
        success: true,
        _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone:newUser.phone,
      pic: newUser.pic,
      accesstoken: accesstoken,
      });
    }
  } catch (error) {

    return res.status(500).json({ msg: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(500).json({ msg: "Enter Valid Email" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(500).json({ msg: "Incoorect Password" });

    const accesstoken = createAccessToken({ id: user._id });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      phone:user.phone,
      accesstoken: accesstoken,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
//get all users
const allUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    // it will select all users that match keyword and expect current user
    // $ne ===> not equel
    res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "30d" });
};

module.exports = { Register, Login, allUsers };
