import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { CHECK_USER_ROUTE, GET_MESSAGE_ROUTE, HOST } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Chat from "./Chat/Chat";
import SearchMessages from "./Chat/SearchMessages";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";

function Main() {
  const router = useRouter();
  const [{userInfo, currentChatUser, messagesSearch}, dispatch] = useStateProvider()
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [socketEvent, setSocketEvent] = useState(false);
  const socket = useRef();

  useEffect(() => {
    if(redirectLogin) router.push("/login")
  }, [redirectLogin])

  onAuthStateChanged(firebaseAuth, async(currentUser)=> {
    if(!currentUser) setRedirectLogin(true)
    if(!userInfo && currentUser?.email){
      const {data} = await axios.post(CHECK_USER_ROUTE, {
        email:currentUser.email
      })
      if(data?.data){
        if(!data.status) {
          router.push("/login")
        }
        else {
          const {id,name,email,profilePicture:profileImage, status} = data.data;
          dispatch({
            type:reducerCases.SET_USER_INFO,
            userInfo:{
              id, name, email, profileImage, status
            }
          })
        }
      }
    }
  })

  useEffect(() => {
    if(userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({type:reducerCases.SET_SOCKET, socket})
    }
  }, [userInfo]);

  useEffect(() => {
    if(socket.current && !socketEvent) {
      socket.current.on("msg-recieve", (data) => {
        dispatch({
          type:reducerCases.ADD_MESSAGE, 
          newMessage:{
            ...data.message,
          }
        })
      })
      setSocketEvent(true)
    }
  }, [socket.current])

  useEffect(() => {
    const getMessages = async () => {
      const {data:{messages}} = await axios.get(`${GET_MESSAGE_ROUTE}/${userInfo.id}/${currentChatUser.id}`)
      dispatch({
        type:reducerCases.SET_MESSAGES, messages
      })
    };
    if(currentChatUser?.id){
      getMessages()
    }
  }, [currentChatUser])
  
  return (
  <>
  <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full over">
    <ChatList  />
    {
      currentChatUser ?( 
      <div className={messagesSearch ? "grid grid-cols-2" : "grid-cols-2"}>
      <Chat />
      {
        messagesSearch && <SearchMessages  />
      }
      </div> 
      ): (
      <Empty />
      )
    }
  </div>
  </>
  );
}

export default Main;
