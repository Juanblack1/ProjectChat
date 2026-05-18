import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { addDemoMessage, createDemoMessage, readFileAsDataUrl } from "@/utils/DemoData";
import { sendMessage as sendSupabaseMessage } from "@/utils/SupabaseChat";
import EmojiPicker from "emoji-picker-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";
const CaptureAudio = dynamic(() => import("../common/CaptureAudio"),{ssr:false});



function MessageBar() {
  const [{userInfo,currentChatUser}, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if(event.target.id !== "emoji-open" ) {
        if(emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
          setShowEmojiPicker(false)
        }
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    }
  }, []);

  // useEffect(() => {
  //   const handleOutsideClickPhoto = (event) => {
  //     if(event.target.id !== "photo-picker" ) {
  //         setGrabPhoto(false)
  //     }
  //   }
  //   document,addEventListener("click", handleOutsideClickPhoto);
  //   return () => {
  //     document.removeEventListener("click", handleOutsideClickPhoto);
  //   }
  // }, []);

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => (prevMessage+=emoji.emoji))
  };

  const sendMessage = async() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    try {
      if (IS_DEMO_MODE) {
        const newMessage = createDemoMessage({
          contactId: currentChatUser.id,
          type: "text",
          message: trimmedMessage,
        });
        addDemoMessage(currentChatUser.id, newMessage);
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage,
        });
        setMessage("")
        return;
      }

      const newMessage = await sendSupabaseMessage({
        from: userInfo?.id,
        to: currentChatUser?.id,
        message: trimmedMessage,
      });
      if (newMessage) {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage,
          fromSelf: true,
        });
      }
      setMessage("")
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(()=> {
    if(grabPhoto) {
      const data = document.getElementById("photo-picker")
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false)
        }, 1000)
      };
    };
  }, [grabPhoto]);

  const photoPickerChange = async (e) => {
    try{
      const file = e.target.files[0];
      if (!file) return;

      if (IS_DEMO_MODE) {
        const imageUrl = await readFileAsDataUrl(file);
        const newMessage = createDemoMessage({
          contactId: currentChatUser.id,
          type: "image",
          message: imageUrl,
        });
        addDemoMessage(currentChatUser.id, newMessage);
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage,
          fromSelf: true,
        });
        setGrabPhoto(false);
        return;
      }

      const imageUrl = await readFileAsDataUrl(file);
      const newMessage = await sendSupabaseMessage({
        from: userInfo?.id,
        to: currentChatUser?.id,
        message: imageUrl,
        type: "image",
      });
      if(newMessage) {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage,
          fromSelf: true,
        });
      }
      setGrabPhoto(false);
    } catch(err){
      console.log(err)
    }
  };

  return( 
  <div className="bg-panel-header-background min-h-20 px-4 flex items-center gap-6 relative border-l border-conversation-border border-t border-conversation-border">
    {
      !showAudioRecorder && (
    <>
        <div className="flex gap-6">
      <BsEmojiSmile
      className="text-panel-header-icon cursor-pointer text-xl hover:text-primary-strong"
      title="Emoji"
      id="emoji-open"
      onClick={handleEmojiModal}
      />
      {
        showEmojiPicker && 
      <div className="absolute bottom-24 left-16 z-40"
      ref={emojiPickerRef}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
      </div>
      }
      <ImAttachment
      className="text-panel-header-icon cursor-pointer text-xl hover:text-primary-strong"
      title="Attach File"
      onClick={() => {
        setGrabPhoto (true)
      }}
      />
    </div>
    <div className="w-full rounded-lg h-11 flex items-center">
      <input
      type="text"
      placeholder="Mensagem"
      className="bg-input-background text-sm focus:outline-none focus:ring-1 focus:ring-icon-green/60 text-white h-11 rounded-lg px-5 py-4 w-full placeholder:text-secondary"
      onChange={e => setMessage(e.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          sendMessage();
        }
      }}
      value={message}
      />
    </div>
    <div className="flex w-10 items-center justify-center">
        <button type="button" className="h-10 w-10 rounded-full hover:bg-background-default-hover flex items-center justify-center">
      {
        message.length? (
          <MdSend 
          className="text-icon-green cursor-pointer text-2xl"
          title="Send message"
          onClick={sendMessage}
          />):(
            <FaMicrophone
            className="text-panel-header-icon cursor-pointer text-xl hover:text-primary-strong"
            title="Record"
            onClick={() => setShowAudioRecorder(true)}
            />
      )}
      </button>
    </div>
    </>
  )
}
    {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    {
      showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />
    }
  </div>
  );
}

export default MessageBar;
