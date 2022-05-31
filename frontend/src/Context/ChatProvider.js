import React, { createContext, useState, useEffect } from "react";
import { useHistory } from "react-router";
export const GlobalState = createContext();


export const DataProvider = ({ children }) => {
  const history = useHistory();
  const [user,setUser]=useState("")
  const [selectedChat, setSelectedChat] = useState("");
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
const [renderAgain, setRenderAgain]=useState(false)

  useEffect(() => {
    
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    

     if (!userInfo) history.push("/")
  
  }, [history]);
 
  
  return <GlobalState.Provider 
  value={{
    user,
    setUser,
    renderAgain,
    setRenderAgain,
    chats,
    setChats,
    notification,
     setNotification,
     selectedChat, setSelectedChat
   }}
 >{children}</GlobalState.Provider>;
};
