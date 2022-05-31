require('dotenv').config()
const express= require('express')
const mongoose = require("mongoose");
const PORT=process.env.PORT || 5000
const app=express()
const {chats}=require("./data/data")
const connect=require("./db/connect")
const NotFound=require("./middleware/NotFound")
const error_handler=require("./middleware/ErrorHandler")
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const path = require("path");
app.use(express.static("./frontend/build"));
app.use(express.json());
app.use(fileUpload({useTempFiles: true,}));

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRT
})



app.use("/api/v1/user",require("./Routes/UserRoutes"))
app.use("/api/v1/chats",require("./Routes/ChatRoutes"))
app.use("/api/v1/message",require("./Routes/MessageRoute"))


// --------------------------deployment------------------------------

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('frontend/build'))
  app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','build','index.html'))
  })
}


// --------------------------deployment------------------------------

app.use(NotFound)
app.use(error_handler)
const start = async () => {
    try {
      // connectDB
      await connect(process.env.MONGO_URI);
      const server=app.listen(PORT, () => console.log(`Server is listening port ${PORT}...`));
      //socket.io
    const io=require("socket.io")(server,{
      pingTimeout: 60000,
      cors: {
        origin: "http://localhost:3000", 
      },
    })
    // To make connection
    io.on("connection",(socket)=>{
      console.log("connect")
      // setup used To create new socket
      socket.on('setup',(userData)=>{
        socket.join(userData._id);
        socket.emit("connected")
      })
     // create a room for chat 
      socket.on("join chat" ,(room)=>{
        socket.join(room);//make a unique room  for selected users
        console.log("User Joined Room " + room)
      })
      // handle Typing , stop Typing
      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      //handle New Message
      socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat; 
        if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach((user) => {
         //to didn't send to me 
          if (user._id == newMessageRecieved.sender._id) return;

          //loop in users and execute this emit on each user
           socket.in(user._id).emit("message recieved", newMessageRecieved);
         });
      });
      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });

    })


    } catch (error) {
      console.log(error);
    }
  };
  
  start();
